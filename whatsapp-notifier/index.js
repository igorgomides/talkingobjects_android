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
        timeout: 30000, // Aumentando timeout para 30 segundos
    },
});

// Teste de conexão inicial
async function testarConexaoSupabase() {
    console.log('🔍 Testando conexão básica com o Supabase...');
    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('✅ Conexão básica com Supabase OK!');

        // Novo: Teste de permissão de publicação
        console.log('🔍 Verificando se a tabela está na publicação do Realtime...');
        const { data: pubData, error: pubError } = await supabase.rpc('check_realtime_pub', { t_name: 'profiles' }).catch(() => ({ data: null }));
        // Se o RPC não existir, continuamos, mas logamos
        if (pubError) console.log('⚠️ Aviso: RPC de checagem não disponível, seguindo com o Realtime...');

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
    const maxRetries = 3;
    // Configurado para a tabela do app atual que armazena os perfis/usuários
    const nomeDaTabela = 'profiles';
    console.log(`📡Tentativa ${retryCount + 1}: Iniciando conexão Realtime com "${nomeDaTabela}"...`);

    const channel = supabase
        .channel('custom-insert-channel')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: nomeDaTabela
        }, (payload) => {
            console.log('🔔 EVENTO RECEBIDO!', payload);

            const novoUsuario = payload.new;
            const numeroAdmin = process.env.ADMIN_PHONE_NUMBER;

            if (!novoUsuario) {
                console.error('⚠️ Payload vazio recebido!');
                return;
            }

            const email = novoUsuario.email || 'Email não disponível';
            const name = novoUsuario.full_name || novoUsuario.name || 'Nome não disponível';

            const mensagem = `🚨 *Novo Cadastro!*\n\nNome: ${name}\nEmail: ${email}\nData: ${new Date().toLocaleString('pt-BR')}\n\nO app está crescendo! 🚀`;

            client.sendMessage(numeroAdmin + '@c.us', mensagem).then(() => {
                console.log('✅ Notificação enviada para o admin.');
            }).catch(err => {
                console.error('❌ Erro ao enviar a notificação para o WhatsApp:', err);
            });
        })
        .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
                console.log(`🚀 CONECTADO! O bot está oficialmente escutando a tabela "${nomeDaTabela}".`);
            } else if (status === 'CHANNEL_ERROR') {
                console.error('❌ ERRO NO CANAL REALTIME:', err || 'Erro desconhecido.');
            } else if (status === 'TIMED_OUT') {
                console.error('⏳ TIMEOUT na conexão Realtime.');
                if (retryCount < maxRetries) {
                    console.log(`🔄 Tentando reconectar em 5 segundos... (${retryCount + 1}/${maxRetries})`);
                    setTimeout(() => iniciarEscutaSupabase(retryCount + 1), 5000);
                } else {
                    console.error('🚫 Limite de tentativas de conexão Realtime atingido.');
                }
            } else if (status === 'CLOSED') {
                console.log('🔌 CONEXÃO FECHADA pelo servidor.');
            } else {
                console.log('🔄 Status da inscrição:', status);
            }
        });

    // PING de teste para confirmar que o processo está vivo a cada 5 minutos
    if (retryCount === 0) {
        setInterval(() => {
            console.log(`⏱️ Heartbeat: Bot continua ativo (Status: ${channel.state})`);
        }, 5 * 60 * 1000);
    }
}

client.initialize();
