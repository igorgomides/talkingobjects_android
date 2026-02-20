'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const fullName = formData.get('fullName') as string

    const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/profile')
    revalidatePath('/', 'layout') // Update header across app
    return { success: "Profile updated successfully" }
}

export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const file = formData.get('avatar') as File

    if (!file || file.size === 0) {
        return { error: "No file selected" }
    }

    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${fileExt}` // Overwrite existing

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

    if (uploadError) {
        console.error("Upload Error:", uploadError)
        return { error: "Failed to upload image" }
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    // 3. Update Profile with URL (add timestamp to force refresh)
    const avatarUrlWithTimestamp = `${publicUrl}?t=${Date.now()}`

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrlWithTimestamp })
        .eq('id', user.id)

    if (updateError) {
        return { error: "Failed to update profile picture" }
    }

    revalidatePath('/profile')
    revalidatePath('/', 'layout')
    return { success: "Avatar updated successfully" }
}
