"use server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function generateImageWithImagen(prompt: string): Promise<string> {
    if (!apiKey) throw new Error("API Key do Gemini não configurada");

    console.log("Generating image with Imagen 4.0...");
    console.log("Prompt:", prompt);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

    const payload = {
        instances: [
            {
                prompt: prompt,
                aspectRatio: "9:16" // Vertical for Reels
            }
        ],
        parameters: {
            sampleCount: 1,
            // safetySettings could be added here if needed
        }
    };

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
            const base64Image = data.predictions[0].bytesBase64Encoded;
            // Convert to data URL for frontend display
            return `data:image/png;base64,${base64Image}`;
        } else {
            console.error("Unexpected Imagen response:", data);
            throw new Error("Formato de resposta do Imagen inválido");
        }

    } catch (error: any) {
        console.error("Erro ao gerar imagem com Imagen:", error);
        throw error;
    }
}
