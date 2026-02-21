'use client';

import { useState, useEffect } from 'react';
import { ArrowDown, MessageSquare, ImageIcon, Upload, PlayCircle, Download, Sparkles, Wand2 } from 'lucide-react';
import Link from 'next/link';

export default function TutorialPage() {
    const [language, setLanguage] = useState<'en' | 'pt'>('en');

    useEffect(() => {
        const saved = localStorage.getItem('language') as 'en' | 'pt';
        if (saved) setLanguage(saved);

        const handleLangChange = () => {
            const updated = localStorage.getItem('language') as 'en' | 'pt';
            if (updated) setLanguage(updated);
        };
        window.addEventListener('language-change', handleLangChange);
        return () => window.removeEventListener('language-change', handleLangChange);
    }, []);

    const t = {
        en: {
            title1: "How to Create",
            titleHighlight: "Viral Reels",
            subtitle: "Follow this step-by-step guide to bring any object to life using our AI engine.",
            step1: "Step 1: The Script",
            step1Desc: "Start by giving your object a voice. Tell our AI what you want it to say.",
            step1P1: "Type the name of your object (e.g., 'A cup of coffee').",
            step1P2: "Select the emotion and the reason why it's speaking.",
            step1P3: "Click 'Generate Script with AI' to get a viral hook written by Gemini 2.0.",
            step2: "Step 2: The Visuals",
            step2Desc: "You need a character. You have two amazing choices here:",
            step2Opt1Title: "Option A: Generate with AI (Imagen 4.0)",
            step2Opt1Desc: "Pick a background scenario (Table, Studio, etc.) and let our engine create a 3D masterpiece based on your prompt.",
            step2Opt2Title: "Option B: Use a Personal Photo",
            step2Opt2Desc: "Have a real photo of your product? Click the 'Upload Logo / Photo' button. You can use your own image instead of generating one.",
            step3: "Step 3: The Magic",
            step3Desc: "This is where the object starts breathing. It's time to animate!",
            step3P1: "Review the script and the image on the screen.",
            step3P2: "Choose your Video Quality: Fast Mode (15cr) or High Quality (40cr).",
            step3P3: "Click 'Animate Video' and wait while Google Veo 3.1 does the magic.",
            step4: "Step 4: Download & Post",
            step4Desc: "Your masterpiece is ready. Time to grab the attention of millions.",
            step4P1: "You can download the generated image separately if you want to use it elsewhere.",
            step4P2: "Click 'Download MP4' to save the final video to your device.",
            step4P3: "Post it on Instagram Reels or TikTok and watch the views roll in!",
            ctaTitle: "Ready to start?",
            ctaButton: "Create My First Video"
        },
        pt: {
            title1: "Como Criar",
            titleHighlight: "Reels Virais",
            subtitle: "Siga este passo-a-passo detalhado para dar vida a qualquer objeto usando nosso motor de IA.",
            step1: "Passo 1: O Roteiro",
            step1Desc: "Comece dando uma voz ao seu objeto. Diga à nossa IA o que você quer que ele fale.",
            step1P1: "Digite o nome do seu objeto (ex: 'Uma xícara de café').",
            step1P2: "Selecione a emoção e o motivo pelo qual ele está falando.",
            step1P3: "Clique em 'Gerar Roteiro com IA' para obter um gancho viral escrito pelo Gemini 2.0.",
            step2: "Passo 2: O Visual",
            step2Desc: "Você precisa de um personagem. E você tem duas opções incríveis aqui:",
            step2Opt1Title: "Opção A: Gerar com IA (Imagen 4.0)",
            step2Opt1Desc: "Escolha um cenário (Mesa, Estúdio, etc.) e deixe nossa IA criar uma obra-prima 3D baseada no seu prompt.",
            step2Opt2Title: "Opção B: Usar Foto Pessoal",
            step2Opt2Desc: "Tem uma foto real do seu produto? Clique no botão 'Upload Logo / Foto'. Você pode usar sua própria imagem em vez de gerar uma.",
            step3: "Passo 3: A Mágica",
            step3Desc: "É aqui que o objeto começa a respirar. Hora de animar!",
            step3P1: "Revise o roteiro final e a imagem na tela.",
            step3P2: "Escolha a Qualidade do Vídeo: Fast Mode (15cr) ou Alto Padrão (40cr).",
            step3P3: "Clique em 'Animar Vídeo' e espere enquanto o Google Veo 3.1 faz a mágica.",
            step4: "Passo 4: Baixar e Postar",
            step4Desc: "Sua obra-prima está pronta. Hora de chamar a atenção de milhões.",
            step4P1: "Você pode baixar a imagem gerada separadamente se quiser usá-la em outro lugar.",
            step4P2: "Clique em 'Baixar MP4' para salvar o vídeo final no seu dispositivo.",
            step4P3: "Poste no Instagram Reels ou TikTok e veja as visualizações subirem!",
            ctaTitle: "Pronto para começar?",
            ctaButton: "Criar Meu Primeiro Vídeo"
        }
    };

    const text = t[language];

    const ArrowDivider = () => (
        <div className="flex justify-center my-8">
            <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center animate-bounce shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <ArrowDown className="text-purple-400" size={24} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30 pb-32">

            {/* Header Section */}
            <div className="relative pt-24 pb-16 px-4 overflow-hidden border-b border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black z-0 pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-sm tracking-wide">
                        <Wand2 size={16} /> Tutorial
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        {text.title1} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{text.titleHighlight}</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        {text.subtitle}
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 mt-16">

                {/* STEP 1 */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <MessageSquare size={120} className="text-blue-500 rotate-12" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                    <span className="font-bold text-2xl text-blue-400">1</span>
                                </div>
                                <h2 className="text-3xl font-bold">{text.step1}</h2>
                            </div>
                            <p className="text-xl text-gray-300 mb-6">{text.step1Desc}</p>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                                    <span>{text.step1P1}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                                    <span>{text.step1P2}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                                    <span>{text.step1P3}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.2)] border border-blue-500/20">
                            <img src="/tutorial/step1.png" alt="Tutorial Step 1" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>

                <ArrowDivider />

                {/* STEP 2 */}
                <div className="bg-gradient-to-br from-gray-900 to-purple-900/10 border border-gray-800 rounded-3xl p-8 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ImageIcon size={120} className="text-purple-500 -rotate-6" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row-reverse gap-8 items-center">
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                    <span className="font-bold text-2xl text-purple-400">2</span>
                                </div>
                                <h2 className="text-3xl font-bold">{text.step2}</h2>
                            </div>
                            <p className="text-xl text-gray-300 mb-8">{text.step2Desc}</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Option A */}
                                <div className="bg-black/50 border border-purple-500/20 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Sparkles className="text-purple-400" size={24} />
                                        <h3 className="font-bold text-lg">{text.step2Opt1Title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">{text.step2Opt1Desc}</p>
                                </div>
                                {/* Option B */}
                                <div className="bg-black/50 border border-pink-500/20 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-500/5 pointer-events-none" />
                                    <div className="flex items-center gap-3 mb-3 relative z-10">
                                        <Upload className="text-pink-400" size={24} />
                                        <h3 className="font-bold text-lg">{text.step2Opt2Title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed relative z-10">{text.step2Opt2Desc}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.2)] border border-purple-500/20">
                            <img src="/tutorial/step2.png" alt="Tutorial Step 2" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>

                <ArrowDivider />

                {/* STEP 3 */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden group hover:border-pink-500/50 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <PlayCircle size={120} className="text-pink-500 rotate-12" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                                    <span className="font-bold text-2xl text-pink-400">3</span>
                                </div>
                                <h2 className="text-3xl font-bold">{text.step3}</h2>
                            </div>
                            <p className="text-xl text-gray-300 mb-6">{text.step3Desc}</p>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] shrink-0" />
                                    <span>{text.step3P1}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] shrink-0" />
                                    <span>{text.step3P2}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] shrink-0" />
                                    <span>{text.step3P3}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.2)] border border-pink-500/20">
                            <img src="/tutorial/step3.png" alt="Tutorial Step 3" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>

                <ArrowDivider />

                {/* STEP 4 */}
                <div className="bg-gradient-to-br from-green-900/20 to-gray-900 border border-green-900/50 rounded-3xl p-8 relative overflow-hidden group hover:border-green-500/50 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Download size={120} className="text-green-500 -rotate-12" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row-reverse gap-8 items-center">
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                    <span className="font-bold text-2xl text-green-400">4</span>
                                </div>
                                <h2 className="text-3xl font-bold">{text.step4}</h2>
                            </div>
                            <p className="text-xl text-gray-300 mb-6">{text.step4Desc}</p>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0" />
                                    <span>{text.step4P1}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0" />
                                    <span>{text.step4P2}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] shrink-0" />
                                    <span>{text.step4P3}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.2)] border border-green-500/20">
                            <img src="/tutorial/step4.png" alt="Tutorial Step 4" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <h2 className="text-2xl font-bold mb-6">{text.ctaTitle}</h2>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300"
                    >
                        <Sparkles size={20} />
                        {text.ctaButton}
                    </Link>
                </div>

            </div>
        </div>
    );
}
