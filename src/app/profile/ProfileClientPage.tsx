"use client";

import { updateProfile, uploadAvatar } from './actions'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ProfileClientProps {
    user: any;
    profile: any;
}

export default function ProfileClientPage({ user, profile }: ProfileClientProps) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
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
            title: "Profile Settings",
            back: "Back to Dashboard",
            publicProfile: "Public Profile",
            profilePicture: "Profile Picture",
            uploading: "Uploading...",
            uploadNew: "Upload New Picture",
            email: "Email",
            fullName: "Full Name",
            placeholderName: "e.g. John Doe",
            saving: "Saving...",
            saveChanges: "Save Changes",
            accountStatus: "Account Status",
            planTier: "Plan Tier",
            creditsRemaining: "Credits Remaining",
            betaTester: "Beta Tester"
        },
        pt: {
            title: "Configurações de Perfil",
            back: "Voltar ao Início",
            publicProfile: "Perfil Público",
            profilePicture: "Foto de Perfil",
            uploading: "Enviando...",
            uploadNew: "Enviar Nova Foto",
            email: "Email",
            fullName: "Nome Completo",
            placeholderName: "ex: João Silva",
            saving: "Salvando...",
            saveChanges: "Salvar Alterações",
            accountStatus: "Status da Conta",
            planTier: "Plano",
            creditsRemaining: "Créditos Restantes",
            betaTester: "Testador Beta"
        }
    };

    const text = t[language];

    // Handle Avatar Upload
    async function handleAvatarUpload(formData: FormData) {
        setLoading(true)
        setMessage(null)

        const result = await uploadAvatar(formData)

        if (result?.error) {
            setMessage({ type: 'error', text: result.error })
        } else if (result?.success) {
            setMessage({ type: 'success', text: result.success })
        }
        setLoading(false)
    }

    // Handle Profile Update
    async function handleProfileUpdate(formData: FormData) {
        setLoading(true)
        setMessage(null)

        const result = await updateProfile(formData)

        if (result?.error) {
            setMessage({ type: 'error', text: result.error })
        } else if (result?.success) {
            setMessage({ type: 'success', text: result.success })
        }
        setLoading(false)
    }

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    {text.title}
                </h1>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    &larr; {text.back}
                </Link>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-8">
                {message && (
                    <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-900/50 text-green-200 border border-green-800' : 'bg-red-900/50 text-red-200 border border-red-800'}`}>
                        {message.text}
                    </div>
                )}

                {/* Public Info Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">{text.publicProfile}</h2>

                    {/* Avatar Upload */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden relative group">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl text-gray-500">
                                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <form action={handleAvatarUpload} className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-gray-400">{text.profilePicture}</label>
                            <input
                                name="avatar"
                                type="file"
                                accept="image/*"
                                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                            />
                            <button type="submit" disabled={loading} className="mt-2 text-xs text-blue-400 hover:text-blue-300 self-start disabled:opacity-50">
                                {loading ? text.uploading : text.uploadNew}
                            </button>
                        </form>
                    </div>

                    {/* Name Update Form */}
                    <form action={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">{text.email}</label>
                            <input
                                type="text"
                                value={user.email}
                                disabled
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-1">{text.fullName}</label>
                            <input
                                name="fullName"
                                type="text"
                                defaultValue={profile?.full_name || ''}
                                placeholder={text.placeholderName}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? text.saving : text.saveChanges}
                        </button>
                    </form>
                </div>

                <div className="border-t border-gray-800 pt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">{text.accountStatus}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                            <div className="text-sm text-gray-400">{text.planTier}</div>
                            <div className="text-lg font-medium text-purple-400 capitalize">{profile?.plan_tier?.replace('_', ' ') || text.betaTester}</div>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                            <div className="text-sm text-gray-400">{text.creditsRemaining}</div>
                            <div className="text-lg font-medium text-yellow-400">{profile?.credits || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
