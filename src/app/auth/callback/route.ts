
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            // Construct the base redirect URL
            let redirectUrl = isLocalEnv ? origin : (forwardedHost ? `https://${forwardedHost}` : origin)

            return NextResponse.redirect(`${redirectUrl}${next}`)
        } else {
            console.error('Auth Code Exchange Error:', error.message);
            return NextResponse.redirect(`${origin}/error?message=${encodeURIComponent(error.message)}`)
        }
    }

    // If no code, check if we have a session already (sometimes happens on double clicks)
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
        return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('No code found in auth callback URL');
    return NextResponse.redirect(`${origin}/error?message=Auth%20Code%20Error`)
}
