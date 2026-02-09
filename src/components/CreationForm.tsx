
"use strict";

import { Loader2, Wand2, Sparkles } from 'lucide-react';

interface CreationFormProps {
    formData: {
        objectName: string;
        emotion: string;
        reason: string;
        script: string;
        prompt?: string;
    };
    setFormData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGenerateScript: () => void;
    onRefinePrompt: () => void;
    isGeneratingScript: boolean;
    isRefiningPrompt: boolean;
    isLoading: boolean;
    geminiModel: string;
    setGeminiModel: (model: string) => void;
    language: 'en' | 'pt';
}

const t = {
    en: {
        modelLabel: "AI MODEL:",
        objectLabel: "Protagonist Object",
        objectPlaceholder: "Ex: A Cupcake, Instagram Logo",
        emotionLabel: "Dominant Emotion",
        reasonLabel: "Reason for Emotion",
        reasonPlaceholder: "Ex: The algorithm dropped the reach",
        scriptLabel: "Script (Speech)",
        scriptPlaceholder: "The exact text that will be spoken...",
        generateScript: "Generate with AI",
        generating: "Generating...",
        promptLabel: "Image Prompt (Approval)",
        promptPlaceholder: "Generate the prompt to approve before creating video...",
        generatePrompt: "Generate Prompt",
        refining: "Refining...",
        approveButton: "Approve & Generate Video 🚀",
        emotions: {
            angry: "Very Angry 😡",
            sarcastic: "Sarcastic 😒",
            sad: "Sad 😢",
            euphoric: "Euphoric 🤩"
        }
    },
    pt: {
        modelLabel: "MODELO IA:",
        objectLabel: "Objeto Protagonista",
        objectPlaceholder: "Ex: Uma Coxinha, Logo do Instagram",
        emotionLabel: "Emoção Dominante",
        reasonLabel: "Motivo da Emoção",
        reasonPlaceholder: "Ex: O algoritmo derrubou o alcance",
        scriptLabel: "Roteiro (Fala)",
        scriptPlaceholder: "O texto exato que será falado...",
        generateScript: "Gerar com IA",
        generating: "Gerando...",
        promptLabel: "Prompt da Imagem (Aprovação)",
        promptPlaceholder: "Gere o prompt para aprovar antes de criar o vídeo...",
        generatePrompt: "Gerar Prompt",
        refining: "Refinando...",
        approveButton: "Aprovar e Gerar Vídeo 🚀",
        emotions: {
            angry: "Com muita Raiva 😡",
            sarcastic: "Sarcástico 😒",
            sad: "Triste 😢",
            euphoric: "Eufórico 🤩"
        }
    }
};

export default function CreationForm({
    formData,
    setFormData,
    onSubmit,
    onGenerateScript,
    onRefinePrompt,
    isGeneratingScript,
    isRefiningPrompt,
    isLoading,
    geminiModel,
    setGeminiModel,
    language = 'en'
}: CreationFormProps) {

    const text = t[language];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4 p-6 bg-gray-900 rounded-lg shadow-xl border border-purple-500/30">

            {/* Model Selector */}
            <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-2">
                <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">{text.modelLabel}</label>
                <select
                    value={geminiModel}
                    onChange={(e) => setGeminiModel(e.target.value)}
                    className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:border-purple-500 outline-none"
                >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-flash-latest">Gemini Flash Latest</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash (Preview 🚀)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">{text.objectLabel}</label>
                <input
                    name="objectName"
                    value={formData.objectName}
                    onChange={handleChange}
                    placeholder={text.objectPlaceholder}
                    className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">{text.emotionLabel}</label>
                <select
                    name="emotion"
                    value={formData.emotion}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700 focus:border-purple-500 outline-none"
                >
                    <option value="Com muita Raiva">{text.emotions.angry}</option>
                    <option value="Sarcástico">{text.emotions.sarcastic}</option>
                    <option value="Triste">{text.emotions.sad}</option>
                    <option value="Eufórico">{text.emotions.euphoric}</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">{text.reasonLabel}</label>
                <input
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder={text.reasonPlaceholder}
                    className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700 focus:border-purple-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">{text.scriptLabel}</label>
                <div className="relative">
                    <textarea
                        name="script"
                        value={formData.script}
                        onChange={handleChange}
                        placeholder={text.scriptPlaceholder}
                        rows={3}
                        className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700 focus:border-purple-500 outline-none"
                    />
                    <button
                        type="button"
                        className="absolute bottom-2 right-2 text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                        onClick={onGenerateScript}
                        disabled={isGeneratingScript || !formData.objectName}
                    >
                        {isGeneratingScript ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                        {isGeneratingScript ? text.generating : text.generateScript}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">{text.promptLabel}</label>
                <div className="relative">
                    <textarea
                        name="prompt"
                        value={formData.prompt || ''}
                        onChange={handleChange}
                        placeholder={text.promptPlaceholder}
                        rows={4}
                        className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700 focus:border-purple-500 outline-none font-mono text-sm text-gray-300"
                    />
                    <button
                        type="button"
                        className="absolute bottom-2 right-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                        onClick={onRefinePrompt}
                        disabled={isRefiningPrompt || !formData.objectName}
                    >
                        {isRefiningPrompt ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        {isRefiningPrompt ? text.refining : text.generatePrompt}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !formData.prompt}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-md transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : text.approveButton}
            </button>
        </form>
    );
}
