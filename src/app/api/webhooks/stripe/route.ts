import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover" as any, // Using latest API version
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        if (!webhookSecret) {
            throw new Error("Missing STRIPE_WEBHOOK_SECRET");
        }
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Stripe Webhook Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const creditsAmount = Number(session.metadata?.credits_amount);

        console.log(`💰 Payment success! User: ${userId}, Credits: ${creditsAmount}`);

        if (userId && creditsAmount) {
            // Use Supabase Service Role to bypass RLS and write to restricted tables
            const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

            if (!serviceRoleKey || !supabaseUrl) {
                console.error("❌ Missing Supabase Configuration for webhook.");
                return new NextResponse("Server Configuration Error", { status: 500 });
            }

            const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            });

            // 1. Log Transaction
            const { error: txError } = await adminSupabase.from("transactions").insert({
                user_id: userId,
                stripe_session_id: session.id,
                amount_paid: session.amount_total, // Amount in cents
                credits_added: creditsAmount,
                status: "completed",
                livemode: session.livemode, // Capture Test vs Live
            });

            if (txError) {
                console.error("Error logging transaction:", txError);
                // We don't stop here, we still want to give credits
            }

            // 2. Add Credits (using RPC for atomicity if available, or direct update)
            const { error: updateError } = await adminSupabase.rpc('increment_credits', {
                user_id: userId,
                amount: creditsAmount
            });

            if (updateError) {
                console.warn("RPC increment_credits failed, falling back to direct update.", updateError);
                // Fallback: Read-Modify-Write (less safe but works)
                const { data: profile } = await adminSupabase.from("profiles").select("credits").eq("id", userId).single();
                if (profile) {
                    const { error: directUpdateError } = await adminSupabase
                        .from("profiles")
                        .update({ credits: (profile.credits || 0) + creditsAmount })
                        .eq("id", userId);

                    if (directUpdateError) {
                        console.error("❌ CRITICAL: Failed to add credits directly!", directUpdateError);
                        return new NextResponse("Failed to update credits", { status: 500 });
                    }
                }
            }

            console.log(`✅ Credits added successfully for user ${userId}`);
        }
    }

    return new NextResponse("Received", { status: 200 });
}
