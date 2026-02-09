
"use strict";

import { Zap } from 'lucide-react';

interface ViralModeProps {
    onActivate: () => void;
    language?: 'en' | 'pt';
}

export default function ViralMode({ onActivate, language = 'en' }: ViralModeProps) {
    return (
        <button
            onClick={onActivate}
            className="w-full mb-6 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg border-2 border-yellow-300 transform hover:scale-105 transition-all flex items-center justify-center gap-2 animate-pulse"
        >
            <Zap className="text-yellow-100" />
            {language === 'pt' ? 'MODO SALGADINHO VIRAL 🍗' : 'VIRAL SNACK MODE 🍗'}
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">POPULAR</span>
        </button>
    );
}
