'use server'

import { backendFetch } from '@/lib/backendFetch'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type ActionResult = { 
  success: boolean
  error: string | null
  data?: unknown
}

const ContactInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone_number: z.string().optional().or(z.literal('')),
  github_link: z.string().url().optional().or(z.literal('')),
  linkedin_link: z.string().url().optional().or(z.literal('')),
})

// Helper function to safely extract string from FormData
function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return value?.toString() || ''
}

// Helper function to safely extract optional string from FormData
function getFormDataOptionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)?.toString()
  return value && value.length > 0 ? value : undefined
}

// Helper function to call backend update endpoint
async function updateUserInBackend(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const response = await backendFetch('/user/me', {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  return response
}

export async function updateContactInfoAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = {
    email: getFormDataString(formData, 'email'),
    phone_number: getFormDataOptionalString(formData, 'phone_number'),
    github_link: getFormDataOptionalString(formData, 'github_link'),
    linkedin_link: getFormDataOptionalString(formData, 'linkedin_link'),
  }

  const parsed = ContactInfoSchema.safeParse(raw)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid form data'
    return { success: false, error: message }
  }

  try {
    const response = await updateUserInBackend(parsed.data)
    revalidatePath('/account')
    
    return {
      success: true,
      error: null,
      data: response
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred while updating contact information'
    return {
      success: false,
      error: message
    }
  }
} 