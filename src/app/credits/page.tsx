"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Check, Loader2, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createCheckoutSession } from "../actions/create-checkout-session";

export default function CreditsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState<'en' | 'pt'>('pt'); // Default to PT to match previous behavior if check fails
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const t = {
        pt: {
            title: "Loja de Créditos",
            subtitle: "Invista em sua criatividade. Gere mais vídeos sem limites.",
            currentBalance: "Saldo Atual",
            success: "✅ Pagamento concluído com sucesso! Seus créditos serão adicionados em breve.",
            canceled: "⚠️ Pagamento cancelado. Nenhuma cobrança foi feita.",
            footer: "Pagamentos seguros processados pelo Stripe. Ao comprar, você concorda com nossos termos de uso.",
            buy: "Comprar",
            unique: "único",
            plans: {
                starter: {
                    title: "Starter",
                    description: "Ideal para testar. Garante a criação de 1 vídeo completo.",
                    features: [
                        "35 Créditos",
                        "~1 Vídeo Rápido (15cr) + Imagens",
                        "Inclui Geração de Imagens (1cr)",
                        "Sem anúncios"
                    ]
                },
                creator: {
                    title: "Creator",
                    description: "O melhor custo-benefício. Crie conteúdo de alta qualidade.",
                    features: [
                        "130 Créditos",
                        "~3 Vídeos Pro (40cr/cada)",
                        "Ou ~8 Vídeos Rápidos",
                        "Acesso a Novos Modelos"
                    ],
                    popular: "Mais Popular"
                },
                agency: {
                    title: "Agência",
                    description: "Volume industrial para agências e power users.",
                    features: [
                        "450 Créditos",
                        "~11 Vídeos Pro",
                        "Ou ~30 Vídeos Rápidos",
                        "Suporte Prioritário",
                        "Uso Comercial Liberado"
                    ]
                }
            }
        },
        en: {
            title: "Credit Store",
            subtitle: "Invest in your creativity. Generate more videos without limits.",
            currentBalance: "Current Balance",
            success: "✅ Payment successful! Your credits will be added shortly.",
            canceled: "⚠️ Payment canceled. No charge was made.",
            footer: "Secure payments processed by Stripe. By purchasing, you agree to our terms of use.",
            buy: "Buy",
            unique: "one-time",
            plans: {
                starter: {
                    title: "Starter",
                    description: "Ideal for testing. guarantees creation of 1 full video.",
                    features: [
                        "35 Credits",
                        "~1 Fast Video (15cr) + Images",
                        "Includes Image Generation (1cr)",
                        "No ads"
                    ]
                },
                creator: {
                    title: "Creator",
                    description: "Best value. Create high-quality content.",
                    features: [
                        "130 Credits",
                        "~3 Pro Videos (40cr/each)",
                        "Or ~8 Fast Videos",
                        "Access to New Models"
                    ],
                    popular: "Most Popular"
                },
                agency: {
                    title: "Agency",
                    description: "Industrial volume for agencies and power users.",
                    features: [
                        "450 Credits",
                        "~11 Pro Videos",
                        "Or ~30 Fast Videos",
                        "Priority Support",
                        "Commercial Use Allowed"
                    ]
                }
            }
        }
    };

    const text = t[language];
    const currency = language === 'en' ? 'usd' : 'brl';

    // Prices
    const prices = {
        starter: { brl: 2900, usd: 500, labelBrl: "R$ 29,00", labelUsd: "$ 5.00" },
        creator: { brl: 9900, usd: 1900, labelBrl: "R$ 99,00", labelUsd: "$ 19.00" },
        agency: { brl: 29900, usd: 5900, labelBrl: "R$ 299,00", labelUsd: "$ 59.00" }
    };

    useEffect(() => {
        // Load language preference
        const savedLang = localStorage.getItem('language') as 'en' | 'pt';
        if (savedLang) setLanguage(savedLang);

        // Listen for language changes
        const handleLangChange = () => {
            const updated = localStorage.getItem('language') as 'en' | 'pt';
            if (updated) setLanguage(updated);
        };
        window.addEventListener('language-change', handleLangChange);

        // Auth State Listener for immediate feedback
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                // Unlock loading immediately
                setLoading(false);

                // Fetch profile
                if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("credits")
                        .eq("id", session.user.id)
                        .single();
                    setCredits(profile?.credits ?? 0);
                }
            } else {
                // Determine if we should redirect or just show loading state
                // For safety, if no session after check, redirect to login
                if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
                    router.push("/login");
                }
                setLoading(false);
            }
        });

        // Optimization: Check local session immediately to avoid flicker
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // No local session, let auth state listener handle or redirect
            }
        });

        return () => {
            window.removeEventListener('language-change', handleLangChange);
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    const handleBuy = async (priceInCents: number, creditsAmount: number) => {
        try {
            const url = await createCheckoutSession(priceInCents, creditsAmount, currency);
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert(language === 'en' ? "Error initiating Stripe payment." : "Erro ao iniciar pagamento via Stripe.");
        }
    };

    const isSuccess = searchParams.get("success");
    const isCanceled = searchParams.get("canceled");

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <Loader2 className="animate-spin text-purple-500" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4">
            <div className="max-w-4xl w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {text.title}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {text.subtitle}
                    </p>

                    <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded-full">
                        <span className="text-yellow-400 text-xl">🪙</span>
                        <span className="font-bold text-white text-lg">
                            {text.currentBalance}: {credits ?? "..."}
                        </span>
                    </div>
                </div>

                {/* Notifications */}
                {isSuccess && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg text-center animate-in fade-in slide-in-from-top-4">
                        {text.success}
                    </div>
                )}
                {isCanceled && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-center animate-in fade-in slide-in-from-top-4">
                        {text.canceled}
                    </div>
                )}

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    {/* Starter Plan */}
                    <PricingCard
                        title={text.plans.starter.title}
                        price={language === 'en' ? prices.starter.labelUsd : prices.starter.labelBrl}
                        credits={35}
                        description={text.plans.starter.description}
                        features={text.plans.starter.features}
                        buttonText={text.buy}
                        uniqueText={text.unique}
                        onClick={() => handleBuy(language === 'en' ? prices.starter.usd : prices.starter.brl, 35)}
                    />

                    {/* Creator Plan (Best Value) */}
                    <PricingCard
                        title={text.plans.creator.title}
                        price={language === 'en' ? prices.creator.labelUsd : prices.creator.labelBrl}
                        credits={130}
                        popular
                        popularText={text.plans.creator.popular}
                        description={text.plans.creator.description}
                        features={text.plans.creator.features}
                        buttonText={text.buy}
                        uniqueText={text.unique}
                        onClick={() => handleBuy(language === 'en' ? prices.creator.usd : prices.creator.brl, 130)}
                    />

                    {/* Agency Plan */}
                    <PricingCard
                        title={text.plans.agency.title}
                        price={language === 'en' ? prices.agency.labelUsd : prices.agency.labelBrl}
                        credits={450}
                        description={text.plans.agency.description}
                        features={text.plans.agency.features}
                        buttonText={text.buy}
                        uniqueText={text.unique}
                        onClick={() => handleBuy(language === 'en' ? prices.agency.usd : prices.agency.brl, 450)}
                    />
                </div>

                <div className="text-center text-sm text-gray-500 mt-12">
                    {text.footer}
                </div>
            </div>
        </div>
    );
}

