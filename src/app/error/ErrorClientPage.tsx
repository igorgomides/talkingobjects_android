'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ErrorClientProps {
    message?: string;
    type?: string;
}

export default function ErrorClientPage({ message, type }: ErrorClientProps) {
    const isSuccess = type === 'success';
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
            success: "Success!",
            oops: "Oops!",
            rateLimit: "You are trying too fast. Please wait 60 seconds.",
            defaultError: "Something went wrong. It might be that:",
            reasons: [
                "Your email is not on the Beta Whitelist.",
                "You entered the wrong password.",
                "The server is acting up."
            ],
            goToLogin: "Go to Login",
            tryAgain: "Try Again"
        },
        pt: {
            success: "Sucesso!",
            oops: "Ops!",
            rateLimit: "Você está tentando muito rápido. Aguarde 60 segundos.",
            defaultError: "Algo deu errado. Pode ser que:",
            reasons: [
                "Seu email não está na Lista de Espera Beta.",
                "Você digitou a senha errada.",
                "O servidor está com problemas."
            ],
            goToLogin: "Ir para Login",
            tryAgain: "Tentar Novamente"
        }
    };

    const text = t[language];

    return (
        <div className='flex items-center justify-center min-h-screen bg-black text-white'>
            <div className={`p-8 rounded-xl border text-center max-w-md ${isSuccess ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
                <h1 className={`text-3xl font-bold mb-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                    {isSuccess ? text.success : text.oops}
                </h1>
                <p className='text-gray-300 mb-6'>
                    {
                        message?.toLowerCase().includes("rate limit")
                            ? text.rateLimit
                            : message || text.defaultError
                    }
                </p>
                {!message && (
                    <ul className='text-left list-disc pl-5 space-y-2 text-gray-400 text-sm mb-6'>
                        {text.reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                        ))}
                    </ul>
                )}
                <Link href="/login" className={`inline-block px-6 py-2 rounded-lg text-white font-medium transition-colors ${isSuccess ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
                    {isSuccess ? text.goToLogin : text.tryAgain}
                </Link>
            </div>
        </div>
    );
}
