'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Cpu, ImageIcon, Video, Palette, Stamp, Globe, Users, ChevronDown, ArrowRight } from 'lucide-react';

export default function AboutContent() {
    const [language, setLanguage] = useState<'en' | 'pt'>('en');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            badge: "About Us",
            heroTitle1: "AI Speaking Object",
            heroSubtitle: "is a Video Creation SaaS that helps content creators, marketing agencies, and local businesses generate viral talking-object videos and scroll-stopping ads powered by Google's most advanced AI.",

            whatWeDoTitle: "What We Do",
            services: [
                { icon: "cpu", label: "Viral Script Generation with AI", desc: "Google Gemini 2.0 Flash writes hooks that stop the scroll — in English or Portuguese." },
                { icon: "image", label: "Pixar-Style 3D Character Creation", desc: "Google Imagen 3.0 generates photorealistic, expressive 3D characters from any object you describe." },
                { icon: "video", label: "Synchronized Lip-Sync Animation", desc: "Google Veo 3.1 brings your characters to life with natural mouth movements and expressions." },
                { icon: "palette", label: "Dynamic Background Scenarios", desc: "Choose from Chroma Key, Neon Studio, Party Table, Supermarket Shelf, or create your own custom environment." },
                { icon: "stamp", label: "Automated Brand Logo Insertion", desc: "Upload your logo once and it's automatically composited onto every generated image." },
            ],

            forWhomTitle: "Who Is It For?",
            forWhomDesc: "Optimized for mobile-first platforms — TikTok, Instagram Reels, and YouTube Shorts — our tool turns any physical product into a viral character.",
            forWhomExample: "From local restaurants running campaigns for snack bars and bakeries, to digital marketing agencies producing high-volume ad creatives at scale.",
            forWhomCta: "See our scalable plans for creators and agencies",

            globalTitle: "Global Reach, Local Flavor",
            globalDesc: "Our platform has native bilingual support (Portuguese and English), serving both the Brazilian market and international audiences with our regionalized 'Viral Mode'.",

            faqTitle: "Frequently Asked Questions",
            faqs: [
                { q: "What is AI Speaking Object?", a: "AI Speaking Object is a SaaS platform that uses Google's AI stack (Gemini, Imagen 3, and Veo 3.1) to generate viral talking-object videos for Instagram Reels, TikTok, and YouTube Shorts. You describe an object, our AI writes the script, generates a 3D character, and animates it — all in minutes." },
                { q: "Which AIs does the application use?", a: "The platform uses three core Google AI models: Gemini 2.0 Flash for script writing, Imagen 3.0 for photorealistic 3D character generation, and Veo 3.1 for lip-synced video animation." },
                { q: "How much does it cost to generate an animated video?", a: "Video generation costs depend on quality and duration. Fast Mode costs 15 credits (6s) or 25 credits (8s). High Quality mode costs 40 credits (6s) or 60 credits (8s)." },
            ],
            faqCreditsLink: "View all credit packages →",

            ctaTitle: "Ready to Create Your First Viral Video?",
            ctaButton: "Start Creating Now",

            starterPlan: "Starter (35cr) — R$29",
            creatorPlan: "Creator (130cr) — R$99",
            agencyPlan: "Agency (450cr) — R$299",
        },
        pt: {
            badge: "Sobre Nós",
            heroTitle1: "AI Speaking Object",
            heroSubtitle: "é um Software SaaS de Criação de Vídeos que ajuda criadores de conteúdo, agências de marketing e negócios locais a gerar vídeos virais e anúncios que retêm a atenção (scroll-stoppers) usando objetos 3D falantes potencializados pela IA mais avançada do Google.",

            whatWeDoTitle: "O Que Nós Fazemos",
            services: [
                { icon: "cpu", label: "Geração de Roteiros Virais com IA", desc: "O Google Gemini 2.0 Flash escreve ganchos que param o scroll — em Inglês ou Português." },
                { icon: "image", label: "Criação de Personagens 3D Estilo Pixar", desc: "O Google Imagen 3.0 gera personagens 3D fotorrealistas e expressivos a partir de qualquer objeto que você descrever." },
                { icon: "video", label: "Animação Labial Sincronizada (Lip-Sync)", desc: "O Google Veo 3.1 dá vida aos seus personagens com movimentos labiais e expressões naturais." },
                { icon: "palette", label: "Renderização de Cenários Dinâmicos", desc: "Escolha entre Chroma Key, Estúdio Neon, Mesa de Festa, Prateleira de Supermercado ou crie seu próprio ambiente." },
                { icon: "stamp", label: "Inserção Automatizada de Logotipos", desc: "Faça o upload do seu logo uma vez e ele será automaticamente aplicado em toda imagem gerada." },
            ],

            forWhomTitle: "Para Quem É?",
            forWhomDesc: "Otimizado para plataformas mobile-first — TikTok, Instagram Reels e YouTube Shorts — nossa ferramenta transforma qualquer produto físico em um personagem viral.",
            forWhomExample: "Desde restaurantes locais (como campanhas para lanchonetes e venda de salgadinhos) até grandes agências de publicidade produzindo criativos de anúncios em escala.",
            forWhomCta: "Veja nossos planos escaláveis para criadores e agências",

            globalTitle: "Alcance Global, Sabor Local",
            globalDesc: "Nossa plataforma possui suporte nativo bilíngue (Português e Inglês), atendendo tanto o mercado do Brasil quanto o mercado internacional com o nosso 'Modo Viral' regionalizado.",

            faqTitle: "Perguntas Frequentes",
            faqs: [
                { q: "O que é o AI Speaking Object?", a: "O AI Speaking Object é uma plataforma SaaS que utiliza o stack de IA do Google (Gemini, Imagen 3 e Veo 3.1) para gerar vídeos virais de objetos falantes para Instagram Reels, TikTok e YouTube Shorts. Você descreve um objeto, nossa IA escreve o roteiro, gera um personagem 3D e o anima — tudo em minutos." },
                { q: "Quais IAs o aplicativo utiliza?", a: "A plataforma utiliza três modelos principais de IA do Google: Gemini 2.0 Flash para geração de roteiros, Imagen 3.0 para criação de personagens 3D fotorrealistas e Veo 3.1 para animação de vídeo com lip-sync." },
                { q: "Quanto custa gerar um vídeo animado?", a: "O custo da geração de vídeo depende da qualidade e duração. O Modo Rápido custa 15 créditos (6s) ou 25 créditos (8s). O modo Alta Qualidade custa 40 créditos (6s) ou 60 créditos (8s)." },
            ],
            faqCreditsLink: "Ver todos os pacotes de créditos →",

            ctaTitle: "Pronto para Criar Seu Primeiro Vídeo Viral?",
            ctaButton: "Comece a Criar Agora",

            starterPlan: "Starter (35cr) — R$29",
            creatorPlan: "Creator (130cr) — R$99",
            agencyPlan: "Agency (450cr) — R$299",
        }
    };

    const text = t[language];

    const iconMap: Record<string, React.ReactNode> = {
        cpu: <Cpu size={28} />,
        image: <ImageIcon size={28} />,
        video: <Video size={28} />,
        palette: <Palette size={28} />,
        stamp: <Stamp size={28} />,
    };

    const serviceColors = [
        { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]' },
        { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]' },
        { border: 'border-pink-500/30', bg: 'bg-pink-500/10', text: 'text-pink-400', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]' },
        { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
        { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' },
    ];

    return (
        <div className="min-h-screen text-white pb-32 selection:bg-purple-500/30">

            {/* ═══════════════════════════════════════════════ */}
            {/* ELEMENT 1: Hero — The Definition Formula        */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="relative pt-24 pb-20 px-4 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent z-0 pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-sm tracking-wide">
                        <Users size={16} /> {text.badge}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{text.heroTitle1}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        {text.heroSubtitle}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-16 space-y-20">

                {/* ═══════════════════════════════════════════════ */}
                {/* ELEMENT 2: What We Do (Service List)            */}
                {/* ═══════════════════════════════════════════════ */}
                <section>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
                        {text.whatWeDoTitle}
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {text.services.map((service, i) => {
                            const color = serviceColors[i % serviceColors.length];
                            return (
                                <div key={i} className={`glass-card rounded-2xl p-6 border ${color.border} ${color.glow} hover:scale-[1.02] transition-transform duration-300`}>
                                    <div className={`w-14 h-14 rounded-2xl ${color.bg} flex items-center justify-center mb-4 ${color.text}`}>
                                        {iconMap[service.icon]}
                                    </div>
                                    <h3 className="font-bold text-lg text-white mb-2">{service.label}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{service.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════ */}
                {/* ELEMENT 3: Authority & Use Cases                */}
                {/* ═══════════════════════════════════════════════ */}
                <section className="glass-card rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">{text.forWhomTitle}</h2>
                        <p className="text-lg text-gray-300 leading-relaxed mb-4">{text.forWhomDesc}</p>
                        <p className="text-gray-400 leading-relaxed mb-8">{text.forWhomExample}</p>

                        <Link href="/credits" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition-colors group">
                            {text.forWhomCta}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Pricing anchors */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[text.starterPlan, text.creatorPlan, text.agencyPlan].map((plan, i) => (
                                <Link href="/credits" key={i} className="glass-card rounded-xl p-4 text-center border border-white/10 hover:border-purple-400/50 hover:shadow-neon-purple transition-all text-sm font-bold text-gray-300 hover:text-white">
                                    {plan}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════ */}
                {/* ELEMENT 4: Geographic & Market Signals          */}
                {/* ═══════════════════════════════════════════════ */}
                <section className="flex flex-col md:flex-row items-center gap-8 glass-card rounded-3xl p-8 md:p-12 border border-white/5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/20 flex items-center justify-center shrink-0">
                        <Globe size={36} className="text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold mb-3">{text.globalTitle}</h2>
                        <p className="text-gray-400 leading-relaxed">{text.globalDesc}</p>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════ */}
                {/* BONUS: FAQ Accordion                            */}
                {/* ═══════════════════════════════════════════════ */}
                <section>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">{text.faqTitle}</h2>
                    <div className="space-y-3 max-w-3xl mx-auto">
                        {text.faqs.map((faq, i) => (
                            <div key={i} className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all duration-300">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer select-none font-bold text-white hover:bg-white/5 transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown size={20} className={`text-purple-400 transition-transform duration-300 shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-5 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                        <p>{faq.a}</p>
                                        {i === 2 && (
                                            <Link href="/credits" className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold mt-3 text-sm transition-colors">
                                                {text.faqCreditsLink}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════ */}
                {/* ELEMENT 5: CTA with Internal Links              */}
                {/* ═══════════════════════════════════════════════ */}
                <section className="text-center py-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">{text.ctaTitle}</h2>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 bubbly-button"
                    >
                        <Sparkles size={20} />
                        {text.ctaButton}
                    </Link>
                </section>

            </div>
        </div>
    );
}