function PricingCard({
    title,
    price,
    credits,
    features,
    description,
    popular = false,
    popularText,
    buttonText,
    uniqueText,
    onClick,
}: {
    title: string;
    price: string;
    credits: number;
    features: string[];
    description: string;
    popular?: boolean;
    popularText?: string;
    buttonText: string;
    uniqueText: string;
    onClick: () => void;
}) {
    return (
        <div
            className={`relative flex flex-col p-6 rounded-2xl bg-gray-900 border ${popular ? "border-purple-500 shadow-lg shadow-purple-500/20" : "border-gray-800"
                } transition-transform hover:scale-105 duration-300`}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {popularText}
                </div>
            )}

            <div className="mb-5">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-sm text-gray-400 mt-1">{description}</p>
            </div>

            <div className="mb-6">
                <span className="text-3xl font-bold text-white">{price}</span>
                <span className="text-gray-500 ml-2">/ {uniqueText}</span>
            </div>

            <div className="space-y-3 flex-1 mb-8">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                            <Check size={12} className="text-blue-400" />
                        </div>
                        {feature}
                    </div>
                ))}
            </div>

            <button
                onClick={onClick}
                className={`w-full py-3 rounded-xl font-bold transition-all ${popular
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                    } flex items-center justify-center gap-2`}
            >
                <Zap size={18} className={popular ? "fill-current" : ""} />
                {buttonText} {credits} {uniqueText === "one-time" ? "Credits" : "Créditos"}
            </button>
        </div>
    );
}
