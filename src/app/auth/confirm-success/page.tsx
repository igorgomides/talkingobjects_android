
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { CheckCircle2, ArrowRight, LogIn } from 'lucide-react'

export default function ConfirmSuccessPage() {
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
            title: "Email Verified!",
            subtitle: "Congratulations! Your email has been successfully confirmed. You can now access all features of Talking Objects.",
            actionTitle: "Ready to start?",
            loginButton: "Sign in to your account",
            footer: "Welcome abroad! We're excited to see what you'll create."
        },
        pt: {
            title: "E-mail Verificado!",
            subtitle: "Parabéns! Seu e-mail foi confirmado com sucesso. Agora você já pode acessar todos os recursos do Talking Objects.",
            actionTitle: "Pronto para começar?",
            loginButton: "Entrar na sua conta",
            footer: "Bem-vindo a bordo! Estamos ansiosos para ver o que você vai criar."
        }
    };

    const text = t[language];

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md space-y-8 bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm text-center">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50 animate-bounce">
                        <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        {text.title}
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        {text.subtitle}
                    </p>
                </div>

                <div className="pt-8 border-t border-gray-800 space-y-6">
                    <p className="text-sm font-medium text-gray-300 uppercase tracking-widest">
                        {text.actionTitle}
                    </p>

                    <Link
                        href="/login"
                        className="group relative flex w-full justify-center rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <span className="flex items-center gap-2">
                            <LogIn size={20} />
                            {text.loginButton}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </div>

                <p className="text-xs text-gray-500 italic">
                    {text.footer}
                </p>
            </div>
        </div>
    )
}
