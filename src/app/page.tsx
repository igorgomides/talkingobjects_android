
"use client";

import { useState } from 'react';
import CreationForm from '@/components/CreationForm';
import PreviewSection from '@/components/PreviewSection';
import ViralMode from '@/components/ViralMode';
import { Sparkles, AlertCircle } from 'lucide-react';
import { generateScript, refinePromptV2 } from '@/app/actions/gemini';
import { generateImageWithImagen } from '@/app/actions/gemini-image';
import { generateVideoWithVeo } from '@/app/actions/gemini-video';

export default function Home() {
  const [formData, setFormData] = useState({
    objectName: '',
    emotion: 'Com muita Raiva', // Default will be updated by effect based on lang
    reason: '',
    script: '',
    prompt: ''
  });

  // Language State (Default: English)
  const [language, setLanguage] = useState<'en' | 'pt'>('en');

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isRefiningPrompt, setIsRefiningPrompt] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | undefined>(undefined);
  const [generatedVideo, setGeneratedVideo] = useState<string | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // New state for Gemini Model selection
  const [geminiModel, setGeminiModel] = useState("gemini-2.5-flash");

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  const handleViralMode = () => {
    if (language === 'pt') {
      setFormData({
        objectName: "Salgadinho Brasileiro (Coxinha)",
        emotion: "Com muita Raiva",
        reason: "Ser mordido por um gigante",
        script: "Eu não acredito! Você vai me comer? Logo eu, recheada de amor e catupiry? Isso é um absurdo! A revolução das coxinhas vai começar!",
        prompt: ""
      });
    } else {
      setFormData({
        objectName: "Brazilian Snack (Coxinha)",
        emotion: "Very Angry",
        reason: "Being bitten by a giant",
        script: "I can't believe it! You're going to eat me? Me, filled with love and cream cheese? This is absurd! The Coxinha revolution starts now!",
        prompt: ""
      });
    }
  };

  const handleGenerateScript = async () => {
    if (!formData.objectName || !formData.emotion || !formData.reason) {
      setError(language === 'pt' ? "Preencha Objeto, Emoção e Motivo primeiro." : "Please fill in Object, Emotion, and Reason first.");
      return;
    }
    setError(null);
    setIsGeneratingScript(true);
    try {
      // Pass the selected model and language
      const script = await generateScript(formData.objectName, formData.emotion, formData.reason, geminiModel, language);
      setFormData(prev => ({ ...prev, script }));
    } catch (e: any) {
      console.error(e);
      setError(e.message || (language === 'pt' ? "Erro ao gerar roteiro." : "Error generating script."));
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleRefinePrompt = async () => {
    if (!formData.objectName || !formData.emotion || !formData.reason) {
      setError(language === 'pt' ? "Preencha Objeto, Emoção e Motivo primeiro." : "Please fill in Object, Emotion, and Reason first.");
      return;
    }
    setError(null);
    setIsRefiningPrompt(true);
    try {
      // Pass the selected model (prompt is always English so language param might be redundant for prompt, but kept for consistency if needed)
      // Actually prompt generation logic in gemini.ts is English focused, but we might want to pass 'en' to ensure it stays English.
      const prompt = await refinePromptV2(formData.objectName, formData.emotion, formData.reason, geminiModel);
      setFormData(prev => ({ ...prev, prompt }));
    } catch (e: any) {
      console.error(e);
      setError(e.message || (language === 'pt' ? "Erro ao gerar prompt." : "Error generating prompt."));
    } finally {
      setIsRefiningPrompt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.script) {
      setError(language === 'pt' ? "O roteiro é obrigatório." : "Script is required.");
      return;
    }
    if (!formData.prompt) {
      setError(language === 'pt' ? "Por favor, gere e aprove o prompt da imagem antes de continuar." : "Please generate and approve the image prompt before continuing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(undefined);
    setGeneratedVideo(undefined);

    try {
      // 1. Use the approved prompt
      const imagePrompt = formData.prompt;
      console.log("Approved Prompt:", imagePrompt);

      // 2. Generate Image (Imagen 4.0)
      setStatusMessage(language === 'pt' ? "Gerando imagem com Imagen 4.0..." : "Generating image with Imagen 4.0...");
      const imageUrl = await generateImageWithImagen(imagePrompt);
      setGeneratedImage(imageUrl);

      // 3. Animate Video (Veo 2.0)
      setStatusMessage(language === 'pt' ? "Animando vídeo com Veo 2.0 (pode demorar um pouco)..." : "Animating video with Veo 2.0 (may take a while)...");

      // Use FormData to send large base64 string safely
      const videoFormData = new FormData();
      videoFormData.append('image', imageUrl);
      videoFormData.append('script', formData.script);

      const videoUrl = await generateVideoWithVeo(videoFormData);

      setGeneratedVideo(videoUrl);
      setStatusMessage(language === 'pt' ? "Pronto!" : "Done!");

    } catch (e: any) {
      console.error(e);
      setError(e.message || (language === 'pt' ? "Erro durante o processo." : "Error during the process."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto flex flex-col items-center gap-8">

        <header className="text-center space-y-2 relative w-full flex flex-col items-center">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="absolute top-0 right-0 p-2 bg-gray-800 rounded-full border border-gray-600 hover:border-white transition-colors flex items-center gap-2 text-xs font-bold text-white"
          >
            <span>{language === 'en' ? '🇺🇸 EN' : '🇧🇷 PT'}</span>
          </button>

          <div className="inline-flex items-center justify-center p-3 bg-purple-900/50 rounded-full mb-4 ring-1 ring-purple-500">
            <Sparkles className="text-purple-300 mr-2" />
            <span className="text-purple-200 font-bold tracking-wider text-sm">GEMINI EDITION</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg">
            Talking Objects
          </h1>
          <p className="text-gray-300 text-lg">
            {language === 'pt' ? "Crie vídeos virais para Reels com IA 🤖✨" : "Create viral AI videos for Reels 🤖✨"}
          </p>
        </header>

        <ViralMode onActivate={handleViralMode} language={language} />

        {error && (
          <div className="w-full bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg flex items-center gap-2 animate-bounce">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 w-full">
          <div className="flex flex-col gap-4 order-2 md:order-1">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              1. {language === 'pt' ? "Configuração" : "Configuration"} 🛠️
            </h2>
            <CreationForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onGenerateScript={handleGenerateScript}
              onRefinePrompt={handleRefinePrompt}
              isGeneratingScript={isGeneratingScript}
              isRefiningPrompt={isRefiningPrompt}
              isLoading={isLoading}
              geminiModel={geminiModel}
              setGeminiModel={setGeminiModel}
              language={language}
            />
          </div>

          <div className="flex flex-col gap-4 order-1 md:order-2">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              2. {language === 'pt' ? "Resultado" : "Result"} 🎬
            </h2>
            <div className="sticky top-8 space-y-2">
              {isLoading && <p className="text-purple-400 text-center animate-pulse">{statusMessage}</p>}
              <PreviewSection
                imageUrl={generatedImage}
                videoUrl={generatedVideo}
                isGenerating={isLoading}
              />
            </div>
          </div>
        </div>

      </main>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        Powered by Google Gemini (Script + Imagen 3 + Veo)
      </footer>
    </div>
  );
}
