'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Video, Image as ImageIcon, CheckCircle, ArrowRight, Zap, Target } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { captureLead } from './actions';
import Link from 'next/link';

export default function InvitePage() {
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get('success');
    const errorMessage = searchParams.get('error');
    const customMessage = searchParams.get('message');

    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white font-[family-name:var(--font-geist-sans)] selection:bg-purple-500/30">
            {/* HER0 SECTION */}
            <div className="relative overflow-hidden border-b border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black z-0 pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 py-20 relative z-10 flex flex-col md:flex-row items-center gap-12">

                    {/* Left: Copy & Form */}
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium text-sm">
                            <Sparkles size={16} /> Beta Exclusivo
                        </div>

                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                            Dê Vida aos Seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Objetos.</span><br />Crie Reels Virais.
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-lg">
                            Transforme qualquer imagem estática em um vídeo cinemático falante em segundos.
                            Cadastre-se na lista VIP hoje e ganhe <strong className="text-yellow-400">20 Créditos Grátis</strong> para testar.
                        </p>

                        {!isSuccess ? (
                            <form action={captureLead} onSubmit={() => setIsLoading(true)} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm max-w-md shadow-2xl space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Seu Nome</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                        placeholder="Como devemos te chamar?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Melhor Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                        placeholder="nome@email.com"
                                    />
                                </div>

                                {errorMessage && (
                                    <div className="text-red-400 text-sm">{errorMessage}</div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? 'Processando...' : 'Garantir Meus 20 Créditos'} <ArrowRight size={18} />
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-2">Vagas super limitadas. Sem cartão de crédito exigido.</p>
                            </form>
                        ) : (
                            <div className="bg-green-900/20 border border-green-500/30 p-8 rounded-2xl max-w-md text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Sucesso!</h3>
                                <p className="text-green-300">
                                    {customMessage || "Seu email foi adicionado à Whitelist! Você acaba de desbloquear seus 20 créditos iniciais."}
                                </p>
                                <Link href="/signup" className="mt-4 inline-block w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all">
                                    Criar Minha Conta Agora
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right: Social Proof / Visuals */}
                    <div className="flex-1 w-full relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent blur-3xl rounded-full" />

                        {/* Fake Video Box for Showcase */}
                        <div className="relative bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl aspect-[9/16] max-w-sm mx-auto transform rotate-2 hover:rotate-0 transition-all duration-500">
                            {/* Top Bar (Fake UI) */}
                            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-10">
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-purple-500" />
                                    <div>
                                        <div className="text-xs font-bold">@SalgadinhoRevoltado</div>
                                        <div className="text-[10px] text-gray-300">Patrocinado</div>
                                    </div>
                                </div>
                            </div>

                            {/* Video Player */}
                            <video
                                src="/invite-demo-video.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Bottom Bar (Fake UI) */}
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
                                <div className="text-sm font-medium mb-1 line-clamp-2">
                                    "Ser mordido por um gigante? Isso é um absurdo! A revolução das coxinhas vai começar!"
                                </div>
                                <div className="text-xs text-gray-400">♫ Som original criado por IA</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* GOLDEN TIP SECTION */}
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap size={120} className="text-yellow-500 rotate-12" />
                    </div>

                    <div className="relative z-10 space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-wider text-sm mb-2">
                            <Target size={18} /> A Dica de Ouro
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white">Como Usar Seus 20 Créditos com Inteligência</h2>

                        <p className="text-gray-300 text-lg leading-relaxed">
                            A animação de vídeo ultra-realista gasta um poder computacional gigantesco (15 cr).
                            Para não perder créditos logo de cara, nós recomendamos esse "hack" de funil para criadores:
                        </p>

                        <div className="bg-black/50 border border-black/50 rounded-xl p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="font-bold text-blue-400">1</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Teste Visual Primeiro (4 Créditos)</h4>
                                    <p className="text-gray-400 text-sm">Gere até 4 imagens diferentes da IA (Imagen 4.0). Cada geração custa apenas 1 crédito. Brinque com os prompts ("Com Raiva", "Cansado", "Feliz") até achar a imagem perfeita.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="font-bold text-purple-400">2</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Gere o Vídeo Final (15 Créditos)</h4>
                                    <p className="text-gray-400 text-sm">Quando tiver a imagem campeã e um roteiro bom gerado pela IA, escolha a imagem e mande Animar (Fast Mode). <strong>Restará 1 crédito de sobra!</strong></p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* FEATURES GRID */}
            <div className="max-w-5xl mx-auto px-4 py-12 pb-32">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Recursos de Estúdio no Seu Bolso</h2>
                    <p className="text-gray-400">Tecnologia avançada envelopada em um app simples.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:bg-gray-800 transition-colors">
                        <Sparkles className="text-purple-400 mb-4" size={32} />
                        <h3 className="font-bold text-xl mb-2">Roteiros Virais por IA</h3>
                        <p className="text-gray-400 text-sm">Apenas nos diga o objeto e o motivo. Nossa IA treinou com milhares de Reels para escrever o gancho perfeito que retém a atenção.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:bg-gray-800 transition-colors">
                        <ImageIcon className="text-blue-400 mb-4" size={32} />
                        <h3 className="font-bold text-xl mb-2">Imagens Impecáveis</h3>
                        <p className="text-gray-400 text-sm">Usando o motor Google Imagen 4.0, crie visuais ultra-complexos com cenários integrados, ou simplesmente faça upload da sua própria foto.</p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:bg-gray-800 transition-colors">
                        <Video className="text-pink-400 mb-4" size={32} />
                        <h3 className="font-bold text-xl mb-2">Animação Cinemática</h3>
                        <p className="text-gray-400 text-sm">O modelo Veo 3.1 injeta vida, respiração e movimentos na imagem estática, gerando 6 segundos ininterruptos de vídeo hiper-realista.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
