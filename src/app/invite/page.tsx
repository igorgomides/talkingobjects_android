'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Video, Image as ImageIcon, CheckCircle, ArrowRight, Zap, Target } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { captureLead } from './actions';
import Link from 'next/link';

export default function InvitePage() {
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get('success');
    const errorMessage = searchParams.get('error');
    const customMessage = searchParams.get('message');

    const [isLoading, setIsLoading] = useState(false);
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
            badge: "Exclusive Beta",
            title1: "Bring Your ",
            titleHighlight: "Objects",
            title2: " to Life. Create Viral Reels.",
            subtitle: "Turn any static image into a cinematic talking video in seconds. Join the VIP list today and get ",
            subtitleHighlight: "20 Free Credits",
            subtitleEnd: " to test.",
            nameLabel: "Your Name",
            namePlaceholder: "What should we call you?",
            emailLabel: "Best Email",
            emailPlaceholder: "name@email.com",
            buttonLoading: "Processing...",
            buttonSubmit: "Claim My 20 Credits",
            disclaimer: "Very limited spots. No credit card required.",
            successTitle: "Success!",
            successMessageDefault: "Your email was added to the Whitelist! You just unlocked your 20 initial credits.",
            createAccountBtn: "Create My Account Now",
            sponsored: "Sponsored",
            videoText: "\"Being bitten by a giant? That's absurd! The coxinha revolution begins now!\"",
            originalSound: "♫ Original sound created by AI",
            goldenTipBadge: "The Golden Tip",
            goldenTipTitle: "How to Use Your 20 Credits Smartly",
            goldenTipDesc: "Ultra-realistic video animation uses massive computational power (15 cr). To avoid losing credits right away, we recommend this creator funnel \"hack\":",
            step1Title: "Visual Test First (4 Credits)",
            step1Desc: "Generate up to 4 different AI images (Imagen 4.0). Each generation costs only 1 credit. Play with prompts (\"Angry\", \"Tired\", \"Happy\") until you find the perfect image.",
            step2Title: "Generate the Final Video (15 Credits)",
            step2Desc: "Once you have the winning image and a good AI-generated script, select the image and hit Animate (Fast Mode). ",
            step2Highlight: "You'll have 1 credit left over!",
            featuresTitle: "Studio Features in Your Pocket",
            featuresDesc: "Advanced technology wrapped in a simple app.",
            feature1Title: "Viral AI Scripts",
            feature1Desc: "Just tell us the object and the reason. Our AI trained on thousands of Reels to write the perfect hook that retains attention.",
            feature2Title: "Flawless Images",
            feature2Desc: "Using the Google Imagen 4.0 engine, create ultra-complex visuals with integrated scenarios, or simply upload your own photo.",
            feature3Title: "Cinematic Animation",
            feature3Desc: "The Veo 3.1 model injects life, breathing, and movements into the static image, generating 6 uninterrupted seconds of hyper-realistic video."
        },
        pt: {
            badge: "Beta Exclusivo",
            title1: "Dê Vida aos Seus ",
            titleHighlight: "Objetos.",
            title2: " Crie Reels Virais.",
            subtitle: "Transforme qualquer imagem estática em um vídeo cinemático falante em segundos. Cadastre-se na lista VIP hoje e ganhe ",
            subtitleHighlight: "20 Créditos Grátis",
            subtitleEnd: " para testar.",
            nameLabel: "Seu Nome",
            namePlaceholder: "Como devemos te chamar?",
            emailLabel: "Melhor Email",
            emailPlaceholder: "nome@email.com",
            buttonLoading: "Processando...",
            buttonSubmit: "Garantir Meus 20 Créditos",
            disclaimer: "Vagas super limitadas. Sem cartão de crédito exigido.",
            successTitle: "Sucesso!",
            successMessageDefault: "Seu email foi adicionado à Whitelist! Você acaba de desbloquear seus 20 créditos iniciais.",
            createAccountBtn: "Criar Minha Conta Agora",
            sponsored: "Patrocinado",
            videoText: "\"Ser mordido por um gigante? Isso é um absurdo! A revolução das coxinhas vai começar!\"",
            originalSound: "♫ Som original criado por IA",
            goldenTipBadge: "A Dica de Ouro",
            goldenTipTitle: "Como Usar Seus 20 Créditos com Inteligência",
            goldenTipDesc: "A animação de vídeo ultra-realista gasta um poder computacional gigantesco (15 cr). Para não perder créditos logo de cara, nós recomendamos esse \"hack\" de funil para criadores:",
            step1Title: "Teste Visual Primeiro (4 Créditos)",
            step1Desc: "Gere até 4 imagens diferentes da IA (Imagen 4.0). Cada geração custa apenas 1 crédito. Brinque com os prompts (\"Com Raiva\", \"Cansado\", \"Feliz\") até achar a imagem perfeita.",
            step2Title: "Gere o Vídeo Final (15 Créditos)",
            step2Desc: "Quando tiver a imagem campeã e um roteiro bom gerado pela IA, escolha a imagem e mande Animar (Fast Mode). ",
            step2Highlight: "Restará 1 crédito de sobra!",
            featuresTitle: "Recursos de Estúdio no Seu Bolso",
            featuresDesc: "Tecnologia avançada envelopada em um app simples.",
            feature1Title: "Roteiros Virais por IA",
            feature1Desc: "Apenas nos diga o objeto e o motivo. Nossa IA treinou com milhares de Reels para escrever o gancho perfeito que retém a atenção.",
            feature2Title: "Imagens Impecáveis",
            feature2Desc: "Usando o motor Google Imagen 4.0, crie visuais ultra-complexos com cenários integrados, ou simplesmente faça upload da sua própria foto.",
            feature3Title: "Animação Cinemática",
            feature3Desc: "O modelo Veo 3.1 injeta vida, respiração e movimentos na imagem estática, gerando 6 segundos ininterruptos de vídeo hiper-realista."
        }
    };

    const text = t[language];

    // Se houver customMessage nas ações (actions.ts), ele pode estar em PT.
    // O ideal seria que actions retornasse códigos, mas como retorna string literal, vamos exibir.
    // (Poderíamos tentar traduzir as mensagens de erro do actions se necessário, mas para MVP mantemos como vem ou usamos o padrão i18n).
    const displaySuccessMessage = customMessage || text.successMessageDefault;

    return (
        <div className="min-h-screen bg-black text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30">
            {/* HER0 SECTION */}
            <div className="relative overflow-hidden border-b border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black z-0 pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 py-20 relative z-10 flex flex-col md:flex-row items-center gap-12">

                    {/* Left: Copy & Form */}
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium text-sm">
                            <Sparkles size={16} /> {text.badge}
                        </div>

                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                            {text.title1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{text.titleHighlight}</span><br />{text.title2}
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-lg">
                            {text.subtitle}
                            <strong className="text-yellow-400">{text.subtitleHighlight}</strong>
                            {text.subtitleEnd}
                        </p>

                        {!isSuccess ? (
                            <form action={captureLead} onSubmit={() => setIsLoading(true)} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm max-w-md shadow-2xl space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">{text.nameLabel}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                        placeholder={text.namePlaceholder}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">{text.emailLabel}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                        placeholder={text.emailPlaceholder}
                                    />
                                </div>

                                {errorMessage && (
                                    <div className="text-red-400 text-sm">{errorMessage}</div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? text.buttonLoading : text.buttonSubmit} <ArrowRight size={18} />
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2">{text.disclaimer}</p>
                            </form>
                        ) : (
                            <div className="bg-green-900/20 border border-green-500/30 p-8 rounded-2xl max-w-md text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">{text.successTitle}</h3>
                                <p className="text-green-300">
                                    {displaySuccessMessage}
                                </p>
                                <Link href="/signup" className="mt-4 inline-block w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all">
                                    {text.createAccountBtn}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right: Social Proof / Visuals */}
                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent blur-3xl rounded-full" />

                        <div className="relative bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl aspect-[9/16] max-w-sm mx-auto transform rotate-2 hover:rotate-0 transition-all duration-500">
                            {/* Top Bar (Fake UI) */}
                            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-10">
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-purple-500" />
                                    <div>
                                        <div className="text-xs font-bold">@SalgadinhoRevoltado</div>
                                        <div className="text-[10px] text-gray-300">{text.sponsored}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Video Player */}
                            <video
                                src="/invite-demo-video.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Bottom Bar (Fake UI) */}
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
                                <div className="text-sm font-medium mb-1 line-clamp-2">
                                    {text.videoText}
                                </div>
                                <div className="text-xs text-gray-400">{text.originalSound}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* GOLDEN TIP SECTION */}
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap size={120} className="text-yellow-500 rotate-12" />
                    </div>

                    <div className="relative z-10 space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-wider text-sm mb-2">
                            <Target size={18} /> {text.goldenTipBadge}
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white">{text.goldenTipTitle}</h2>

                        <p className="text-gray-300 text-lg leading-relaxed">
                            {text.goldenTipDesc}
                        </p>

                        <div className="bg-black/50 border border-black/50 rounded-xl p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="font-bold text-blue-400">1</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{text.step1Title}</h4>
                                    <p className="text-gray-400 text-sm">{text.step1Desc}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="font-bold text-purple-400">2</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{text.step2Title}</h4>
                                    <p className="text-gray-400 text-sm">{text.step2Desc}<strong>{text.step2Highlight}</strong></p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* FEATURES GRID */}
            <div className="max-w-5xl mx-auto px-4 py-12 pb-32">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{text.featuresTitle}</h2>
                    <p className="text-gray-400">{text.featuresDesc}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:bg-gray-800 transition-colors">
                        <Sparkles className="text-purple-400 mb-4" size={32} />
                        <h3 className="font-bold text-xl mb-2">{text.feature1Title}</h3>
                        <p className="text-gray-400 text-sm">{text.feature1Desc}</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:bg-gray-800 transition-colors">
                        <ImageIcon className="text-blue-400 mb-4" size={32} />
                        <h3 className="font-bold text-xl mb-2">{text.feature2Title}</h3>
                        <p className="text-gray-400 text-sm">{text.feature2Desc}</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:bg-gray-800 transition-colors">
                        <Video className="text-pink-400 mb-4" size={32} />
                        <h3 className="font-bold text-xl mb-2">{text.feature3Title}</h3>
                        <p className="text-gray-400 text-sm">{text.feature3Desc}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
