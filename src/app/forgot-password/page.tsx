
'use client'

import { forgotPassword } from '../login/actions'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ForgotPasswordPage() {
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
            title: "Reset Password",
            subtitle: "Enter your email to receive a reset link.",
            emailPlaceholder: "Email address",
            sendLink: "Send Reset Link",
            backToLogin: "Back to Login"
        },
        pt: {
            title: "Redefinir Senha",
            subtitle: "Digite seu email para receber o link de redefinição.",
            emailPlaceholder: "Endereço de email",
            sendLink: "Enviar Link de Redefinição",
            backToLogin: "Voltar para o Login"
        }
    };

    const text = t[language];

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md space-y-8 bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">{text.title}</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        {text.subtitle}
                    </p>
                </div>

                <form className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="sr-only">{text.emailPlaceholder}</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="relative block w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                            placeholder={text.emailPlaceholder}
                        />
                    </div>

                    <div>
                        <button
                            formAction={forgotPassword}
                            className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            {text.sendLink}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400">
                        {text.backToLogin}
                    </Link>
                </div>
            </div>
        </div>
    )
}
