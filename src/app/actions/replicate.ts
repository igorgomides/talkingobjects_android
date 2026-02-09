
"use server";

import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

const MAX_RETRIES = 5;

// Helper: Retry logic for Rate Limits (429)
// Helper: Retry logic for Rate Limits (429) & Stream Bypass
async function runWithRetry(modelString: string, inputWrapper: any, retries = 0): Promise<any> {
    try {
        console.log(`Running model: ${modelString.substring(0, 30)}...`);

        // Extract version hash
        const parts = modelString.split(':');
        const version = parts.length > 1 ? parts[parts.length - 1] : modelString;

        // Use predictions.create directly to avoid SDK converting URLs to Streams
        const prediction = await replicate.predictions.create({
            version: version,
            input: inputWrapper.input,
        });

        console.log(`Prediction created: ${prediction.id}. Polling...`);

        // Poll for completion
        let result = await replicate.predictions.get(prediction.id);
        while (result.status !== 'succeeded' && result.status !== 'failed' && result.status !== 'canceled') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            result = await replicate.predictions.get(prediction.id);
        }

        if (result.status === 'failed') throw new Error(`Replicate failed: ${result.error}`);
        if (result.status === 'canceled') throw new Error("Replicate prediction canceled");

        return result.output;

    } catch (error: any) {
        if (error.message?.includes("429") || error.message?.includes("Too Many Requests")) {
            if (retries < MAX_RETRIES) {
                const waitTime = Math.min(5000 * Math.pow(2, retries), 60000);
                console.log(`Rate limit hit (429). Waiting ${waitTime / 1000}s before retry ${retries + 1}/${MAX_RETRIES}...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return runWithRetry(modelString, inputWrapper, retries + 1);
            } else {
                throw new Error("O Replicate está muito congestionado. Tente novamente em 2 minutos.");
            }
        }
        throw error;
    }
}

export async function generateImage(prompt: string) {
    console.log("Generating image with prompt:", prompt.substring(0, 50) + "...");

    if (!process.env.REPLICATE_API_TOKEN) {
        return { success: false, error: "Token do Replicate não configurado no servidor." };
    }

    // Switched to SDXL Lightning (Bytedance) - Faster & Standard URL output
    // Hash checked: 6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe
    const model = "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe";

    try {
        const output = await runWithRetry(
            model,
            {
                input: {
                    prompt: prompt,
                    width: 768,
                    height: 1024, // Approx 9:16
                    refine: "expert_ensemble_refiner",
                    apply_watermark: false,
                    disable_safety_checker: true
                }
            }
        );

        console.log("Replicate output:", output);
        // SDXL usually returns [ "url" ]
        const imageUrl = Array.isArray(output) ? output[0] : output;

        if (typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
            console.error("Invalid image URL:", imageUrl);
            return { success: false, error: "Formato de imagem inválido retornado pelo Replicate" };
        }

        return { success: true, imageUrl: imageUrl };
    } catch (error: any) {
        console.error("Erro detalhado do Replicate:", error);
        return { success: false, error: `Falha no Replicate: ${error.message}` };
    }
}

// 1. Generate Audio (Fast enough to await, usually < 15s)
export async function generateAudio(script: string) {
    console.log("Starting generateAudio...");

    if (!process.env.REPLICATE_API_TOKEN) {
        return { success: false, error: "Token do Replicate não configurado no servidor." };
    }

    try {
        // TTS: suno-ai/bark
        // Hash: b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787
        let ttsOutput;
        try {
            ttsOutput = await runWithRetry(
                "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
                {
                    input: {
                        prompt: script,
                        text_temp: 0.7,
                        output_full: false
                    }
                }
            );
        } catch (ttsError: any) {
            console.error("TTS Error:", ttsError);
            return { success: false, error: `Erro no Audio (Bark): ${ttsError.message}` };
        }

        const audioUrl = (typeof ttsOutput === 'object' && ttsOutput.audio_out) ? ttsOutput.audio_out : ttsOutput;
        console.log("Audio generated:", audioUrl);

        if (!audioUrl) return { success: false, error: "Falha ao gerar áudio (TTS retornou vazio)" };

        return { success: true, audioUrl: audioUrl };

    } catch (error: any) {
        console.error("Erro em generateAudio:", error);
        return { success: false, error: `Erro geral no áudio: ${error.message}` };
    }
}

// 2. Start Video Generation (Returns ID immediately, preventing Timeout)
export async function startVideoGeneration(imageUrl: string, audioUrl: string) {
    console.log("Starting startVideoGeneration...");

    if (!process.env.REPLICATE_API_TOKEN) {
        return { success: false, error: "Token do Replicate não configurado no servidor." };
    }

    try {
        // Video: lucataco/sadtalker
        // Hash: 85c698db7c0a66d5011435d0191db323034e1da04b912a6d365833141b6a285b
        const modelString = "lucataco/sadtalker:85c698db7c0a66d5011435d0191db323034e1da04b912a6d365833141b6a285b";

        // Extract version hash from model string
        const parts = modelString.split(':');
        const version = parts.length > 1 ? parts[parts.length - 1] : modelString;

        // Start prediction ONLY (no await result)
        const prediction = await replicate.predictions.create({
            version: version,
            input: {
                source_image: imageUrl,
                driven_audio: audioUrl,
                still: true,
                enhancer: "gfpgan",
                preprocess: "full"
            }
        });

        console.log(`Video Prediction Started: ${prediction.id}`);
        return { success: true, predictionId: prediction.id };

    } catch (error: any) {
        console.error("Erro em startVideoGeneration:", error);
        return { success: false, error: `Erro ao iniciar vídeo: ${error.message}` };
    }
}

// 3. Check Status (Polling)
export async function checkPredictionStatus(predictionId: string) {
    if (!process.env.REPLICATE_API_TOKEN) {
        return { success: false, error: "Token do Replicate não configurado." };
    }

    try {
        const prediction = await replicate.predictions.get(predictionId);
        console.log(`Checking status for ${predictionId}: ${prediction.status}`);

        if (prediction.status === 'succeeded') {
            return { success: true, status: 'succeeded', output: prediction.output };
        } else if (prediction.status === 'failed') {
            return { success: false, status: 'failed', error: prediction.error || "Erro desconhecido no Replicate" };
        } else if (prediction.status === 'canceled') {
            return { success: false, status: 'canceled', error: "Predição cancelada" };
        } else {
            return { success: true, status: prediction.status }; // starting, processing
        }

    } catch (error: any) {
        console.error("Erro em checkPredictionStatus:", error);
        return { success: false, error: `Erro ao verificar status: ${error.message}` };
    }
}
