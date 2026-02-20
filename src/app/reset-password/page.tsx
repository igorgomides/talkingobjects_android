
'use client'

import { updatePassword } from '../login/actions'
import { useState, useEffect } from 'react'

export default function ResetPasswordPage() {
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
            title: "New Password",
            subtitle: "Enter your new password below.",
            placeholderNew: "New Password",
            placeholderConfirm: "Confirm New Password",
            updateButton: "Update Password"
        },
        pt: {
            title: "Nova Senha",
            subtitle: "Digite sua nova senha abaixo.",
            placeholderNew: "Nova Senha",
            placeholderConfirm: "Confirmar Nova Senha",
            updateButton: "Atualizar Senha"
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
                            <label htmlFor="password" className="sr-only">{text.placeholderNew}</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="relative block w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder={text.placeholderNew}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">{text.placeholderConfirm}</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                className="relative block w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder={text.placeholderConfirm}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            formAction={updatePassword}
                            className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            {text.updateButton}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
