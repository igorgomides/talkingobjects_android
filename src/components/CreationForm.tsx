"use client";

import { useState, useEffect } from 'react';
import { Loader2, Wand2, Sparkles, Upload, Music, Star, Trash2 } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { createClient } from '@/utils/supabase/client';
import ScenarioSelector, { SCENARIOS } from './ScenarioSelector';

interface CreationFormProps {
    formData: {
        objectName: string;
        emotion: string;
        reason: string;
        script: string;
        prompt: string;
    };
    setFormData: (data: any) => void;

    // New Props for v2.0
    voiceStyle: string;
    setVoiceStyle: (style: string) => void;
    logoImage: string | null;
    setLogoImage: (img: string | null) => void;

    onSubmit: (e?: React.FormEvent, uploadedImg?: string, scenarioPrompt?: string) => void;
    onGenerateScript: () => void;
    onRefinePrompt: (scenarioContext: string) => void;
    isGeneratingScript: boolean;
    isRefiningPrompt: boolean;
    isLoading: boolean;
    geminiModel: string;
    setGeminiModel: (model: string) => void;
    veoModel: string;
    setVeoModel: (model: string) => void;


    language: 'en' | 'pt';
}

const t = {
    en: {
        tabCreate: "Create New",
        tabUpload: "Upload Image",
        modelLabel: "SCRIPT MODEL:",
        veoModelLabel: "VIDEO MODEL:",
        qualityLabel: "Video Quality",
        qualityFast: "Fast (Standard)",
        qualityQuality: "High Quality (Pro)",
        credits: "credits",
        objectLabel: "Protagonist Object",
        objectPlaceholder: "Ex: A Cupcake, Instagram Logo",
        emotionLabel: "Dominant Emotion",
        reasonLabel: "Reason for Emotion",
        reasonPlaceholder: "Ex: The algorithm dropped the reach",
        scriptLabel: "Script (Speech)",
        scriptPlaceholder: "The exact text that will be spoken...",
        generateScript: "Generate Speech",
        generating: "Generating...",
        promptLabel: "Image Prompt (Approval)",
        promptPlaceholder: "Generate the prompt to approve before creating video...",
        generatePrompt: "Generate Image Prompt",
        refining: "Refining...",
        voiceLabel: "Voice Style",
        logoLabel: "Brand Logo (Optional)",
        uploadLogo: "Upload Logo",
        removeLogo: "Remove",
        uploadImageLabel: "Upload Character Image",
        approveButton: "Next: Review & Generate ➡️",
        favorites: "Favorites",
        saveFavorite: "Save",
        noFavorites: "No saved scripts.",
        emotions: {
            angry: "Very Angry 😡",
            sarcastic: "Sarcastic 😒",
            sad: "Sad 😢",
            euphoric: "Euphoric 🤩"
        },
        voices: {
            cartoon: "Cartoon / Expressive",
            monster: "Monster / Deep",
            child: "Child / High Pitch",
            male: "Male / Narrator",
            female: "Female / Narrator",
        }
    },
    pt: {
        tabCreate: "Criar Novo",
        tabUpload: "Upload Imagem",
        modelLabel: "MODELO SCRIPT:",
        veoModelLabel: "MODELO VÍDEO:",
        qualityLabel: "Qualidade do Vídeo",
        qualityFast: "Rápido (Padrão)",
        qualityQuality: "Alta Qualidade (Pro)",
        credits: "créditos",
        objectLabel: "Objeto Protagonista",
        objectPlaceholder: "Ex: Uma Coxinha, Logo do Instagram",
        emotionLabel: "Emoção Dominante",
        reasonLabel: "Motivo da Emoção",
        reasonPlaceholder: "Ex: O algoritmo derrubou o alcance",
        scriptLabel: "Roteiro (Fala)",
        scriptPlaceholder: "O texto exato que será falado...",
        generateScript: "Gerar Fala",
        generating: "Gerando...",
        promptLabel: "Prompt da Imagem (Aprovação)",
        promptPlaceholder: "Gere o prompt para aprovar antes de criar o vídeo...",
        generatePrompt: "Gerar Prompt de Imagem",
        refining: "Refinando...",
        voiceLabel: "Estilo da Voz",
        logoLabel: "Logo da Marca (Opcional)",
        uploadLogo: "Subir Logo",
        removeLogo: "Remover",
        uploadImageLabel: "Upload Imagem do Personagem",
        approveButton: "Próximo: Revisar & Gerar ➡️",
        favorites: "Favoritos",
        saveFavorite: "Salvar",
        noFavorites: "Sem roteiros salvos.",
        emotions: {
            angry: "Com muita Raiva 😡",
            sarcastic: "Sarcástico 😒",
            sad: "Triste 😢",
            euphoric: "Eufórico 🤩"
        },
        voices: {
            cartoon: "Cartoon / Expressivo",
            monster: "Monstro / Grave",
            child: "Criança / Agudo",
            male: "Masculino / Narrador",
            female: "Feminino / Narradora",
        }
    }
};

