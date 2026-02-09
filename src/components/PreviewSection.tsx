
"use strict";

import { Download } from 'lucide-react';
import Image from 'next/image';

interface PreviewSectionProps {
    imageUrl?: string;
    videoUrl?: string;
    isGenerating: boolean;
}

export default function PreviewSection({ imageUrl, videoUrl, isGenerating }: PreviewSectionProps) {
    if (!imageUrl && !videoUrl && !isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-gray-700 rounded-lg text-gray-500">
                <p>Seu vídeo aparecerá aqui</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {imageUrl && !videoUrl && (
                <div className="relative aspect-[9/16] w-full max-w-[300px] mx-auto rounded-lg overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-500/20">
                    {/* Using standard img tag for now to avoid domain config issues during proto */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Generated Preview" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <p className="text-white font-bold animate-pulse">Gerando Animação...</p>
                    </div>
                </div>
            )}

            {videoUrl && (
                <div className="flex flex-col items-center gap-4">
                    <div className="relative aspect-[9/16] w-full max-w-[300px] rounded-lg overflow-hidden border-2 border-green-500 shadow-lg shadow-green-500/20">
                        <video src={videoUrl} controls className="w-full h-full object-cover" />
                    </div>
                    <a
                        href={videoUrl}
                        download="viral-video.mp4"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-bold transition-all"
                    >
                        <Download size={20} /> Baixar MP4
                    </a>
                </div>
            )}
        </div>
    );
}
