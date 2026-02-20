"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover" as any, // Explicitly matching the type expectation
});

export async function createCheckoutSession(priceInCents: number, creditsAmount: number, currency: 'brl' | 'usd' = 'brl') {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: `${creditsAmount} Credits - AI Speaking Object`,
                        description: currency === 'brl' ? "Créditos para gerar vídeos e imagens." : "Credits to generate videos and images.",
                    },
                    unit_amount: priceInCents,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${origin}/credits?success=true`,
        cancel_url: `${origin}/credits?canceled=true`,
        metadata: {
            user_id: user.id,
            credits_amount: creditsAmount.toString(),
        },
        customer_email: user.email,
    });

    if (!session.url) {
        throw new Error("Failed to create Stripe Checkout Session");
    }

    return session.url;
}
