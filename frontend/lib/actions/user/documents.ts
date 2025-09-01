'use server'

import { backendFetch } from '@/lib/backendFetch'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type ActionResult = { 
  success: boolean
  error: string | null
  data?: unknown
}

const ProfilePictureSchema = z.object({
  profilePicture: z.string().url('Invalid profile picture URL')
})

const CVUploadSchema = z.object({
  cv: z.string().url('Invalid CV URL')
})

export async function updateProfilePictureAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = {
    profilePicture: formData.get('profilePicture')?.toString() || ''
  }

  const parsed = ProfilePictureSchema.safeParse(raw)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid profile picture data'
    return { success: false, error: message }
  }

  try {
    const response = await backendFetch('/user/me', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parsed.data)
    })

    revalidatePath('/account')
    
    return {
      success: true,
      error: null,
      data: response
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred while updating profile picture'
    return {
      success: false,
      error: message
    }
  }
}

export async function updateCVAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = {
    cv: formData.get('cv')?.toString() || ''
  }

  const parsed = CVUploadSchema.safeParse(raw)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid CV data'
    return { success: false, error: message }
  }

  try {
    const response = await backendFetch('/cv/upload', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parsed.data)
    })

    revalidatePath('/account')
    
    return {
      success: true,
      error: null,
      data: response
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred while updating CV'
    return {
      success: false,
      error: message
    }
  }
} 