
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const tokenMatch = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : null;

if (!token) {
    console.error("Could not find NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(token);

async function main() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Placeholder model to access the client, though listModels is on genAI.
        // Actually listModels is usually on the client instance or via specific endpoint.
        // The SDK might not expose listModels directly on genAI instance easily in older versions, let's try standard approach.
        // Or if not available, we can just try to instantiate specific models.

        // Wait, the SDK has listModels? No, it's usually via Vertex AI.
        // But let's try to verify if we can access `gemini-1.5-pro` or `imagen-3.0-generate-001` (Imagen 3).
        // For video generation (Veo), it's likely `veo-001` or similar.

        // Let's try to generate content with a dummy prompt to see if we can access standard models first.
        const result = await model.generateContent("Hello");
        console.log("Standard model access: OK");

    } catch (e) {
        console.error("Error accessing standard model:", e.message);
    }
}

main();