export default function CreationForm({
    formData,
    setFormData,
    voiceStyle,
    setVoiceStyle,
    logoImage,
    setLogoImage,
    onSubmit,
    onGenerateScript,
    onRefinePrompt,
    isGeneratingScript,
    isRefiningPrompt,
    isLoading,
    geminiModel,
    setGeminiModel,
    veoModel,
    setVeoModel,
    language = 'en'
}: CreationFormProps) {

    const text = t[language];
    const [activeTab, setActiveTab] = useState<'create' | 'upload'>('create');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);

    // v3.0.1 - Dynamic Scenarios
    const [scenario, setScenario] = useState<string>('school_lunchbox'); // Default
    const [customScenarioPrompt, setCustomScenarioPrompt] = useState<string>("");

    const supabase = createClient();

    useEffect(() => {
        // Load favorites from Supabase (Generations table as per instructions)
        const loadFavorites = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('generations')
                    .select('prompt_text')
                    .order('created_at', { ascending: false });

                if (data) {
                    // Filter out nulls and duplicates if any
                    const scripts = data.map(g => g.prompt_text).filter(Boolean) as string[];
                    setFavorites([...new Set(scripts)]);
                }
            } else {
                // Fallback to local storage for guests (or clear it)
                const saved = localStorage.getItem('scriptFavorites');
                if (saved) setFavorites(JSON.parse(saved));
            }
        };
        loadFavorites();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isLogo: boolean = false) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (isLogo) {
                    setLogoImage(result);
                } else {
                    setUploadedImage(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRefineClick = () => {
        const selectedPreset = SCENARIOS.find(s => s.id === scenario);
        const scenarioPrompt = scenario === 'custom' ? customScenarioPrompt : selectedPreset?.prompt || "";
        onRefinePrompt(scenarioPrompt);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Find the full prompt for the selected scenario
        const selectedPreset = SCENARIOS.find(s => s.id === scenario);
        const scenarioPrompt = scenario === 'custom' ? customScenarioPrompt : selectedPreset?.prompt || "";

        if (activeTab === 'upload' && uploadedImage) {
            onSubmit(undefined, uploadedImage, scenarioPrompt);
        } else {
            onSubmit(e, undefined, scenarioPrompt);
        }
    };

    const toggleFavorite = async (script: string) => {
        if (!script) return;

        // Optimistic UI Update
        let newFavs = [...favorites];
        const exists = newFavs.includes(script);

        if (exists) {
            newFavs = newFavs.filter(s => s !== script);
        } else {
            newFavs.unshift(script); // Add to top
        }
        setFavorites(newFavs);

        // Supabase Sync
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            if (exists) {
                // Remove from DB (Delete by matching text - simplistic approach)
                await supabase.from('generations').delete().eq('prompt_text', script).eq('user_id', user.id);
            } else {
                // Add to DB
                await supabase.from('generations').insert({
                    user_id: user.id,
                    prompt_text: script,
                    meta_voice_style: voiceStyle,
                    meta_language: language,
                    is_viral_mode: formData.objectName?.includes('Coxinha') || false
                });
            }
        } else {
            // Fallback
            localStorage.setItem('scriptFavorites', JSON.stringify(newFavs));
        }
    };

    return (
        <div className="glass-card rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow inside the card */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* TABS */}
            <div className="flex border-b border-white/10 relative z-10">
                <button
                    type="button"
                    onClick={() => setActiveTab('create')}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'create' ? 'text-purple-300 border-b-2 border-purple-400 shadow-[0_2px_10px_rgba(168,85,247,0.3)]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {text.tabCreate}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'upload' ? 'text-blue-300 border-b-2 border-blue-400 shadow-[0_2px_10px_rgba(59,130,246,0.3)]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {text.tabUpload}
                </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 relative z-10">

                {/* CREATE MODE: Inputs */}
                {activeTab === 'create' && (
                    <>
                        {/* Collapsible Advanced Settings */}
                        <div className="mb-4">
                            <details className="group glass-card rounded-xl border border-white/10 overflow-hidden transition-all duration-300">
                                <summary className="flex items-center justify-between p-4 cursor-pointer select-none text-xs font-bold text-purple-300 uppercase tracking-widest hover:text-white hover:bg-white/5">
                                    <span>⚙️ {language === 'pt' ? 'Configurações Avançadas' : 'Advanced Settings'}</span>
                                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <div className="p-4 border-t border-white/10 flex flex-col gap-4 bg-black/20">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">{text.modelLabel}</label>
                                        <select
                                            value={geminiModel}
                                            onChange={(e) => setGeminiModel(e.target.value)}
                                            className="glass-input text-white text-xs rounded-md px-3 py-2 outline-none w-full"
                                        >
                                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                            <option value="gemini-flash-latest">Gemini Flash Latest</option>
                                            <option value="gemini-3-flash-preview">Gemini 3 Flash (Preview)</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{text.veoModelLabel}</label>
                                        <select
                                            value={veoModel}
                                            onChange={(e) => setVeoModel(e.target.value)}
                                            className="glass-input text-white text-xs rounded-md px-3 py-2 outline-none w-full"
                                        >
                                            <option value="veo-3.1-generate-preview">Veo 3.1 Preview (Standard)</option>
                                            <option value="veo-3.1-fast-generate-preview">Veo 3.1 Fast (Preview)</option>
                                        </select>
                                    </div>
                                </div>
                            </details>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-purple-300 mb-1">{text.objectLabel}</label>
                            <input
                                name="objectName"
                                value={formData.objectName}
                                onChange={handleChange}
                                placeholder={text.objectPlaceholder}
                                className="glass-input w-full text-white rounded-md p-3 outline-none shadow-inner"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-purple-300 mb-1">{text.emotionLabel}</label>
                            <select
                                name="emotion"
                                value={formData.emotion}
                                onChange={handleChange}
                                className="glass-input w-full text-white rounded-md p-3 outline-none"
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
                                className="glass-input w-full text-white rounded-md p-3 outline-none shadow-inner"
                            />
                        </div>

                        {/* NEW: Scenario Selector */}
                        <div className="pt-2 border-t border-gray-700 mt-2">
                            <ScenarioSelector
                                selectedId={scenario}
                                onSelect={(id, prompt) => setScenario(id)}
                                customPrompt={customScenarioPrompt}
                                setCustomPrompt={setCustomScenarioPrompt}
                                language={language}
                            />
                        </div>
                    </>
                )}

                {/* UPLOAD MODE: Image Input */}
                {activeTab === 'upload' && (
                    <div className="p-6 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-blue-400 transition-colors glass-card">
                        <Upload className="text-blue-400" size={32} />
                        <label className="cursor-pointer bg-blue-600 text-white px-5 py-3 rounded-lg font-bold transition-all bubbly-button shadow-bubbly-blue">
                            {text.uploadImageLabel}
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden" />
                        </label>
                        {uploadedImage && (
                            <div className="relative w-full max-w-[150px] aspect-[9/16] rounded overflow-hidden border border-gray-600">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={uploadedImage} alt="Uploaded" className="object-cover w-full h-full" />
                            </div>
                        )}
                    </div>
                )}

                {/* COMMON: Script */}
                <div className="relative">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-purple-300">{text.scriptLabel}</label>
                            {activeTab === 'create' && (!formData.script && !isGeneratingScript) && (
                                <button
                                    type="button"
                                    className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-4 w-full justify-center rounded-xl flex items-center gap-2 disabled:opacity-50 transition-all font-bold bubbly-button shadow-bubbly-purple"
                                    onClick={onGenerateScript}
                                    disabled={isGeneratingScript || !formData.objectName}
                                >
                                    {isGeneratingScript ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                    {isGeneratingScript ? text.generating : text.generateScript}
                                </button>
                            )}
                        </div>

                        {(formData.script || isGeneratingScript || showFavorites || activeTab === 'upload') && (
                            <div className="relative mt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowFavorites(!showFavorites)}
                                    className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                                >
                                    <Star size={12} fill={showFavorites ? "currentColor" : "none"} /> {text.favorites}
                                </button>

                                {showFavorites && (
                                    <div className="absolute right-0 top-6 w-64 bg-gray-800 border border-gray-600 rounded-md shadow-xl z-20 max-h-48 overflow-y-auto">
                                        {favorites.length === 0 ? (
                                            <p className="p-2 text-xs text-gray-400 text-center">{text.noFavorites}</p>
                                        ) : (
                                            favorites.map((fav, i) => (
                                                <div key={i} className="p-2 hover:bg-gray-700 flex justify-between items-start gap-2 border-b border-gray-700 last:border-0">
                                                    <p
                                                        className="text-xs text-gray-300 cursor-pointer flex-1 line-clamp-2"
                                                        onClick={() => {
                                                            setFormData({ ...formData, script: fav });
                                                            setShowFavorites(false);
                                                        }}
                                                    >
                                                        {fav}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(fav); }}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {(formData.script || isGeneratingScript || activeTab === 'upload') && (
                        <div className="relative">
                            <TextareaAutosize
                                name="script"
                                value={formData.script}
                                onChange={handleChange}
                                disabled={isGeneratingScript}
                                placeholder={isGeneratingScript ? text.generating : text.scriptPlaceholder}
                                minRows={3}
                                className={`glass-input w-full text-white rounded-md p-3 outline-none pr-8 pb-12 shadow-inner transition-opacity resize-none overflow-hidden ${isGeneratingScript ? 'opacity-50 cursor-wait' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => toggleFavorite(formData.script)}
                                className={`absolute top-2 right-2 ${favorites.includes(formData.script) ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`}
                                title={text.saveFavorite}
                            >
                                <Star size={16} fill={favorites.includes(formData.script) ? "currentColor" : "none"} />
                            </button>

                            <button
                                type="button"
                                className="absolute bottom-2 right-10 text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1 font-bold bubbly-button shadow-bubbly-purple"
                                onClick={onGenerateScript}
                                disabled={isGeneratingScript || !formData.objectName}
                            >
                                {isGeneratingScript ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                {language === 'pt' ? 'Regerar' : 'Regenerate'}
                            </button>
                        </div>
                    )}
                </div>

                {/* CREATE MODE: Prompt Input */}
                {activeTab === 'create' && (
                    <div>
                        <div className="flex flex-col gap-2 mb-2">
                            <label className="block text-sm font-medium text-purple-300">{text.promptLabel}</label>
                            {(!formData.prompt && !isRefiningPrompt) && (
                                <button
                                    type="button"
                                    className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4 justify-center rounded-xl w-full flex items-center gap-2 disabled:opacity-50 font-bold transition-all bubbly-button shadow-bubbly-blue"
                                    onClick={handleRefineClick}
                                    disabled={isRefiningPrompt || !formData.objectName}
                                >
                                    {isRefiningPrompt ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                    {isRefiningPrompt ? text.refining : text.generatePrompt}
                                </button>
                            )}
                        </div>

                        {(formData.prompt || isRefiningPrompt) && (
                            <div className="relative">
                                <TextareaAutosize
                                    name="prompt"
                                    value={formData.prompt || ''}
                                    onChange={handleChange}
                                    disabled={isRefiningPrompt}
                                    placeholder={isRefiningPrompt ? text.refining : text.promptPlaceholder}
                                    minRows={4}
                                    className={`glass-input w-full text-white rounded-md p-3 outline-none font-mono text-sm text-gray-300 pb-12 shadow-inner transition-opacity resize-none overflow-hidden ${isRefiningPrompt ? 'opacity-50 cursor-wait' : ''}`}
                                />

                                <button
                                    type="button"
                                    className="absolute bottom-2 right-2 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1 disabled:opacity-50 font-bold bubbly-button shadow-bubbly-blue"
                                    onClick={handleRefineClick}
                                    disabled={isRefiningPrompt || !formData.objectName}
                                >
                                    {isRefiningPrompt ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                    {language === 'pt' ? 'Regerar' : 'Regenerate'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* COMMON: Voice & Logo */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1 flex items-center gap-1">
                            <Music size={14} /> {text.voiceLabel}
                        </label>
                        <select
                            value={voiceStyle}
                            onChange={(e) => setVoiceStyle(e.target.value)}
                            className="glass-input w-full text-white rounded-md p-3 outline-none text-sm"
                        >
                            <option value="Cartoon / Expressive">{text.voices.cartoon}</option>
                            <option value="Monster / Deep">{text.voices.monster}</option>
                            <option value="Child / High Pitch">{text.voices.child}</option>
                            <option value="Male / Narrator">{text.voices.male}</option>
                            <option value="Female / Narrator">{text.voices.female}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-purple-300 mb-1">{text.logoLabel}</label>
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-bold transition-colors flex items-center gap-1">
                                <Upload size={12} /> {text.uploadLogo}
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                            </label>
                            {logoImage && (
                                <div className="flex items-center gap-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={logoImage} alt="Logo" className="w-8 h-8 object-contain bg-black/20 rounded" />
                                    <button
                                        type="button"
                                        onClick={() => setLogoImage(null)}
                                        className="text-red-400 hover:text-red-300 p-1"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || (activeTab === 'create' && !formData.prompt) || (activeTab === 'upload' && !uploadedImage)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 mt-6 bubbly-button shadow-bubbly-purple text-lg"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : text.approveButton}
                </button>
            </form>
        </div>
    );
}
