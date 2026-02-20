
"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, TrendingUp, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UsageLog {
    id: string;
    user_id: string; // Ensure this is present
    action_type: string;
    model_used: string;
    cost_tokens: number;
    cost_seconds: number;
    credits_deducted: number;
    latency_ms: number;
    status: string;
    error_message: string;
    created_at: string;
    provider_cost?: number;
    asset_url?: string;
    user_email?: string; // We'll join this manually
}

interface Transaction {
    id: string;
    credits_added: number;
    amount_paid: number;
    created_at: string;
    status: string;
    livemode: boolean; // Add livemode to interface
}

interface Stats {
    totalCreditsBurnt: number;
    totalErrors: number;
    avgLatency: number;
    totalGenerations: number;
    estimatedCost: number;
    totalRevenue: number; // LIVE ONLY
    testRevenue: number; // TEST ONLY (New)
    totalProfit: number;
    imageCount: number;
    videoCount: number;
    totalLiability: number;
}

export default function AdminPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<UsageLog[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalCreditsBurnt: 0,
        totalErrors: 0,
        avgLatency: 0,
        totalGenerations: 0,
        estimatedCost: 0,
        totalRevenue: 0,
        testRevenue: 0,
        totalProfit: 0,
        imageCount: 0,
        videoCount: 0,
        totalLiability: 0
    });
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today

    const [whitelistEmail, setWhitelistEmail] = useState('');
    const [whitelist, setWhitelist] = useState<{ email: string, created_at: string, profile?: any }[]>([]);
    const [editingCredits, setEditingCredits] = useState<string | null>(null);
    const [creditAmount, setCreditAmount] = useState<number>(0);
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
            title: "Admin Dashboard",
            range: "Range:",
            to: "to",
            contentCreated: "Content Created",
            total: "Total",
            imgs: "Imgs",
            vids: "Vids",
            liveFinancials: "Live Financials",
            realRevenue: "Real Revenue",
            providerCost: "Provider Cost",
            profitLiability: "Profit & Liability",
            netProfitLive: "Net Profit (Live)",
            liability: "Liability",
            testMode: "Test Mode",
            testVolume: "Test Volume",
            notRealMoney: "Not Real Money",
            usageLogs: "Usage Logs",
            showingLast100: "Showing last 100 records for",
            table: {
                dateTime: "Date & Time",
                user: "User",
                action: "Action",
                model: "Model",
                status: "Status",
                latency: "Latency",
                provCost: "Prov Cost",
                credits: "Credits",
                asset: "Asset",
                error: "Error",
                view: "View",
                signUp: "Sign Up",
                lastSeen: "Last Seen"
            },
            userManagement: "User Management",
            enterEmail: "Enter email...",
            add: "Add",
            role: "Role",
            userRole: "user",
            noEmails: "No emails in whitelist"
        },
        pt: {
            title: "Painel Admin",
            range: "Período:",
            to: "até",
            contentCreated: "Conteúdo Criado",
            total: "Total",
            imgs: "Imgs",
            vids: "Vídeos",
            liveFinancials: "Financeiro (Real)",
            realRevenue: "Receita Real",
            providerCost: "Custo Provedor",
            profitLiability: "Lucro & Passivo",
            netProfitLive: "Lucro Líquido (Real)",
            liability: "Passivo (Créditos)",
            testMode: "Modo Teste",
            testVolume: "Volume de Teste",
            notRealMoney: "Dinheiro Fictício",
            usageLogs: "Logs de Uso",
            showingLast100: "Mostrando últimos 100 registros de",
            table: {
                dateTime: "Data & Hora",
                user: "Usuário",
                action: "Ação",
                model: "Modelo",
                status: "Status",
                latency: "Latência",
                provCost: "Custo Prov",
                credits: "Créditos",
                asset: "Arquivo",
                error: "Erro",
                view: "Ver",
                signUp: "Cadastro",
                lastSeen: "Visto em"
            },
            userManagement: "Gerenciar Usuários",
            enterEmail: "Digite o email...",
            add: "Adicionar",
            role: "Função",
            userRole: "usuário",
            noEmails: "Nenhum email na lista"
        }
    };

    const text = t[language];

    useEffect(() => {
        const checkAdminAndFetch = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                // Verify Admin Role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (!profile || profile.role !== 'admin') {
                    router.push('/'); // Redirect non-admins
                    return;
                }

                // Fetch Logs with Date Range Filter
                const { data: logData, error: logError } = await supabase
                    .from('usage_logs')
                    .select('*')
                    .gte('created_at', startDate + 'T00:00:00.000Z')
                    .lte('created_at', endDate + 'T23:59:59.999Z')
                    .order('created_at', { ascending: false })
                    .limit(100);

                if (logError) console.error("Error fetching logs:", logError);

                // Fetch Transactions with Date Range Filter
                const { data: transData, error: transError } = await supabase
                    .from('transactions')
                    .select('*')
                    .gte('created_at', startDate + 'T00:00:00.000Z')
                    .lte('created_at', endDate + 'T23:59:59.999Z')
                    .eq('status', 'completed')
                    .order('created_at', { ascending: false });

                if (transError) console.error("Error fetching transactions:", transError);

                // Fetch Profiles Sum (Global State, not date filtered)
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('*');

                if (profilesError) console.error("Error fetching profiles:", profilesError);

                // Fetch Whitelist
                const { data: whitelistData, error: whitelistError } = await supabase
                    .from('whitelist')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (whitelistError) console.error("Error fetching whitelist:", whitelistError);


                const fetchedLogs = logData || [];
                const fetchedTrans = transData || [];
                const allProfiles = profilesData || [];
                const fetchedWhitelist = whitelistData || [];

                // Map emails to logs
                const logsWithEmail = fetchedLogs.map(log => {
                    const userProfile = allProfiles.find(p => p.id === log.user_id);
                    return {
                        ...log,
                        user_email: userProfile?.email || 'Unknown'
                    };
                });

                // Map Profiles to Whitelist
                const whitelistWithProfiles = fetchedWhitelist.map(w => {
                    const profile = allProfiles.find(p => p.email === w.email);
                    return { ...w, profile };
                });

                setLogs(logsWithEmail);
                setTransactions(fetchedTrans);
                setWhitelist(whitelistWithProfiles);
                calculateStats(fetchedLogs, fetchedTrans, allProfiles);

            } catch (err) {
                console.error("Critical Admin Dashboard Load Error:", err);
            } finally {
                setLoading(false);
            }
        };

        checkAdminAndFetch();
    }, [supabase, router, startDate, endDate]);

    const calculateStats = (logData: UsageLog[], transData: Transaction[], profileData: any[]) => {
        const totalCreditsBurnt = logData.reduce((acc, log) => acc + (log.credits_deducted || 0), 0);
        const errors = logData.filter(l => l.status === 'error').length;
        const totalLat = logData.reduce((acc, log) => acc + (log.latency_ms || 0), 0);

        const imageCount = logData.filter(l => l.action_type === 'image').length;
        const videoCount = logData.filter(l => l.action_type === 'video').length;

        const totalProviderCost = logData.reduce((acc, log) => acc + (log.provider_cost || 0), 0);

        // Separate Revenue
        const liveTransactions = transData.filter(tx => tx.livemode === true);
        const testTransactions = transData.filter(tx => tx.livemode !== true);

        const totalRevenue = liveTransactions.reduce((acc, tx) => acc + (tx.amount_paid || 0), 0) / 100;
        const testRevenue = testTransactions.reduce((acc, tx) => acc + (tx.amount_paid || 0), 0) / 100;

        const totalProfit = totalRevenue - totalProviderCost;

        const totalLiability = profileData.reduce((acc, p) => acc + (p.credits || 0), 0);

        setStats({
            totalCreditsBurnt,
            totalErrors: errors,
            avgLatency: logData.length > 0 ? Math.round(totalLat / logData.length) : 0,
            totalGenerations: logData.length,
            estimatedCost: totalProviderCost,
            totalRevenue,
            testRevenue,
            totalProfit,
            imageCount,
            videoCount,
            totalLiability
        });
    };

    const handleAddToWhitelist = async () => {
        if (!whitelistEmail) return;

        const { error } = await supabase
            .from('whitelist')
            .insert([{ email: whitelistEmail }]);

        if (error) {
            alert('Error adding email: ' + error.message);
        } else {
            setWhitelistEmail('');
            window.location.reload();
        }
    };

    const handleRemoveFromWhitelist = async (email: string) => {
        if (!confirm(`Are you sure you want to remove ${email}?`)) return;

        const { error } = await supabase
            .from('whitelist')
            .delete()
            .eq('email', email);

        if (error) {
            alert('Error removing email: ' + error.message);
        } else {
            setWhitelist(prev => prev.filter(w => w.email !== email));
        }
    };

    const handleUpdateCredits = async (userId: string, currentCredits: number, change: number) => {
        const newCredits = currentCredits + change;
        if (newCredits < 0) {
            alert("Credits cannot be negative.");
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({ credits: newCredits })
            .eq('id', userId);

        if (error) {
            alert('Error updating credits: ' + error.message);
        } else {
            setWhitelist(prev => prev.map(w => {
                if (w.profile && w.profile.id === userId) {
                    return { ...w, profile: { ...w.profile, credits: newCredits } };
                }
                return w;
            }));
            setEditingCredits(null);
            setCreditAmount(0);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <span className="text-red-500">🛡️</span> {text.title}
                </h1>

                {/* Date Range Filter */}
                <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg border border-gray-800">
                    <span className="text-gray-400 text-sm">{text.range}</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none"
                    />
                    <span className="text-gray-400 text-sm">{text.to}</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {/* Metric 1: Counts */}
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <TrendingUp size={16} /> {text.contentCreated}
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-2xl font-bold text-white">{stats.totalGenerations}</div>
                            <div className="text-xs text-gray-500">{text.total}</div>
                        </div>
                        <div className="text-right text-xs text-gray-400">
                            <div>🖼️ {stats.imageCount} {text.imgs}</div>
                            <div>🎥 {stats.videoCount} {text.vids}</div>
                        </div>
                    </div>
                </div>

                {/* Metric 2: Financials (Live Sales vs Cost) */}
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <DollarSign size={16} /> {text.liveFinancials}
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-xl font-bold text-green-400">${stats.totalRevenue.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{text.realRevenue}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-red-400">-${stats.estimatedCost.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{text.providerCost}</div>
                        </div>
                    </div>
                </div>

                {/* Metric 3: Profit & Liability */}
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <TrendingUp size={16} /> {text.profitLiability}
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <div className={`text-xl font-bold ${stats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ${stats.totalProfit.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">{text.netProfitLive}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-yellow-500">{stats.totalLiability} Cr</div>
                            <div className="text-xs text-gray-500">{text.liability}</div>
                        </div>
                    </div>
                </div>

                {/* Metric 4: Test Mode Volume (New Separate Card) */}
                <div className="bg-gray-800/50 border border-dashed border-gray-700 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Loader2 size={16} className="text-yellow-500" /> {text.testMode}
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-xl font-bold text-gray-300">${stats.testRevenue.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{text.testVolume}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500">{text.notRealMoney}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Logs */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                        <div className="p-4 border-b border-gray-800 font-bold flex justify-between items-center">
                            <span>{text.usageLogs}</span>
                            <span className="text-xs text-gray-500 font-normal">
                                {text.showingLast100} {startDate} {text.to} {endDate}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3">{text.table.dateTime}</th>
                                        <th className="px-4 py-3">{text.table.user}</th>
                                        <th className="px-4 py-3">{text.table.action}</th>
                                        <th className="px-4 py-3">{text.table.model}</th>
                                        <th className="px-4 py-3">{text.table.status}</th>
                                        <th className="px-4 py-3">{text.table.latency}</th>
                                        <th className="px-4 py-3">{text.table.provCost}</th>
                                        <th className="px-4 py-3">{text.table.credits}</th>
                                        <th className="px-4 py-3">{text.table.asset}</th>
                                        <th className="px-4 py-3">{text.table.error}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-purple-300 text-xs">
                                                {log.user_email}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                <span className={`px-2 py-1 rounded text-xs ${log.action_type === 'video' ? 'bg-purple-900 text-purple-200' :
                                                    log.action_type === 'image' ? 'bg-blue-900 text-blue-200' :
                                                        'bg-gray-700 text-gray-200'
                                                    }`}>
                                                    {log.action_type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">{log.model_used}</td>
                                            <td className="px-4 py-3">
                                                {log.status === 'success' ? (
                                                    <span className="text-green-500 font-bold">✓</span>
                                                ) : (
                                                    <span className="text-red-500 font-bold">✗</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-mono">{log.latency_ms}ms</td>
                                            <td className="px-4 py-3 text-green-400 font-mono">
                                                ${(log.provider_cost || 0).toFixed(4)}
                                            </td>
                                            <td className="px-4 py-3 text-yellow-500 font-bold">
                                                {log.credits_deducted > 0 ? `${log.credits_deducted} Cr` : '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {log.asset_url && log.asset_url.startsWith('http') ? (
                                                    <a
                                                        href={log.asset_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 underline text-xs border border-blue-900 px-2 py-1 rounded hover:bg-blue-900/50 transition-colors"
                                                    >
                                                        {text.table.view}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-600 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-red-400 max-w-xs truncate" title={log.error_message}>
                                                {log.error_message || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Whitelist Management */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden sticky top-24">
                        <div className="p-4 border-b border-gray-800 font-bold flex justify-between items-center">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> {text.userManagement}</span>
                        </div>
                        <div className="p-4">
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="email"
                                    placeholder={text.enterEmail}
                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm w-full focus:border-blue-500 outline-none"
                                    value={whitelistEmail}
                                    onChange={(e) => setWhitelistEmail(e.target.value)}
                                />
                                <button
                                    onClick={handleAddToWhitelist}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded transition-colors"
                                >
                                    {text.add}
                                </button>
                            </div>

                            <div className="max-h-[600px] overflow-y-auto space-y-2">
                                {whitelist.map((w, i) => (
                                    <div key={i} className="bg-gray-800/50 p-3 rounded text-sm hover:bg-gray-800 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-gray-200 font-medium break-all">{w.email}</span>
                                            <button
                                                onClick={() => handleRemoveFromWhitelist(w.email)}
                                                className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Remove from Whitelist"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {w.profile ? (
                                            <div className="flex flex-col gap-2 mt-1 pt-2 border-t border-gray-700/50">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500">{text.table.signUp}:</span>
                                                    <span className="text-gray-400">
                                                        {new Date(w.profile.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500">{text.table.lastSeen}:</span>
                                                    <span className="text-gray-400">
                                                        {w.profile.last_seen_at ? new Date(w.profile.last_seen_at).toLocaleDateString() : 'Never'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500">{text.role}:</span>
                                                    <span className={`${w.profile.role === 'admin' ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                                                        {w.profile.role || text.userRole}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500">{text.table.credits}:</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-yellow-500 font-mono">{w.profile.credits}</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleUpdateCredits(w.profile.id, w.profile.credits, -10)}
                                                                className="px-1.5 py-0.5 bg-gray-700 hover:bg-red-900 rounded text-gray-300 text-[10px]"
                                                                title="-10"
                                                            >
                                                                -10
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateCredits(w.profile.id, w.profile.credits, 50)}
                                                                className="px-1.5 py-0.5 bg-gray-700 hover:bg-green-900 rounded text-gray-300 text-[10px]"
                                                                title="+50"
                                                            >
                                                                +50
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-600 italic mt-1">
                                                User has not signed up yet.
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {whitelist.length === 0 && <div className="text-gray-600 text-xs italic text-center">{text.noEmails}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
