
'use client'

import { login } from './actions'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function LoginPage() {
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
            title: "Access Beta v3.0",
            subtitle: "Sign in or request access to the whitelist.",
            emailPlaceholder: "Email address",
            passwordPlaceholder: "Password",
            signIn: "Sign in",
            createAccount: "Create account",
            forgotPassword: "Forgot password?",
            footer: "Invite-only Beta. Contact admin if you need access."
        },
        pt: {
            title: "Acesso Beta v3.0",
            subtitle: "Entre ou solicite acesso à lista de espera.",
            emailPlaceholder: "Endereço de email",
            passwordPlaceholder: "Senha",
            signIn: "Entrar",
            createAccount: "Criar conta",
            forgotPassword: "Esqueceu a senha?",
            footer: "Beta apenas para convidados. Contate o admin se precisar de acesso."
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
                    <div className="space-y-4 rounded-md shadow-sm">
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
                            <label htmlFor="password" className="sr-only">{text.passwordPlaceholder}</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder={text.passwordPlaceholder}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            formAction={login}
                            className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            {text.signIn}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <Link href="/signup" className="font-medium text-blue-500 hover:text-blue-400">
                            {text.createAccount}
                        </Link>
                        <Link href="/forgot-password" className="font-medium text-gray-400 hover:text-gray-300">
                            {text.forgotPassword}
                        </Link>
                    </div>
                </form>

                <p className="text-center text-xs text-gray-500">
                    {text.footer}
                </p>
            </div>
        </div>
    )
}
