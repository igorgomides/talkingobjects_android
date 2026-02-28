
"use client";

import { useState, useEffect } from 'react';
import CreationForm from '@/components/CreationForm';
import PreviewSection from '@/components/PreviewSection';
import VideoPromptApproval from '@/components/VideoPromptApproval';
import ViralMode from '@/components/ViralMode';
import { Sparkles, AlertCircle, Image as ImageIcon, Video } from 'lucide-react';
import { generateScript, refinePromptV2 } from '@/app/actions/gemini';
import { generateImageWithImagen } from '@/app/actions/gemini-image';
import { generateVideoWithVeo } from '@/app/actions/gemini-video';

type Step = 'input' | 'approval' | 'result';

export default function Home() {
  const [step, setStep] = useState<Step>('input');

  const [formData, setFormData] = useState({
    objectName: '',
    emotion: 'Com muita Raiva',
    reason: '',
    script: '',
    prompt: ''
  });

  // New v2.0 States
  const [voiceStyle, setVoiceStyle] = useState("Cartoon / Expressive");
  const [logoImage, setLogoImage] = useState<string | null>(null);

  // Language State (Default: English)
  const [language, setLanguage] = useState<'en' | 'pt'>('en');

  useEffect(() => {
    // Initial load
    const saved = localStorage.getItem('language') as 'en' | 'pt';
    if (saved) setLanguage(saved);

    // Listen for changes from Header
    const handleLangChange = () => {
      const updated = localStorage.getItem('language') as 'en' | 'pt';
      if (updated) setLanguage(updated);
    };
    window.addEventListener('language-change', handleLangChange);
    return () => window.removeEventListener('language-change', handleLangChange);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isRefiningPrompt, setIsRefiningPrompt] = useState(false);

  const [generatedImage, setGeneratedImage] = useState<string | undefined>(undefined);
  const [generatedVideo, setGeneratedVideo] = useState<string | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Gemini Model selection
  const [geminiModel, setGeminiModel] = useState("gemini-2.5-flash");
  // Veo Model selection (Default: Fast)
  const [veoModel, setVeoModel] = useState("veo-3.1-fast-generate-preview");
  // Video Quality selection (Default: Fast - 10cr)
  const [videoQuality, setVideoQuality] = useState<'fast' | 'quality'>('fast');
  // Video Duration selection (Default: 6s)
  const [videoDuration, setVideoDuration] = useState<6 | 8>(6);
  // Framing position (Default: center)
  const [framing, setFraming] = useState("center");

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
      const result = await generateScript(formData.objectName, formData.emotion, formData.reason, geminiModel, language);
      if (!result.success) throw new Error(result.error);
      setFormData(prev => ({ ...prev, script: result.data || "" }));
    } catch (e: any) {
      console.error(e);
      setError(e.message || (language === 'pt' ? "Erro ao gerar roteiro." : "Error generating script."));
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleRefinePrompt = async (scenarioContext: string, framingContext: string) => {
    if (!formData.objectName || !formData.emotion || !formData.reason) {
      setError(language === 'pt' ? "Preencha Objeto, Emoção e Motivo primeiro." : "Please fill in Object, Emotion, and Reason first.");
      return;
    }
    setError(null);
    setIsRefiningPrompt(true);
    try {
      const result = await refinePromptV2(formData.objectName, formData.emotion, formData.reason, geminiModel, scenarioContext, framingContext);
      if (!result.success) throw new Error(result.error);
      setFormData(prev => ({ ...prev, prompt: result.data || "" }));
    } catch (e: any) {
      console.error(e);
      setError(e.message || (language === 'pt' ? "Erro ao gerar prompt." : "Error generating prompt."));
    } finally {
      setIsRefiningPrompt(false);
    }
  };

  // Step 1 Submit: Generate or Use Image -> Move to Approval
  const handleInitialSubmit = async (e?: React.FormEvent, uploadedImg?: string, scenarioPrompt?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let imageUrl = uploadedImg;

      if (!imageUrl) {
        // Generate Image if not uploaded
        if (!formData.prompt) {
          setError(language === 'pt' ? "Gere o prompt antes." : "Generate prompt first.");
          setIsLoading(false);
          return;
        }
        setStatusMessage(language === 'pt' ? "Gerando imagem com Imagen 4.0..." : "Generating image with Imagen 4.0...");
        // Pass scenarioPrompt to generation function
        const result = await generateImageWithImagen(formData.prompt, scenarioPrompt);
        if (!result.success || !result.url) throw new Error(result.error || "Unknown error generating image");
        imageUrl = result.url;

        // Refresh Credits (1 Credit spent)
        window.dispatchEvent(new Event('credits-updated'));
      }

      setGeneratedImage(imageUrl);
      setStep('approval'); // Move to Step 2
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 Submit: Approve Video Prompt -> Generate Video -> Move to Result
  const handleFinalVideoGeneration = async (finalPrompt: string, finalImage: string) => {
    setIsLoading(true);
    setError(null);
    setStatusMessage(language === 'pt' ? `Animando com ${veoModel}...` : `Animating with ${veoModel}...`);

    try {
      const videoFormData = new FormData();
      videoFormData.append('image', finalImage); // This is the composited image (with logo)
      videoFormData.append('prompt', finalPrompt); // This is the user-approved prompt
      videoFormData.append('model', veoModel); // Pass selected model
      videoFormData.append('quality', videoQuality); // Pass quality (fast/quality)
      videoFormData.append('duration', videoDuration.toString()); // Pass duration (6/8)

      const result = await generateVideoWithVeo(videoFormData);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Unknown error generating video");
      }
      const videoUrl = result.url;

      // Refresh Credits (10 Credits spent)
      window.dispatchEvent(new Event('credits-updated'));

      setGeneratedVideo(videoUrl);
      setStep('result'); // Move to Step 3
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetProcess = () => {
    setStep('input');
    setGeneratedVideo(undefined);
    setGeneratedImage(undefined);
  };

  return (
    <div className="min-h-screen px-4 pb-20 pt-4 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-md mx-auto flex flex-col items-center gap-6">

        {error && (
          <div className="w-full bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg flex items-center gap-2 animate-bounce text-sm">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="w-full flex flex-col gap-6">
          {/* FORM SECTION - Always Visible initially */}
          <div className={`w-full transition-all duration-300 ${generatedImage || generatedVideo ? 'hidden' : 'block'}`}>
            <CreationForm
              formData={formData}
              setFormData={setFormData}
              voiceStyle={voiceStyle}
              setVoiceStyle={setVoiceStyle}
              logoImage={logoImage}
              setLogoImage={setLogoImage}
              framing={framing}
              setFraming={setFraming}
              onSubmit={handleInitialSubmit}
              onGenerateScript={handleGenerateScript}
              onRefinePrompt={handleRefinePrompt}
              isGeneratingScript={isGeneratingScript}
              isRefiningPrompt={isRefiningPrompt}
              isLoading={isLoading}
              geminiModel={geminiModel}
              setGeminiModel={setGeminiModel}
              veoModel={veoModel}
              setVeoModel={setVeoModel}
              language={language}
            />
          </div>

          {/* APPROVAL / PREVIEW SECTION - Only Visible when content exists */}
          {(generatedImage || generatedVideo) && (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Back Button to Form */}
              {!generatedVideo && step === 'approval' && (
                <button
                  onClick={() => { setGeneratedImage(undefined); setStep('input'); }}
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-2"
                >
                  ← {language === 'pt' ? 'Voltar para Edição' : 'Back to Edit'}
                </button>
              )}

              {step === 'approval' && generatedImage && (
                <VideoPromptApproval
                  imageUrl={generatedImage}
                  logoUrl={logoImage || undefined}
                  script={formData.script}
                  voiceStyle={voiceStyle}
                  language={language}
                  isLoading={isLoading}
                  onApprove={handleFinalVideoGeneration}
                  onCancel={() => { setGeneratedImage(undefined); setStep('input'); }}
                  videoQuality={videoQuality}
                  setVideoQuality={setVideoQuality}
                  videoDuration={videoDuration}
                  setVideoDuration={setVideoDuration}
                />
              )}

              <PreviewSection
                imageUrl={generatedImage}
                videoUrl={generatedVideo}
                isGenerating={isLoading}
                language={language}
              />

              {step === 'result' && (
                <div className="bg-gray-900 p-6 rounded-lg text-center border border-gray-700">
                  <h3 className="text-xl text-white font-bold mb-4">
                    {language === 'pt' ? 'Vídeo Pronto!' : 'Video Ready!'}
                  </h3>
                  <button
                    onClick={resetProcess}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md transition-colors font-bold"
                  >
                    {language === 'pt' ? 'Criar Novo' : 'Create New'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </main>

      {/* Footer can be hidden or very subtle */}
    </div>
  );
}
