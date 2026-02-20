
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.error("Please set NEXT_PUBLIC_GEMINI_API_KEY environment variable.");
    process.exit(1);
}

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(model => {
                if (model.name.includes('veo')) {
                    console.log(`- ${model.name} (${model.displayName}): ${model.description}`);
                    console.log(`  Supported Methods: ${JSON.stringify(model.supportedGenerationMethods)}`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
