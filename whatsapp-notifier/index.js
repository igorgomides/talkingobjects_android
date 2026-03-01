const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERRO: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let ultimoIdProcessado = null;

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('👆 Escaneie o QR Code acima para conectar o Bot do WhatsApp.');
});

client.on('ready', async () => {
    console.log('✅ Bot do WhatsApp conectado e pronto!');

    // Teste inicial e busca do último ID já existente
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('❌ Erro ao acessar Supabase:', error.message);
    } else {
        if (profiles && profiles.length > 0) {
            ultimoIdProcessado = profiles[0].id;
            console.log(`📡 Bot iniciado. Último perfil monitorado (ID): ${ultimoIdProcessado}`);
        } else {
            console.log('📡 Bot iniciado. Nenhum perfil encontrado ainda.');
        }

        console.log('🚀 Iniciando monitoramento via POLLING (HTTP)...');
        iniciarPolling();
    }
});

async function verificarNovosUsuarios() {
    try {
        let query = supabase
            .from('profiles')
            .select('id, email, full_name, created_at')
            .order('created_at', { ascending: true });

        // Se já temos um ID, buscamos apenas os posteriores
        if (ultimoIdProcessado) {
            // Nota: Se o ID for UUID, ordernar por created_at é mais seguro
            // Vamos buscar registros criados após o último que vimos
            const { data: lastProfile } = await supabase.from('profiles').select('created_at').eq('id', ultimoIdProcessado).single();
            if (lastProfile) {
                query = query.gt('created_at', lastProfile.created_at);
            }
        }

        const { data: novosUsuarios, error } = await query;

        if (error) throw error;

        if (novosUsuarios && novosUsuarios.length > 0) {
            console.log(`🔔 ${novosUsuarios.length} novo(s) usuário(s) detectado(s)!`);

            for (const user of novosUsuarios) {
                // Evita duplicatas se buscar exatamente o que já processou
                if (user.id === ultimoIdProcessado) continue;

                await enviarNotificacao(user);
                ultimoIdProcessado = user.id;
            }
        }
    } catch (err) {
        console.error('⚠️ Erro no polling:', err.message);
    }
}

async function enviarNotificacao(user) {
    const numeroAdmin = process.env.ADMIN_PHONE_NUMBER;
    const email = user.email || 'Email não disponível';
    const name = user.full_name || 'Nome não disponível';

    const mensagem = `🚨 *Novo Cadastro!*\n\nNome: ${name}\nEmail: ${email}\nData: ${new Date(user.created_at).toLocaleString('pt-BR')}\n\nO app está crescendo! 🚀`;

    try {
        await client.sendMessage(numeroAdmin + '@c.us', mensagem);
        console.log(`✅ Notificação enviada para: ${email}`);
    } catch (err) {
        console.error('❌ Erro ao enviar WhatsApp:', err.message);
    }
}

function iniciarPolling() {
    // Verifica a cada 20 segundos
    setInterval(verificarNovosUsuarios, 20000);
    // Executa a primeira vez imediatamente
    verificarNovosUsuarios();
}

client.initialize();
