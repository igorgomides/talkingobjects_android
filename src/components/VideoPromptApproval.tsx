
import { useState, useEffect } from 'react';
import { Loader2, Clapperboard, CheckCircle2, RefreshCw } from 'lucide-react';
import { compositeLogo } from '@/utils/canvas-helper';
import TextareaAutosize from 'react-textarea-autosize';

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
        <div className="glass-card p-6 rounded-2xl shadow-2xl space-y-6 relative overflow-hidden mt-6">
            {/* Ambient Background Glow inside the card */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
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
                    <div className="relative aspect-[9/16] w-full max-w-[200px] mx-auto rounded-xl overflow-hidden glass-card p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={compositedImage}
                            alt="Final Preview"
                            className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${isCompositing ? 'opacity-50' : 'opacity-100'}`}
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
                    <TextareaAutosize
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        minRows={4}
                        className="glass-input flex-1 w-full text-white rounded-xl p-4 outline-none font-mono text-sm resize-none shadow-inner overflow-hidden"
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
                    <div className="glass-card p-5 rounded-xl border border-white/10 relative">
                        <label className="block text-sm font-bold text-blue-300 mb-3 uppercase tracking-widest">
                            {language === 'pt' ? "Duração do Vídeo" : "Video Duration"}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${videoDuration === 6 ? 'glass-card border-blue-400 shadow-neon-blue scale-[1.02] z-10 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/40 hover:border-white/30'}`}>
                                <input type="radio" name="duration" value={6} checked={videoDuration === 6} onChange={() => setVideoDuration(6)} className="hidden" />
                                <span className="font-bold text-lg">6 {language === 'pt' ? "Segundos" : "Seconds"}</span>
                            </label>

                            <label className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${videoDuration === 8 ? 'glass-card border-blue-400 shadow-neon-blue scale-[1.02] z-10 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/40 hover:border-white/30'}`}>
                                <input type="radio" name="duration" value={8} checked={videoDuration === 8} onChange={() => setVideoDuration(8)} className="hidden" />
                                <span className="font-bold text-lg">8 {language === 'pt' ? "Segundos" : "Seconds"}</span>
                            </label>
                        </div>
                    </div>

                    {/* Video Quality Selector */}
                    <div className="glass-card p-5 rounded-xl border border-white/10 relative">
                        <label className="block text-sm font-bold text-purple-300 mb-3 uppercase tracking-widest">
                            {language === 'pt' ? "Qualidade do Vídeo" : "Video Quality"}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer p-5 rounded-xl border transition-all flex flex-col items-center gap-2 text-center h-full justify-center ${videoQuality === 'fast' ? 'glass-card border-purple-400 shadow-neon-purple scale-[1.02] z-10 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/40 hover:border-white/30'}`}>
                                <input type="radio" name="quality" value="fast" checked={videoQuality === 'fast'} onChange={() => setVideoQuality('fast')} className="hidden" />
                                <span className="bg-purple-900/50 p-3 rounded-full mb-1">⚡</span>
                                <span className="font-bold text-md leading-tight">{language === 'pt' ? "Rápido (Padrão)" : "Fast Mode"}</span>
                                <span className={`text-base font-bold ${videoQuality === 'fast' ? 'text-green-300' : 'text-gray-500'}`}>{videoDuration === 6 ? 15 : 25} {language === 'pt' ? "créditos" : "cr"}</span>
                            </label>

                            <label className={`cursor-pointer p-5 rounded-xl border transition-all flex flex-col items-center gap-2 text-center h-full justify-center ${videoQuality === 'quality' ? 'glass-card border-purple-400 shadow-neon-purple scale-[1.02] z-10 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/40 hover:border-white/30'}`}>
                                <input type="radio" name="quality" value="quality" checked={videoQuality === 'quality'} onChange={() => setVideoQuality('quality')} className="hidden" />
                                <span className="bg-purple-900/50 p-3 rounded-full mb-1">💎</span>
                                <span className="font-bold text-md leading-tight">{language === 'pt' ? "Alta Qualidade (Pro)" : "High Quality"}</span>
                                <span className={`text-base font-bold ${videoQuality === 'quality' ? 'text-yellow-300' : 'text-gray-500'}`}>{videoDuration === 6 ? 40 : 60} {language === 'pt' ? "créditos" : "cr"}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-6 flex-col md:flex-row relative z-10">
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="md:flex-none md:w-1/3 py-4 rounded-full border border-white/20 text-gray-300 hover:bg-white/10 transition-all font-bold glass-card"
                >
                    {language === 'pt' ? "Voltar" : "Back"}
                </button>
                <button
                    onClick={handleApprove}
                    disabled={isLoading || isCompositing}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 rounded-full transition-all flex justify-center items-center gap-2 text-lg shadow-bubbly-purple bubbly-button disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Clapperboard fill="currentColor" size={20} />}
                    {language === 'pt' ? "Animar Vídeo" : "Animate Video"}
                </button>
            </div>
        </div>
    );
}
