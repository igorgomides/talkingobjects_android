"use client";

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { LogOut, User as UserIcon, Loader2 } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { User } from '@supabase/supabase-js'
import { StatusBar, Style } from '@capacitor/status-bar';

interface HeaderProps {
    user: User | null;
}

export default function Header({ user: initialUser }: HeaderProps) {
    const [supabase] = useState(() => createClient())
    const [user, setUser] = useState<User | null>(initialUser)
    const [credits, setCredits] = useState<number | null>(null)

    const [role, setRole] = useState<string | null>(null)
    const [fullName, setFullName] = useState<string | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(!initialUser)

    // Language State
    const [language, setLanguage] = useState<'en' | 'pt'>('en')

    useEffect(() => {
        const saved = localStorage.getItem('language') as 'en' | 'pt';
        if (saved) setLanguage(saved);

        // Listen for external language changes (e.g. from page.tsx initial load or other tabs)
        const handleLangChange = () => {
            const updated = localStorage.getItem('language') as 'en' | 'pt';
            if (updated) setLanguage(updated);
        };
        window.addEventListener('language-change', handleLangChange);
        return () => window.removeEventListener('language-change', handleLangChange);
    }, [])

    const t = {
        en: {
            admin: "Admin",
            credits: "Credits",
            signIn: "Sign In",
            signOut: "Sign Out",
            user: "User"
        },
        pt: {
            admin: "Admin",
            credits: "Créditos",
            signIn: "Entrar",
            signOut: "Sair",
            user: "Usuário"
        }
    };

    const text = t[language];

    const switchLanguage = (newLang: 'en' | 'pt') => {
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        window.dispatchEvent(new Event('language-change'));
    };

    const fetchProfile = useCallback(async (userId: string) => {
        try {

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('credits, role, full_name, avatar_url')
                .eq('id', userId)
                .single()

            if (error) {
                console.error("Error fetching profile:", error);

                setCredits(prev => prev === null ? 0 : prev);
                return;
            }


            setCredits(profile?.credits ?? 0)
            setRole(profile?.role ?? 'user')
            setFullName(profile?.full_name ?? null)
            setAvatarUrl(profile?.avatar_url ?? null)
        } catch (err: any) {
            console.error("Exception fetching profile:", err);
            setCredits(0);
        }
    }, [supabase]);

    // ... (useEffect sync and Auth Listener remain same) ...


    // Sync state with prop if it changes (e.g. server re-render)
    useEffect(() => {
        if (initialUser && initialUser.id !== user?.id) {
            setUser(initialUser);
            setLoading(false);
            fetchProfile(initialUser.id);
        } else if (!initialUser && !user) {
            // If both are null, we are done loading
            setLoading(false);
        }
    }, [initialUser, user?.id, fetchProfile]);

    useEffect(() => {
        // Auth State Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth State Change:", event);

            if (session?.user) {
                // If user changed or we didn't have one, update
                if (session.user.id !== user?.id) {
                    setUser(session.user);
                    setLoading(false);
                    fetchProfile(session.user.id);
                }
            } else {
                // Only clear if we really logged out or session is gone
                if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
                    setUser(null);
                    setCredits(null);
                    setRole(null);
                    setFullName(null);
                    setAvatarUrl(null);
                    setLoading(false);
                }
            }
        });

        // Ensure credits are fetched whenever we have a user (initial load)
        if (user && credits === null) {
            fetchProfile(user.id);

            // Log Activity (Last Seen)
            supabase.from('profiles')
                .update({ last_seen_at: new Date().toISOString() })
                .eq('id', user.id)
                .then(({ error }) => {
                    if (error) console.error("Error updating last_seen:", error);
                });
        } else if (!user && loading) {
            // Safety check: if we have no user but are loading, checking existing session
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (!session) setLoading(false);
            });
        }


        // Custom Event Listener
        const handleCreditUpdate = () => {
            if (user) fetchProfile(user.id);
        };
        window.addEventListener('credits-updated', handleCreditUpdate);

        // Real-time Subscription
        let channel: any;
        if (user) {
            channel = supabase
                .channel('header-credits')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${user.id}`
                    },
                    (payload) => {
                        // Refresh whole profile to get name/avatar updates too if they happen
                        fetchProfile(user.id);
                    }
                )
                .subscribe()
        }

        return () => {
            window.removeEventListener('credits-updated', handleCreditUpdate);
            if (channel) supabase.removeChannel(channel)
            subscription.unsubscribe()
        }
    }, [supabase, user?.id, fetchProfile, credits]) // Re-subscribe if user changes

    const getInitials = () => {
        if (fullName) {
            const names = fullName.split(' ')
            if (names.length >= 2) {
                return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
            }
            return fullName.slice(0, 2).toUpperCase()
        }
        return user?.email?.slice(0, 2).toUpperCase() ?? 'U'
    }

    const handleSignOut = async () => {
        try {
            // First, sign out from client
            await supabase.auth.signOut();
            // Then, call our server-side signout to clear cookies definitely
            await fetch('/auth/signout', { method: 'POST' });
        } catch (e) {
            console.error("Sign out error:", e);
        } finally {
            window.location.href = '/login';
        }
    }

    useEffect(() => {
        // Force Status Bar to Transparent + Light Text (Style.Dark)
        const configureStatusBar = async () => {
            try {
                // Overlay true = content goes under status bar
                await StatusBar.setOverlaysWebView({ overlay: true });
                // Style.Dark = We have a Dark background, so give us Light Text
                await StatusBar.setStyle({ style: Style.Dark });
            } catch (e) {
                console.warn('Status Bar error:', e);
            }
        };
        configureStatusBar();

        // ... existing language listener ...
    }, [])

    // ...

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ... existing hooks ...


    // ... existing hooks ...
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // ... existing useEffect logic ...
    }, []);

    // ... existing logic ...

    return (
        <>
            <header className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50 pt-[max(env(safe-area-inset-top),24px)]">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo / Home Link */}
                    <Link href="/" className="font-bold text-xl tracking-tighter text-white flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-lg">🤖</span>
                        </div>
                        <span className="text-lg">Talking Objects</span>
                    </Link>

                    {/* Right Side: Hamburger or Login */}
                    <div className="flex items-center gap-4">
                        {loading ? (
                            <Loader2 className="animate-spin text-gray-500" size={20} />
                        ) : user ? (
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
                            >
                                {text.signIn}
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay - Move to Portal */}
            {isMenuOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMenuOpen(false)}>
                    <div
                        className="absolute right-0 top-0 h-full w-[280px] bg-black border-l border-gray-800 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 transform z-[101]"
                        style={{ backgroundColor: '#0f172a', isolation: 'isolate' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Menu Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-bold text-white">Menu</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-purple-500/30 overflow-hidden">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                                        {getInitials()}
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-white font-bold text-lg">{fullName || user?.email?.split('@')[0]}</p>
                                <p className="text-gray-400 text-sm capitalize">{role?.replace('_', ' ') || text.user}</p>
                            </div>
                        </div>

                        {/* Credits */}
                        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
                            <p className="text-gray-400 text-xs uppercase font-bold mb-1">{text.credits}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🪙</span>
                                    <span className="text-xl font-bold text-white">{credits ?? '...'}</span>
                                </div>
                                <Link
                                    href="/credits"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-500 transition-colors"
                                >
                                    +
                                </Link>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 space-y-2">
                            <Link
                                href="/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                            >
                                <UserIcon size={20} />
                                <span>{text.user}</span>
                            </Link>

                            <Link
                                href="/tutorial"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                            >
                                <span className="font-bold">📘</span>
                                <span>Tutorial</span>
                            </Link>

                            {role === 'admin' && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-900/20 text-red-300 hover:text-red-200 transition-colors"
                                >
                                    <span className="font-bold">🛡️</span>
                                    <span>{text.admin}</span>
                                </Link>
                            )}
                        </div>

                        {/* Footer: Language & Sign Out */}
                        <div className="pt-6 border-t border-gray-800 space-y-4">
                            {/* Language Toggle */}
                            <div className="flex bg-gray-800 rounded-lg p-1">
                                <button
                                    onClick={() => switchLanguage('en')}
                                    className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${language === 'en' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    🇺🇸 English
                                </button>
                                <button
                                    onClick={() => switchLanguage('pt')}
                                    className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${language === 'pt' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    🇧🇷 Português
                                </button>
                            </div>

                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 w-full p-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors justify-center"
                            >
                                <LogOut size={20} />
                                <span>{text.signOut}</span>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
