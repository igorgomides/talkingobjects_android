
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
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-gray-700 rounded-lg text-gray-500">
                <p>{text.placeholder}</p>
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
                    <div className="relative aspect-[9/16] w-full max-w-[200px] mx-auto rounded-lg overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-500/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} alt="Generated Preview" className="object-cover w-full h-full" />
                        {isGenerating && !videoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
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
                    <div className="relative aspect-[9/16] w-full max-w-[300px] rounded-lg overflow-hidden border-2 border-green-500 shadow-lg shadow-green-500/20">
                        <video src={videoUrl} controls className="w-full h-full object-cover" />
                    </div>
                    <a
                        href={videoUrl}
                        download="viral-video.mp4"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold transition-all"
                    >
                        <Download size={20} /> {text.downloadVideo}
                    </a>
                </div>
            )}
        </div>
    );
}
