const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

if (!supabaseUrl || !supabaseKey || !adminPhoneNumber) {
    console.error('❌ ERRO: Faltam variáveis de ambiente (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY ou ADMIN_PHONE_NUMBER) no arquivo .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
        config: {
            broadcast: { self: true },
            presence: { key: 'bot' },
        },
        transport: 'websocket', // Forçando o uso de WebSockets
        timeout: 40000,         // Aumentando para 40 segundos
    },
});

// Teste de conexão inicial
async function testarConexaoSupabase() {
    console.log('🔍 Testando conexão básica com o Supabase...');
    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('✅ Conexão básica com Supabase OK!');
        return true;
    } catch (err) {
        console.error('❌ ERRO DE CONEXÃO: Não foi possível ler a tabela "profiles". Verifique sua internet e as chaves no .env');
        console.error('Detalhe:', err.message);
        return false;
    }
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('👆 Escaneie o QR Code acima para conectar o Bot do WhatsApp.');
});

client.on('ready', async () => {
    console.log('✅ Bot do WhatsApp conectado e pronto para notificar!');
    const conexaoOk = await testarConexaoSupabase();
    if (conexaoOk) {
        iniciarEscutaSupabase();
    } else {
        console.log('⚠️ Abortando escuta Realtime devido a erro de conexão básica.');
    }
});

function iniciarEscutaSupabase(retryCount = 0) {
    const maxRetries = 5;
    const nomeDaTabela = 'profiles';
    const channelName = 'realtime-notifier';

    // Remove canal anterior se existir para evitar canais duplicados/travados
    supabase.removeChannel(supabase.channel(channelName));

    console.log(`📡 Tentativa ${retryCount + 1}: Conectando ao Realtime ("${nomeDaTabela}")...`);

    const channel = supabase
        .channel(channelName)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: nomeDaTabela
        }, (payload) => {
            console.log('🔔 EVENTO RECEBIDO!', payload);

            const novoUsuario = payload.new;
            const numeroAdmin = process.env.ADMIN_PHONE_NUMBER;

            if (!novoUsuario) return;

            const email = novoUsuario.email || 'Email não disponível';
            const name = novoUsuario.full_name || novoUsuario.name || 'Nome não disponível';

            const mensagem = `🚨 *Novo Cadastro!*\n\nNome: ${name}\nEmail: ${email}\nData: ${new Date().toLocaleString('pt-BR')}\n\nO app está crescendo! 🚀`;

            client.sendMessage(numeroAdmin + '@c.us', mensagem).then(() => {
                console.log('✅ Notificação enviada para o admin.');
            }).catch(err => {
                console.error('❌ Erro no WhatsApp:', err.message);
            });
        })
        .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
                console.log(`🚀 CONECTADO! Escutando a tabela "${nomeDaTabela}".`);
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                console.error(`⚠️ Falha (Status: ${status}). Erro:`, err ? err.message : 'Timeout/Erro de rede.');

                if (retryCount < maxRetries) {
                    const delay = (retryCount + 1) * 5000;
                    console.log(`🔄 Tentando novamente em ${delay / 1000}s... (${retryCount + 1}/${maxRetries})`);
                    setTimeout(() => iniciarEscutaSupabase(retryCount + 1), delay);
                } else {
                    console.error('🚫 Limite de tentativas atingido. Verifique o Realtime no Dashboard do Supabase.');
                }
            } else {
                console.log('🔄 Status da inscrição:', status);
            }
        });

    if (retryCount === 0) {
        setInterval(() => {
            console.log(`⏱️ Status Realtime: ${channel.state}`);
        }, 2 * 60 * 1000);
    }
}

client.initialize();
