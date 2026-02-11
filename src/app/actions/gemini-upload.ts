"use server";

import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import os from "os";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function uploadImageToGemini(imageBase64: string): Promise<string> {
    if (!apiKey) throw new Error("API Key do Gemini não configurada");

    console.log("Uploading image to Gemini File API...");

    const fileManager = new GoogleAIFileManager(apiKey);

    // 1. Save Base64 to temporary file (File API requires a path)
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}.png`);

    try {
        // Remove header if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        fs.writeFileSync(tempFilePath, buffer);
        console.log("Temporary file created:", tempFilePath);

        // 2. Upload to Gemini
        const uploadResponse = await fileManager.uploadFile(tempFilePath, {
            mimeType: "image/png",
            displayName: "Character Image for Veo",
        });

        console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);

        // 3. Return URI
        return uploadResponse.file.uri;

    } catch (error: any) {
        console.error("Erro ao fazer upload para Gemini:", error);
        throw new Error(`Falha no upload da imagem: ${error.message}`);
    } finally {
        // Cleanup temp file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
}
