
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: (formData.get('email') as string).toLowerCase().trim(),
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error?message=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const email = (formData.get('email') as string).toLowerCase().trim()
    const password = formData.get('password') as string
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // 1. Whitelist Check (Beta OR Lead)
    const { data: betaEntry } = await supabase
        .from('whitelist')
        .select('email')
        .eq('email', email)
        .single();

    const { data: leadEntry } = await supabase
        .from('whitelist_lead')
        .select('email')
        .eq('email', email)
        .single();

    if (!betaEntry && !leadEntry) {
        redirect('/error?message=' + encodeURIComponent("This email is not on any Whitelist. Request access first."))
    }

    // 2. Sign Up
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback?next=/auth/confirm-success`,
        },
    })

    if (error) {
        console.error("Signup Error:", error.message)
        redirect('/error?message=' + encodeURIComponent(error.message))
    }

    redirect('/error?type=success&message=' + encodeURIComponent("Check your email for the confirmation link."))
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();
    const email = (formData.get('email') as string).toLowerCase().trim();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
        redirect('/error?message=' + encodeURIComponent(error.message));
    }

    redirect('/error?type=success&message=' + encodeURIComponent("Password reset link sent to your email."));
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        redirect('/error?message=' + encodeURIComponent("Passwords do not match."));
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        redirect('/error?message=' + encodeURIComponent(error.message));
    }

    redirect('/');
}
