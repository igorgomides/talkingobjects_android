"use client";

import { useState, useEffect } from 'react';
import { Loader2, Wand2, Sparkles, Upload, Music, Star, Trash2, ChevronRight, ChevronLeft, Check, Target, ArrowDown, ArrowUp, ZoomIn, Maximize, Grid3x3 } from 'lucide-react';
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

    // Framing
    framing: string;
    setFraming: (f: string) => void;

    onSubmit: (e?: React.FormEvent, uploadedImg?: string, scenarioPrompt?: string) => void;
    onGenerateScript: () => void;
    onRefinePrompt: (scenarioContext: string, framingContext: string) => void;
    isGeneratingScript: boolean;
    isRefiningPrompt: boolean;
    isLoading: boolean;
    geminiModel: string;
    setGeminiModel: (model: string) => void;
    veoModel: string;
    setVeoModel: (model: string) => void;

    language: 'en' | 'pt';
}

// --- FRAMING OPTIONS ---
const FRAMING_OPTIONS = [
    {
        id: 'center',
        label: { en: 'Center', pt: 'Centralizado' },
        icon: Target,
        prompt: 'centered in the frame, hero shot',
        description: { en: 'Hero shot, centered', pt: 'Destaque central' }
    },
    {
        id: 'low_angle',
        label: { en: 'Low Angle', pt: 'Ângulo Baixo' },
        icon: ArrowDown,
        prompt: 'shot from below, low angle, dramatic perspective',
        description: { en: 'Dramatic, from below', pt: 'Dramático, de baixo' }
    },
    {
        id: 'high_angle',
        label: { en: 'High Angle', pt: 'Ângulo Alto' },
        icon: ArrowUp,
        prompt: 'shot from above, high angle, looking down',
        description: { en: "Bird's eye view", pt: 'Vista de cima' }
    },
    {
        id: 'closeup',
        label: { en: 'Close-Up', pt: 'Close-Up' },
        icon: ZoomIn,
        prompt: 'extreme close-up, filling the frame',
        description: { en: 'Tight face crop', pt: 'Rosto próximo' }
    },
    {
        id: 'wide',
        label: { en: 'Wide Shot', pt: 'Plano Aberto' },
        icon: Maximize,
        prompt: 'wide shot, full body visible, environmental',
        description: { en: 'Full scene visible', pt: 'Cena completa' }
    },
    {
        id: 'thirds',
        label: { en: 'Rule of Thirds', pt: 'Regra dos Terços' },
        icon: Grid3x3,
        prompt: 'positioned off-center using rule of thirds, cinematic composition',
        description: { en: 'Cinematic, off-center', pt: 'Cinema, fora do centro' }
    },
];

// --- TRANSLATIONS ---
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
        approveButton: "Generate Image ✨",
        favorites: "Favorites",
        saveFavorite: "Save",
        noFavorites: "No saved scripts.",
        next: "Next",
        back: "Back",
        stepCharacter: "Character",
        stepScene: "Scene & Framing",
        stepScript: "Script",
        stepImage: "Image",
        stepSettings: "Settings",
        framingLabel: "Camera Framing",
        framingDesc: "Choose how your character is positioned in the frame",
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
        approveButton: "Gerar Imagem ✨",
        favorites: "Favoritos",
        saveFavorite: "Salvar",
        noFavorites: "Sem roteiros salvos.",
        next: "Próximo",
        back: "Voltar",
        stepCharacter: "Personagem",
        stepScene: "Cena & Enquadramento",
        stepScript: "Roteiro",
        stepImage: "Imagem",
        stepSettings: "Configurações",
        framingLabel: "Enquadramento da Câmera",
        framingDesc: "Escolha como seu personagem é posicionado no frame",
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

