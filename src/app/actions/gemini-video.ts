"use server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Helper for polling delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// CHANGED: Use FormData to avoid Next.js JSON serialization limits (Maximum array nesting)
export async function generateVideoWithVeo(formData: FormData): Promise<string> {
    if (!apiKey) throw new Error("API Key do Gemini não configurada");

    const imageBase64 = formData.get('image') as string;
    const script = formData.get('script') as string;

    if (!imageBase64 || !script) throw new Error("Imagem ou script faltando no FormData");

    console.log("--> Entered generateVideoWithVeo (FormData)");
    console.log("Script length:", script.length);
    console.log("Image Base64 length:", imageBase64.length);

    console.log("Initializing Veo 2.0 generation...");

    // Construct user's specific prompt
    const videoPrompt = `
Transform the provided image into a vertical video in 9:16 format. Maintain the exact same setting, colors, framing, and style as the original image.
Do not add new elements, do not change the background, and do not change the camera angle.
Add subtle movements to the character's face, such as blinking, eyebrow movements, and natural mouth movements.
The speech must be perfectly synchronized with the mouth movement (lip sync), without delays, cuts, or extra words.
The character must look directly at the viewer and speak with emotional expressive expression, as in the photo.
The spoken text in the video must be exactly the following, without modifications, in English:
"${script}"
Use a clear, natural, and expressive voice. Ensure that the intonation matches the character's emotion.
  `.trim();

    // Veo Endpoint (predictLongRunning)
    // Switching to 3.1-preview as fallback for 2.0 quota issues
    const url = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning?key=${apiKey}`;

    // Clean base64 if it has header
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const payload = {
        instances: [
            {
                prompt: videoPrompt,
                image: {
                    bytesBase64Encoded: cleanBase64,
                    mimeType: "image/png"
                }
            }
        ],
        parameters: {
            aspectRatio: "9:16",
        }
    };

    try {
        // 1. Start Operation
        console.log("Starting Veo operation...");
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

        // 2. Poll Operation
        // Veo generation can take a minute or two.
        let videoUri = "";
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

                // Fallback: older structure for v2.0
                if (pollData.response?.videos?.[0]?.uri) {
                    videoUri = pollData.response.videos[0].uri;
                    console.log("Veo Generation Complete (v2.0). URI:", videoUri);
                    break;
                }

                // If neither, fail with full dump
                console.error("Veo done but no video found. Response:", JSON.stringify(pollData, null, 2));
                throw new Error("Veo concluiu mas não retornou vídeo (estrutura desconhecida).");
            }
        }

        // Ensure URI has API Key for access if it's from Google
        // Ensure URI has API Key for access if it's from Google
        if (videoUri && videoUri.includes('generativelanguage.googleapis.com') && !videoUri.includes('key=')) {
            console.log("Appending API Key to Video URI for client access...");
            const separator = videoUri.includes('?') ? '&' : '?';
            videoUri += `${separator}key=${apiKey}`;
        }

        return videoUri;

    } catch (error: any) {
        console.error("Erro no processo Veo:", error);
        throw error;
    }
}
