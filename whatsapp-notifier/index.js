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

const supabase = createClient(supabaseUrl, supabaseKey);

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

client.on('ready', () => {
    console.log('✅ Bot do WhatsApp conectado e pronto para notificar!');
    iniciarEscutaSupabase();
});

function iniciarEscutaSupabase() {
    // Configurado para a tabela do app atual que armazena os perfis/usuários
    const nomeDaTabela = 'profiles';

    supabase
        .channel('custom-insert-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: nomeDaTabela }, (payload) => {
            console.log('Novo usuário detectado!', payload.new);

            const novoUsuario = payload.new;
            const numeroAdmin = process.env.ADMIN_PHONE_NUMBER;

            const email = novoUsuario.email || 'Email não disponível';
            const name = novoUsuario.full_name || novoUsuario.name || 'Nome não disponível';

            const mensagem = `🚨 *Novo Cadastro!*\n\nNome: ${name}\nEmail: ${email}\nData: ${new Date().toLocaleString('pt-BR')}\n\nO app está crescendo! 🚀`;

            client.sendMessage(numeroAdmin + '@c.us', mensagem).then(() => {
                console.log('✅ Notificação enviada para o admin.');
            }).catch(err => {
                console.error('❌ Erro ao enviar a notificação', err);
            });
        })
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log(`🎧 O bot está escutando inserções na tabela "${nomeDaTabela}"...`);
            } else {
                console.log('Status de inscrição do Realtime:', status);
            }
        });
}

client.initialize();
