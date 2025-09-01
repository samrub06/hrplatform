'use server'

import { backendFetch } from '@/lib/backendFetch'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type ActionResult = { 
  success: boolean
  error: string | null
  data?: unknown
}

const PersonalInfoSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  birthday: z.string().optional()
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

export async function updatePersonalInfoAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = {
    first_name: getFormDataString(formData, 'first_name'),
    last_name: getFormDataString(formData, 'last_name'),
    birthday: getFormDataOptionalString(formData, 'birthday')
  }

  const parsed = PersonalInfoSchema.safeParse(raw)
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
    const message = error instanceof Error ? error.message : 'An error occurred while updating personal information'
    return {
      success: false,
      error: message
    }
  }
} 