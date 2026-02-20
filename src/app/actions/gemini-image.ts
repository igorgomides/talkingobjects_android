"use server";

import { createClient } from '@/utils/supabase/server';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function generateImageWithImagen(prompt: string, scenarioPrompt: string = ""): Promise<string> {
    const supabase = await createClient();

    // 1. Auth & Credit Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

    if (!profile || profile.credits < 1) {
        throw new Error(`Insufficient credits for Image. You need 1 credit.`);
    }

    if (!apiKey) throw new Error("API Key do Gemini não configurada");

    console.log("Generating image with Imagen 4.0...");

    // Construct final prompt with scenario
    // "A 3D render of a [OBJECT], [EMOTION], style Pixar, high quality, [SCENARIO_PROMPT], medium shot, 8k resolution."
    // The incoming 'prompt' from frontend already contains Object + Emotion + Style (from Gemini script step usually, or user input).
    // But per requirements, we are refactoring. 
    // Actually, 'prompt' passed here comes from 'formData.prompt' which is "Generate the prompt to approve...".
    // We should append the scenario to it.

    const finalPrompt = `${prompt}, ${scenarioPrompt}, style Pixar, 3D render, 8k resolution, medium shot`.replace(', ,', ',');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

    const payload = {
        instances: [
            {
                prompt: finalPrompt,
                aspectRatio: "9:16" // Vertical for Reels
            }
        ],
        parameters: {
            sampleCount: 1,
        }
    };

    const startTime = Date.now();
    let status = 'success';
    let errorMessage = null;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Imagen API Error:", errorText);
            throw new Error(`Erro na API do Imagen: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();

        // Response structure for Imagen on Gemini API:
        // { predictions: [ { bytesBase64Encoded: "..." } ] }
        if (data.predictions && data.predictions.length > 0 && data.predictions[0].bytesBase64Encoded) {

            // 2. Upload to Storage & Deduct Credit
            const { error: updateError } = await supabase.rpc('decrement_credits', { user_id: user.id, amount: 1 });
            if (updateError) console.error("Failed to deduct credit for image:", updateError);

            const base64Image = data.predictions[0].bytesBase64Encoded;
            let publicUrl: string | null = null;
            let uploadErrorMsg = null;

            // Upload to Supabase Storage ('assets' bucket)
            try {
                // Convert base64 to Buffer
                const buffer = Buffer.from(base64Image, 'base64');
                const fileName = `images/${user.id}/${Date.now()}.png`;

                const { error: uploadError } = await supabase.storage
                    .from('assets')
                    .upload(fileName, buffer, {
                        contentType: 'image/png',
                        upsert: false
                    });

                if (uploadError) {
                    console.error("Failed to upload image to storage:", uploadError);
                    uploadErrorMsg = uploadError.message;
                } else {
                    const { data: publicData } = supabase.storage
                        .from('assets')
                        .getPublicUrl(fileName);

                    publicUrl = publicData.publicUrl;
                }
            } catch (err) {
                console.error("Storage upload exception:", err);
            }

            // 3. Analytics Logging (Moved inside success block or use temp var)
            // We'll log here since we have the URL now.
            const duration = Date.now() - startTime;
            const { error: logError } = await supabase.from('usage_logs').insert({
                user_id: user.id,
                action_type: 'image',
                model_used: 'imagen-4.0-generate-001',
                credits_deducted: 1,
                latency_ms: duration,
                status: 'success',
                error_message: null,
                provider_cost: 0.055,
                asset_url: publicUrl || `[Base64 Image - Upload Failed: ${uploadErrorMsg}]`
            });
            if (logError) console.error("Failed to log usage:", logError);

            // Return Base64 for immediate display (faster)
            return `data:image/png;base64,${base64Image}`;
        } else {
            console.error("Unexpected Imagen response:", data);
            throw new Error("Formato de resposta do Imagen inválido");
        }

    } catch (error: any) {
        console.error("Erro ao gerar imagem com Imagen:", error);
        // Log Error Case
        const duration = Date.now() - startTime;
        const { error: logError } = await supabase.from('usage_logs').insert({
            user_id: user.id,
            action_type: 'image',
            model_used: 'imagen-4.0-generate-001',
            credits_deducted: 0,
            latency_ms: duration,
            status: 'error',
            error_message: error.message.substring(0, 1000),
            provider_cost: 0,
            asset_url: null
        });
        if (logError) console.error("Failed to log error usage:", logError);

        throw error;
    }
}
