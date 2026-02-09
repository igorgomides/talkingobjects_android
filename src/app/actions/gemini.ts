"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Helper function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runGenerativeContentWithRetry(model: any, prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error: any) {
      // Check for 429 (Too Many Requests) or 503 (Service Unavailable)
      if (error.status === 429 || error.status === 503 || error.message?.includes("429")) {
        console.warn(`Gemini rate limit hit. Attempt ${i + 1}/${retries}. Retrying in 5s...`);
        if (i === retries - 1) throw error; // Throw on last attempt
        await delay(5000 * (i + 1)); // Backoff: 5s, 10s, 15s
        continue;
      }
      throw error;
    }
  }
}

export async function generateScript(objectName: string, emotion: string, reason: string, modelName: string = "gemini-2.5-flash", language: 'en' | 'pt' = 'en') {
  console.log("API Key configured:", !!apiKey);
  console.log("Using Gemini Model:", modelName);
  console.log("Language:", language);

  if (!apiKey) throw new Error("API Key do Gemini não configurada (vazia)");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const systemPrompt = language === 'pt'
    ? `Você é um roteirista de vídeos virais para Instagram Reels.
       Crie um roteiro curto (máximo 140 caracteres) e muito engraçado/impactante para um personagem.
       O roteiro DEVE ser em PORTUGUÊS.`
    : `You are a viral video scriptwriter for Instagram Reels.
       Create a short (max 140 chars), funny, and impactful script for a character.
       The script MUST be in ENGLISH.`;

  const prompt = `
    ${systemPrompt}
    
    Character/Object: ${objectName}
    Emotion: ${emotion}
    Reason: ${reason}
    
    The script must be in first person. No hashtags. Only the spoken text.
  `;

  try {
    return await runGenerativeContentWithRetry(model, prompt);
  } catch (error: any) {
    console.error("Erro ao gerar roteiro:", error);
    if (error.status === 429 || error.message?.includes("429")) {
      throw new Error(`Muitas requisições ao Gemini (${modelName}). Tente outro modelo ou aguarde.`);
    }
    if (error.status === 404 || error.message?.includes("404") || error.message?.includes("not found")) {
      throw new Error(`Modelo ${modelName} não disponível. Tente 'gemini-2.5-flash'.`);
    }
    throw new Error("Falha ao gerar roteiro com Gemini");
  }
}

export async function refinePrompt(objectName: string, emotion: string, reason: string, modelName: string = "gemini-2.5-flash") {
  console.log("Refining prompt...");
  console.log("Using Gemini Model:", modelName);

  if (!apiKey) throw new Error("API Key do Gemini não configurada");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const systemInstruction = `
    Você é um especialista em prompts para geradores de imagem 3D. O usuário fornecerá um objeto e uma emoção. Sua saída deve ser APENAS o prompt em inglês, seguindo esta estrutura estrita:
    'A 3D render of a [Objeto] character with a face, looking strictly at the camera. The character is expressing [Emoção] because of [Motivo]. Pixar style, high detail, studio lighting, plain blurred background, vertical 9:16 aspect ratio. Create a central composition.'
    
    IMPORTANT SAFETY GUIDELINES:
    - Ensure the prompt is 100% Safe For Work (SFW).
    - Do NOT use words like "bitten", "blood", "wound", "injured", "naked", "gore", "violent".
    - If the user's reason is violent (e.g. "bitten"), soften it (e.g. "scared of a giant mouth" or "running away").
    - The character MUST be cute and family-friendly.
  `;

  const prompt = `
    ${systemInstruction}
    
    Object: ${objectName}
    Emotion: ${emotion}
    Reason: ${reason}
  `;

  try {
    return await runGenerativeContentWithRetry(model, prompt);
  } catch (error: any) {
    console.error("Erro ao refinar prompt:", error);
    if (error.status === 429 || error.message?.includes("429")) {
      throw new Error(`Muitas requisições ao Gemini (${modelName}). Tente outro modelo ou aguarde.`);
    }
    if (error.status === 404 || error.message?.includes("404") || error.message?.includes("not found")) {
      throw new Error(`Modelo ${modelName} não disponível. Tente 'gemini-pro'.`);
    }
    throw new Error("Falha ao refinar prompt com Gemini");
  }
}