// --- STEP INDICATOR ---
function StepIndicator({ currentStep, totalSteps, language }: { currentStep: number; totalSteps: number; language: 'en' | 'pt' }) {
    const stepLabels = language === 'en'
        ? ['Character', 'Scene', 'Script', 'Image', 'Settings']
        : ['Persona', 'Cena', 'Roteiro', 'Imagem', 'Config'];

    return (
        <div className="flex items-center justify-center gap-0 w-full px-2 mb-6">
            {Array.from({ length: totalSteps }, (_, i) => {
                const step = i + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;

                return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1">
                            <div className={`step-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                {isCompleted ? <Check size={14} /> : step}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-purple-300' : isCompleted ? 'text-green-400/70' : 'text-gray-600'}`}>
                                {stepLabels[i]}
                            </span>
                        </div>
                        {step < totalSteps && (
                            <div className={`step-line mx-1 mb-4 ${step < currentStep ? 'active' : ''}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// --- MAIN COMPONENT ---
export default function CreationForm({
    formData,
    setFormData,
    voiceStyle,
    setVoiceStyle,
    logoImage,
    setLogoImage,
    framing,
    setFraming,
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
    const [currentStep, setCurrentStep] = useState(1);
    const [slideDirection, setSlideDirection] = useState<'slide-in-right' | 'slide-in-left'>('slide-in-right');
    const [activeTab, setActiveTab] = useState<'create' | 'upload'>('create');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);

    // v3.0.1 - Dynamic Scenarios
    const [scenario, setScenario] = useState<string>('school_lunchbox');
    const [customScenarioPrompt, setCustomScenarioPrompt] = useState<string>("");

    // Track what scenario+framing was used for the current prompt
    const [lastPromptContext, setLastPromptContext] = useState<string>("");

    const TOTAL_STEPS = 5;
    const supabase = createClient();

    useEffect(() => {
        const loadFavorites = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('generations')
                    .select('prompt_text')
                    .order('created_at', { ascending: false });

                if (data) {
                    const scripts = data.map(g => g.prompt_text).filter(Boolean) as string[];
                    setFavorites([...new Set(scripts)]);
                }
            } else {
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
        const selectedFraming = FRAMING_OPTIONS.find(f => f.id === framing);
        const framingPrompt = selectedFraming?.prompt || 'centered in the frame, hero shot';
        // Save context so we can detect changes later
        setLastPromptContext(`${scenario}|${framing}`);
        onRefinePrompt(scenarioPrompt, framingPrompt);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedPreset = SCENARIOS.find(s => s.id === scenario);
        const scenarioPrompt = scenario === 'custom' ? customScenarioPrompt : selectedPreset?.prompt || "";
        const selectedFraming = FRAMING_OPTIONS.find(f => f.id === framing);
        const framingPrompt = selectedFraming?.prompt || 'centered in the frame, hero shot';
        const fullContext = [scenarioPrompt, framingPrompt].filter(Boolean).join(', ');

        if (activeTab === 'upload' && uploadedImage) {
            onSubmit(undefined, uploadedImage, fullContext);
        } else {
            onSubmit(e, undefined, fullContext);
        }
    };

    const toggleFavorite = async (script: string) => {
        if (!script) return;
        let newFavs = [...favorites];
        const exists = newFavs.includes(script);

        if (exists) {
            newFavs = newFavs.filter(s => s !== script);
        } else {
            newFavs.unshift(script);
        }
        setFavorites(newFavs);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            if (exists) {
                await supabase.from('generations').delete().eq('prompt_text', script).eq('user_id', user.id);
            } else {
                await supabase.from('generations').insert({
                    user_id: user.id,
                    prompt_text: script,
                    meta_voice_style: voiceStyle,
                    meta_language: language,
                    is_viral_mode: formData.objectName?.includes('Coxinha') || false
                });
            }
        } else {
            localStorage.setItem('scriptFavorites', JSON.stringify(newFavs));
        }
    };

    // --- NAVIGATION ---
    const goNext = () => {
        if (currentStep < TOTAL_STEPS) {
            // If leaving Step 2, check if scenario/framing changed since last prompt
            if (currentStep === 2 && formData.prompt) {
                const currentContext = `${scenario}|${framing}`;
                if (lastPromptContext && currentContext !== lastPromptContext) {
                    // Scene or framing changed — clear old prompt to force regeneration
                    setFormData({ ...formData, prompt: '' });
                }
            }
            setSlideDirection('slide-in-right');
            setCurrentStep(prev => prev + 1);
        }
    };

    const goBack = () => {
        if (currentStep > 1) {
            setSlideDirection('slide-in-left');
            setCurrentStep(prev => prev - 1);
        }
    };

    // --- VALIDATION ---
    const canAdvance = (): boolean => {
        switch (currentStep) {
            case 1: return !!(formData.objectName && formData.reason);
            case 2: return true; // Scenario & framing are optional (have defaults)
            case 3: return !!formData.script;
            case 4:
                if (activeTab === 'upload') return !!uploadedImage;
                return !!formData.prompt;
            case 5: return true;
            default: return true;
        }
    };

    return (
        <div className="glass-card rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="p-6 relative z-10">
                {/* Step Indicator */}
                <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} language={language} />

                <form onSubmit={handleFormSubmit}>
                    {/* ============= STEP 1: CHARACTER ============= */}
                    {currentStep === 1 && (
                        <div key="step-1" className={`wizard-step ${slideDirection} space-y-5`}>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                ✨ {text.stepCharacter}
                            </h2>

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
                        </div>
                    )}

                    {/* ============= STEP 2: SCENE & FRAMING ============= */}
                    {currentStep === 2 && (
                        <div key="step-2" className={`wizard-step ${slideDirection} space-y-5`}>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                🎬 {text.stepScene}
                            </h2>

                            {/* Scenario Selector */}
                            <ScenarioSelector
                                selectedId={scenario}
                                onSelect={(id, prompt) => setScenario(id)}
                                customPrompt={customScenarioPrompt}
                                setCustomPrompt={setCustomScenarioPrompt}
                                language={language}
                            />

                            {/* Framing Position Picker */}
                            <div className="pt-3 border-t border-white/10">
                                <label className="block text-sm font-medium text-purple-300 mb-1">{text.framingLabel}</label>
                                <p className="text-xs text-gray-500 mb-3">{text.framingDesc}</p>

                                <div className="grid grid-cols-3 gap-2">
                                    {FRAMING_OPTIONS.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = framing === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => setFraming(option.id)}
                                                className={`framing-card flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center ${isSelected ? 'selected border-purple-400' : 'border-white/10 bg-black/20'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-purple-500/30' : 'bg-white/5'}`}>
                                                    <Icon size={20} className={isSelected ? 'text-purple-300' : 'text-gray-500'} />
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? 'text-purple-200' : 'text-gray-400'}`}>
                                                    {option.label[language]}
                                                </span>
                                                <span className={`text-[9px] ${isSelected ? 'text-purple-300/70' : 'text-gray-600'}`}>
                                                    {option.description[language]}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============= STEP 3: SCRIPT ============= */}
                    {currentStep === 3 && (
                        <div key="step-3" className={`wizard-step ${slideDirection} space-y-5`}>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                🗣️ {text.stepScript}
                            </h2>

                            <div className="relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col gap-2 flex-1">
                                        <label className="block text-sm font-medium text-purple-300">{text.scriptLabel}</label>
                                        {(!formData.script && !isGeneratingScript) && (
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

                                    {(formData.script || isGeneratingScript) && (
                                        <div className="relative mt-1 ml-2">
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

                                {(formData.script || isGeneratingScript) && (
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
                        </div>
                    )}

                    {/* ============= STEP 4: IMAGE ============= */}
                    {currentStep === 4 && (
                        <div key="step-4" className={`wizard-step ${slideDirection} space-y-5`}>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                🖼️ {text.stepImage}
                            </h2>

                            {/* TABS: Create / Upload */}
                            <div className="flex border-b border-white/10 rounded-t-xl overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('create')}
                                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'create' ? 'text-purple-300 border-b-2 border-purple-400 shadow-[0_2px_10px_rgba(168,85,247,0.3)]' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {text.tabCreate}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('upload')}
                                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'upload' ? 'text-blue-300 border-b-2 border-blue-400 shadow-[0_2px_10px_rgba(59,130,246,0.3)]' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {text.tabUpload}
                                </button>
                            </div>

                            {/* CREATE MODE */}
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

                            {/* UPLOAD MODE */}
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
                        </div>
                    )}

                    {/* ============= STEP 5: SETTINGS & SUBMIT ============= */}
                    {currentStep === 5 && (
                        <div key="step-5" className={`wizard-step ${slideDirection} space-y-5`}>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                ⚙️ {text.stepSettings}
                            </h2>

                            {/* Voice Style */}
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

                            {/* Logo Upload */}
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

                            {/* Advanced Settings */}
                            <details className="group glass-card rounded-xl border border-white/10 overflow-hidden transition-all duration-300">
                                <summary className="flex items-center justify-between p-4 cursor-pointer select-none text-xs font-bold text-purple-300 uppercase tracking-widest hover:text-white hover:bg-white/5">
                                    <span>⚙️ {language === 'pt' ? 'Modelos de IA' : 'AI Models'}</span>
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

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                disabled={isLoading || (activeTab === 'create' && !formData.prompt) || (activeTab === 'upload' && !uploadedImage)}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 mt-4 bubbly-button shadow-bubbly-purple text-lg"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : text.approveButton}
                            </button>
                        </div>
                    )}

                    {/* ============= NAVIGATION BUTTONS ============= */}
                    {currentStep < 5 && (
                        <div className="flex justify-between items-center mt-8 gap-3">
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="flex items-center gap-1 text-gray-400 hover:text-white px-4 py-3 rounded-xl border border-white/10 hover:border-white/30 transition-all font-bold text-sm"
                                >
                                    <ChevronLeft size={18} /> {text.back}
                                </button>
                            ) : (
                                <div />
                            )}

                            <button
                                type="button"
                                onClick={goNext}
                                disabled={!canAdvance()}
                                className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-40 transition-all bubbly-button shadow-bubbly-purple"
                            >
                                {text.next} <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {currentStep === 5 && currentStep > 1 && (
                        <div className="flex justify-start mt-4">
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex items-center gap-1 text-gray-400 hover:text-white px-4 py-3 rounded-xl border border-white/10 hover:border-white/30 transition-all font-bold text-sm"
                            >
                                <ChevronLeft size={18} /> {text.back}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
