
"use client";

import { useState, useEffect } from 'react';
import {
    Utensils, PartyPopper, ShoppingBasket,
    MonitorPlay, Zap, Palette, HelpCircle
} from 'lucide-react';

export type ScenarioPreset = {
    id: string;
    label: { en: string; pt: string };
    icon: React.ElementType;
    prompt: string;
    category: 'commercial' | 'creator' | 'custom';
};

export const SCENARIOS: ScenarioPreset[] = [
    // A. Commercial Presets
    {
        id: 'school_lunchbox',
        label: { en: 'School Lunchbox', pt: 'Lancheira Escolar' },
        icon: Utensils,
        prompt: "inside a colorful open kids lunchbox, cafeteria table background, soft lighting",
        category: 'commercial'
    },
    {
        id: 'party_table',
        label: { en: 'Party Table', pt: 'Mesa de Festa' },
        icon: PartyPopper,
        prompt: "on a festive table with colorful confetti and blurred party balloons in background",
        category: 'commercial'
    },
    {
        id: 'supermarket',
        label: { en: 'Supermarket Shelf', pt: 'Prateleira de Mercado' },
        icon: ShoppingBasket,
        prompt: "sitting on a supermarket wooden shelf, blurred aisle background with products",
        category: 'commercial'
    },
    // B. Creator Tools
    {
        id: 'green_screen',
        label: { en: 'Green Screen', pt: 'Tela Verde (Chroma)' },
        icon: MonitorPlay,
        prompt: "isolated on a solid bright green background #00FF00, flat lighting, no shadows, matte look",
        category: 'creator'
    },
    {
        id: 'neon_studio',
        label: { en: 'Neon Studio', pt: 'Estúdio Neon' },
        icon: Zap,
        prompt: "in a dark futuristic studio with purple and blue neon rim lighting, cyberpunk aesthetic",
        category: 'creator'
    },
    // C. Custom
    {
        id: 'custom',
        label: { en: 'Custom / Manual', pt: 'Personalizado' },
        icon: Palette,
        prompt: "",
        category: 'custom'
    }
];

interface ScenarioSelectorProps {
    selectedId: string;
    onSelect: (id: string, prompt: string) => void;
    customPrompt: string;
    setCustomPrompt: (val: string) => void;
    language: 'en' | 'pt';
}

export default function ScenarioSelector({
    selectedId,
    onSelect,
    customPrompt,
    setCustomPrompt,
    language
}: ScenarioSelectorProps) {

    const handleSelect = (scenario: ScenarioPreset) => {
        onSelect(scenario.id, scenario.id === 'custom' ? customPrompt : scenario.prompt);
    };

    // Update parent when custom prompt typing changes
    useEffect(() => {
        if (selectedId === 'custom') {
            onSelect('custom', customPrompt);
        }
    }, [customPrompt, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-purple-300 mb-1 flex items-center gap-1">
                <Palette size={14} />
                {language === 'en' ? 'Background Scenario' : 'Cenário de Fundo'}
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SCENARIOS.map((scenario) => {
                    const isSelected = selectedId === scenario.id;
                    const Icon = scenario.icon;
                    return (
                        <button
                            key={scenario.id}
                            type="button"
                            onClick={() => handleSelect(scenario)}
                            className={`
                                flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all text-xs font-bold text-center
                                ${isSelected
                                    ? 'glass-card border-purple-400 text-purple-200 shadow-neon-purple scale-105 z-10'
                                    : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/40 hover:border-white/20'}
                            `}
                        >
                            <Icon size={20} className={isSelected ? 'text-purple-400' : 'text-gray-500'} />
                            {scenario.label[language]}
                        </button>
                    );
                })}
            </div>

            {selectedId === 'custom' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <input
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder={language === 'en' ? "Ex: On a sunny beach..." : "Ex: Numa praia ensolarada..."}
                        className="glass-input w-full text-white text-sm rounded-lg p-3 outline-none mt-2 shadow-inner"
                    />
                </div>
            )}
        </div>
    );
}
