'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function captureLead(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get('name') as string;
    const email = (formData.get('email') as string).toLowerCase().trim();

    if (!name || !email) {
        redirect('/invite?error=' + encodeURIComponent("Preencha nome e email."));
    }

    // Check if it already exists in whitelist
    const { data: betaEntry } = await supabase
        .from('whitelist')
        .select('email')
        .eq('email', email)
        .single();

    if (betaEntry) {
        redirect('/invite?success=true&message=' + encodeURIComponent("Seu email já tem acesso Premium garantido!"));
    }

    // Check if it already exists in whitelist_lead
    const { data: leadEntry } = await supabase
        .from('whitelist_lead')
        .select('email')
        .eq('email', email)
        .single();

    if (leadEntry) {
        redirect('/invite?success=true&message=' + encodeURIComponent("Você já está na lista! Crie sua conta agora."));
    }

    // Insert new lead
    const { error } = await supabase
        .from('whitelist_lead')
        .insert([{ email, name }]);

    if (error) {
        console.error("Erro ao salvar lead:", error.message);
        redirect('/invite?error=' + encodeURIComponent("Erro ao processar sua solicitação. Tente novamente."));
    }

    redirect('/invite?success=true');
}
