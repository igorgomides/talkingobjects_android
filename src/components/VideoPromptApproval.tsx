
import { useState, useEffect } from 'react';
import { Loader2, Clapperboard, CheckCircle2, RefreshCw } from 'lucide-react';
import { compositeLogo } from '@/utils/canvas-helper';

interface VideoPromptApprovalProps {
    imageUrl: string;
    logoUrl?: string;
    script: string;
    voiceStyle: string;
    language: 'en' | 'pt';
    onApprove: (finalPrompt: string, finalImage: string) => void;
    onCancel: () => void;
    isLoading: boolean;
    videoQuality: 'fast' | 'quality';
    setVideoQuality: (quality: 'fast' | 'quality') => void;
    videoDuration: 6 | 8;
    setVideoDuration: (duration: 6 | 8) => void;
}

export default function VideoPromptApproval({
    imageUrl,
    logoUrl,
    script,
    voiceStyle,
    language,
    onApprove,
    onCancel,
    isLoading,
    videoQuality,
    setVideoQuality,
    videoDuration,
    setVideoDuration
}: VideoPromptApprovalProps) {
    const [prompt, setPrompt] = useState("");
    const [compositedImage, setCompositedImage] = useState<string>(imageUrl);
    const [isCompositing, setIsCompositing] = useState(false);

    // Initial Prompt Generation
    useEffect(() => {
        const base = `
Transform the provided image into a vertical video in 9:16 format. Maintain the exact same setting, colors, framing, and style as the original image.
Do not add new elements, do not change the background, and do not change the camera angle.
Add subtle movements to the character's face, such as blinking, eyebrow movements, and natural mouth movements.
The speech must be perfectly synchronized with the mouth movement (lip sync), without delays, cuts, or extra words.
The character must look directly at the viewer and speak with emotional expressive expression.
The spoken text in the video must be exactly the following: "${script}"
Use a clear, natural, and expressive voice. Voice Style: ${voiceStyle}.
Ensure that the intonation matches the character's emotion.
        `.trim();
        setPrompt(base);
    }, [script, voiceStyle]);

    // Handle Logo Composition
    useEffect(() => {
        if (logoUrl) {
            setIsCompositing(true);
            compositeLogo(imageUrl, logoUrl, 'bottom-right')
                .then(final => {
                    setCompositedImage(final);
                })
                .catch(err => {
                    console.error("Composition error:", err);
                    setCompositedImage(imageUrl); // Fallback
                })
                .finally(() => setIsCompositing(false));
        } else {
            setCompositedImage(imageUrl);
        }
    }, [imageUrl, logoUrl]);

    const handleApprove = () => {
        onApprove(prompt, compositedImage);
    };

    return (
        <div className="p-6 bg-gray-900 rounded-lg shadow-xl border border-blue-500/30 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clapperboard className="text-blue-400" />
                {language === 'pt' ? "Aprovar Vídeo Final" : "Approve Final Video"}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Visual Preview */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">
                        {language === 'pt' ? "Visual Final (com Logo)" : "Final Visual (with Logo)"}
                    </label>
                    <div className="relative aspect-[9/16] w-full max-w-[200px] mx-auto rounded-lg overflow-hidden border border-gray-700 bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={compositedImage}
                            alt="Final Preview"
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isCompositing ? 'opacity-50' : 'opacity-100'}`}
                        />
                        {isCompositing && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <RefreshCw className="text-white animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Prompt Editor */}
                <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-medium text-gray-400">
                        {language === 'pt' ? "Instruções para a IA (Veo)" : "AI Instructions (Veo)"}
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-1 w-full bg-gray-800 text-white rounded-md p-3 border border-gray-600 focus:border-blue-500 font-mono text-sm resize-none"
                    />
                    <p className="text-xs text-gray-500">
                        {language === 'pt'
                            ? "Edite este prompt se quiser ajustar o comportamento da animação."
                            : "Edit this prompt if you want to adjust the animation behavior."}
                    </p>
                </div>

                {/* Video Settings (Quality & Duration) */}
                <div className="md:col-span-2 space-y-4">
                    {/* Video Duration Selector */}
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <label className="block text-sm font-medium text-blue-300 mb-2">
                            {language === 'pt' ? "Duração do Vídeo" : "Video Duration"}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer p-4 rounded-lg border flex flex-col items-center gap-1 transition-all ${videoDuration === 6 ? 'bg-blue-900/40 border-blue-500 shadow-sm shadow-blue-500/20' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                <input type="radio" name="duration" value={6} checked={videoDuration === 6} onChange={() => setVideoDuration(6)} className="hidden" />
                                <span className="font-bold text-white text-base">6 {language === 'pt' ? "Segundos" : "Seconds"}</span>
                            </label>

                            <label className={`cursor-pointer p-4 rounded-lg border flex flex-col items-center gap-1 transition-all ${videoDuration === 8 ? 'bg-blue-900/40 border-blue-500 shadow-sm shadow-blue-500/20' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                <input type="radio" name="duration" value={8} checked={videoDuration === 8} onChange={() => setVideoDuration(8)} className="hidden" />
                                <span className="font-bold text-white text-base">8 {language === 'pt' ? "Segundos" : "Seconds"}</span>
                            </label>
                        </div>
                    </div>

                    {/* Video Quality Selector */}
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <label className="block text-sm font-medium text-purple-300 mb-2">
                            {language === 'pt' ? "Qualidade do Vídeo" : "Video Quality"}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer p-4 rounded-lg border flex flex-col items-center gap-1 transition-all ${videoQuality === 'fast' ? 'bg-purple-900/40 border-purple-500 shadow-sm shadow-purple-500/20' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                <input type="radio" name="quality" value="fast" checked={videoQuality === 'fast'} onChange={() => setVideoQuality('fast')} className="hidden" />
                                <span className="font-bold text-white text-base">{language === 'pt' ? "Rápido (Padrão)" : "Fast (Standard)"}</span>
                                <span className="text-sm text-green-400 font-mono">{videoDuration === 6 ? 15 : 25} {language === 'pt' ? "créditos" : "credits"}</span>
                            </label>

                            <label className={`cursor-pointer p-4 rounded-lg border flex flex-col items-center gap-1 transition-all ${videoQuality === 'quality' ? 'bg-purple-900/40 border-purple-500 shadow-sm shadow-purple-500/20' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                                <input type="radio" name="quality" value="quality" checked={videoQuality === 'quality'} onChange={() => setVideoQuality('quality')} className="hidden" />
                                <span className="font-bold text-white text-base">{language === 'pt' ? "Alta Qualidade (Pro)" : "High Quality (Pro)"}</span>
                                <span className="text-sm text-yellow-400 font-mono">{videoDuration === 6 ? 40 : 60} {language === 'pt' ? "créditos" : "credits"}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 py-3 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                    {language === 'pt' ? "Voltar" : "Back"}
                </button>
                <button
                    onClick={handleApprove}
                    disabled={isLoading || isCompositing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors flex justify-center items-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                    {language === 'pt' ? "Confirmar e Gerar Vídeo" : "Confirm & Generate Video"}
                </button>
            </div>
        </div>
    );
}
