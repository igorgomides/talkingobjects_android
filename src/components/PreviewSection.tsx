
"use client";

import { Download } from 'lucide-react';
// import Image from 'next/image'; // Unused in this version

interface PreviewSectionProps {
    imageUrl?: string;
    videoUrl?: string;
    isGenerating: boolean;
    language: 'en' | 'pt';
}

export default function PreviewSection({ imageUrl, videoUrl, isGenerating, language }: PreviewSectionProps) {
    const t = {
        en: {
            placeholder: "Your video will appear here",
            baseImage: "Base Image",
            preview: "Preview",
            generating: "Generating...",
            downloadImage: "Download Image (PNG)",
            finalVideo: "Final Video",
            downloadVideo: "Download Video MP4"
        },
        pt: {
            placeholder: "Seu vídeo aparecerá aqui",
            baseImage: "Imagem Base",
            preview: "Pré-visualização",
            generating: "Gerando...",
            downloadImage: "Baixar Imagem (PNG)",
            finalVideo: "Vídeo Final",
            downloadVideo: "Baixar Vídeo MP4"
        }
    };

    const text = t[language];

    if (!imageUrl && !videoUrl && !isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-white/20 rounded-2xl text-gray-500 glass-card">
                <p className="font-medium animate-pulse">{text.placeholder}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Image Section - Always visible if exists */}
            {imageUrl && (
                <div className="flex flex-col items-center gap-4">
                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">
                        {videoUrl ? text.baseImage : text.preview}
                    </h3>
                    <div className="relative aspect-[9/16] w-full max-w-[200px] mx-auto rounded-xl overflow-hidden glass-card p-1 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} alt="Generated Preview" className="object-cover w-full h-full rounded-lg" />
                        {isGenerating && !videoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                                <p className="text-white font-bold animate-pulse">{text.generating}</p>
                            </div>
                        )}
                    </div>
                    <a
                        href={imageUrl}
                        download="generated-character.png"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs font-bold transition-all"
                    >
                        <Download size={14} /> {text.downloadImage}
                    </a>
                </div>
            )}

            {/* Video Section */}
            {videoUrl && (
                <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-700">
                    <h3 className="text-green-400 text-sm font-bold uppercase tracking-wider animate-pulse">
                        {text.finalVideo}
                    </h3>
                    <div className="relative aspect-[9/16] w-full max-w-[300px] rounded-2xl overflow-hidden glass-card p-2 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <video src={videoUrl} controls className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <a
                        href={videoUrl}
                        download="viral-video.mp4"
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-bold transition-all text-lg bubbly-button shadow-bubbly-green mt-4"
                    >
                        <Download size={24} /> {text.downloadVideo}
                    </a>
                </div>
            )}
        </div>
    );
}
