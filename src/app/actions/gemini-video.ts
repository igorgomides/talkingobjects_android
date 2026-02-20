"use server";

import { createClient } from '@/utils/supabase/server';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Helper for polling delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Recursively find a key in an object
function findKeyRecursive(obj: any, key: string): any {
    if (obj && typeof obj === 'object') {
        if (key in obj) return obj[key];
        for (const k in obj) {
            const found = findKeyRecursive(obj[k], key);
            if (found) return found;
        }
    }
    return undefined;
}



// ... existing imports ...

// CHANGED: Use FormData to avoid Next.js JSON serialization limits (Maximum array nesting)
export async function generateVideoWithVeo(formData: FormData): Promise<string> {
    const supabase = await createClient();

    // 3. Prepare Request
    const prompt = formData.get('prompt') as string;
    const scenarioPrompt = formData.get('scenarioPrompt') as string || "";
    const imageBase64 = formData.get('image') as string; // Expecting base64 string
    const quality = formData.get('quality') as string || 'fast'; // 'fast' | 'quality'
    const mimeType = "image/png";

    // Determine Logic based on Quality
    // Veo 3 Fast: ~10 credits. Veo 3 Quality: ~40 credits.
    const isFast = quality === 'fast';
    // Updated Costs (Fed 2026): Proportional to 6s duration
    // Fast: 15 credits
    // Quality: 40 credits
    const creditCost = isFast ? 15 : 40;

    // Manufacturer: Google
    // Model ID: Use 3.1 for generic if available.
    // Quality: 'veo-3.1-generate-preview' (confirmed working)
    // Fast: 'veo-3.1-fast-generate-preview'
    // Updated Model Selection based on available models (Feb 2026)
    // Fast: 'veo-3.1-fast-generate-preview'
    // Quality: 'veo-3.1-generate-preview'
    const modelId = isFast ? "veo-3.1-fast-generate-preview" : "veo-3.1-generate-preview";

    // 1. Auth & Credit Check (Moved down to use calculated creditCost)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

    if (!profile || profile.credits < creditCost) {
        throw new Error(`Insufficient credits. ${isFast ? 'Fast' : 'Quality'} Video costs ${creditCost} credits. You have ${profile?.credits || 0}.`);
    }

    if (!apiKey) throw new Error("API Key do Gemini não configurada");

    // Enhance prompt for Veo to respect physics but keep background
    const videoPrompt = `${prompt}. ${scenarioPrompt}. Keep the background exactly as in the image. Cinematic lighting.`;

    // Veo Endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:predictLongRunning?key=${apiKey}`;

    const payload = {
        instances: [
            {
                prompt: videoPrompt,
                image: {
                    bytesBase64Encoded: imageBase64 ? imageBase64.split(',')[1] : null,
                    mimeType: mimeType
                }
            }
        ],
        parameters: {
            sampleCount: 1,
            durationSeconds: 6, // Enforce 6s duration
            negativePrompt: "bad quality, blurry, distorted, watermark, text"
        }
    };

    const startTime = Date.now();
    let status = 'success';
    let errorMessage = null;
    let videoUri = "";

    try {
        // 1. Start Operation
        console.log("Starting Veo operation with URL:", url);
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Veo Start Error:", errorText);
            throw new Error(`Erro ao iniciar Veo: ${response.statusText} - ${errorText}`);
        }

        const operation = await response.json();
        console.log("Veo Operation started:", operation.name); // e.g., "projects/.../operations/..."

        // 2. Deduct Credit (Secure via RPC)
        const { error: updateError } = await supabase.rpc('decrement_credits', { user_id: user.id, amount: creditCost });

        if (updateError) console.error("Failed to deduct credit:", updateError);

        // 2. Poll Operation
        // Veo generation can take a minute or two.
        const pollUrl = `https://generativelanguage.googleapis.com/v1beta/${operation.name}?key=${apiKey}`;

        while (true) {
            await delay(5000); // Poll every 5 seconds
            console.log("Polling Veo status...");

            const pollResponse = await fetch(pollUrl);
            if (!pollResponse.ok) {
                console.error("Polling Error:", await pollResponse.text());
                throw new Error("Erro ao verificar status do Veo");
            }

            const pollData = await pollResponse.json();

            if (pollData.done) {
                if (pollData.error) {
                    console.error("Veo Generation Failed:", pollData.error);
                    throw new Error(`Falha na geração do Veo: ${pollData.error.message}`);
                }

                // Success coverage - New Veo 3.1 structure
                const videoRes = pollData.response?.generateVideoResponse;
                if (videoRes?.generatedSamples?.[0]) {
                    const sample = videoRes.generatedSamples[0];
                    // Try known fields
                    videoUri = sample?.video?.uri || sample?.videoUri || sample?.uri;
                    if (videoUri) {
                        console.log("Veo Generation Complete (v3.1). URI:", videoUri);
                        break;
                    }
                }

                // Fallback: helper to find 'uri' anywhere
                if (!videoUri) {
                    const foundUri = findKeyRecursive(pollData, 'uri') || findKeyRecursive(pollData, 'videoUri');
                    if (foundUri && typeof foundUri === 'string') {
                        videoUri = foundUri;
                        console.log("Veo Generation Complete (recursive find). URI:", videoUri);
                        break;
                    }
                }

                if (!videoUri) {
                    // Last attempt: check for 'result' or 'output' specific to Vertex
                    const vertexUri = pollData?.response?.result?.uri;
                    if (vertexUri) {
                        videoUri = vertexUri;
                        break;
                    }
                }

                if (videoUri) break;

                // If neither, fail with full dump
                console.error("Veo done but no video found. Response DUMP:", JSON.stringify(pollData, null, 2));

                // Check for Safety Filters (RAI)
                const raiReasons = pollData.response?.generateVideoResponse?.raiMediaFilteredReasons;
                if (raiReasons && raiReasons.length > 0) {
                    console.error("Veo Safety Filter Triggered:", raiReasons);
                    throw new Error(`Veo recusou o vídeo por segurança: ${raiReasons[0]}`);
                }

                // Debug: Check if it's returning 'content' or other Gemini 2.0 style fields
                if (pollData.response?.candidates?.[0]?.content) {
                    console.log("Found candidates/content... trying to extract video...");
                }

                throw new Error(`Veo concluiu mas não retornou vídeo. Estrutura desconhecida. Veja os logs do servidor.`);
            }
        }

        // Ensure URI has API Key for access if it's from Google
        if (videoUri && videoUri.includes('generativelanguage.googleapis.com') && !videoUri.includes('key=')) {
            console.log("Appending API Key to Video URI for client access...");
            const separator = videoUri.includes('?') ? '&' : '?';
            videoUri += `${separator}key=${apiKey}`;
        }

        return videoUri;

    } catch (error: any) {
        console.error("Erro no processo Veo:", error);
        status = 'error';
        errorMessage = error.message.substring(0, 1000);
        throw error;
    } finally {
        // 4. Analytics Logging (Veo)
        const duration = Date.now() - startTime;
        const costSeconds = status === 'success' ? 6 : 0;

        // Cost Calculation
        // Fast: ~$0.20/sec (Audio included) -> $1.20
        // Quality: ~$0.542/sec (Audio included) -> $3.25
        const unitCost = isFast ? 0.20 : 0.542;

        const { error: logError } = await supabase.from('usage_logs').insert({
            user_id: user.id,
            action_type: 'video',
            model_used: modelId,
            cost_seconds: costSeconds,
            credits_deducted: status === 'success' ? creditCost : 0,
            latency_ms: duration,
            status: status,
            error_message: errorMessage,
            provider_cost: status === 'success' ? (costSeconds * unitCost) : 0,
            asset_url: videoUri || null
        });

        if (logError) console.error("Failed to log video usage:", logError);
    }
}
