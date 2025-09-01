'use server'

import { backendFetch } from '@/lib/backendFetch'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type ActionResult = { 
  success: boolean
  error: string | null
  data?: unknown
}

const ProfessionalInfoSchema = z.object({
  role: z.string().optional().or(z.literal('')),
  current_position: z.string().optional().or(z.literal('')),
  current_company: z.string().optional().or(z.literal('')),
  desired_position: z.string().optional().or(z.literal('')),
  salary_expectation: z.string().optional().or(z.literal('')),
  years_experience: z.number().min(0).optional()
})

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return value?.toString() || ''
}

function getFormDataOptionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)?.toString()
  return value && value.length > 0 ? value : undefined
}

function getFormDataNumber(formData: FormData, key: string): number | undefined {
  const value = formData.get(key)?.toString()
  return value ? parseInt(value, 10) : undefined
}

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

export async function updateProfessionalInfoAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = {
    role: getFormDataOptionalString(formData, 'role'),
    current_position: getFormDataOptionalString(formData, 'current_position'),
    current_company: getFormDataOptionalString(formData, 'current_company'),
    desired_position: getFormDataOptionalString(formData, 'desired_position'),
    salary_expectation: getFormDataOptionalString(formData, 'salary_expectation'),
    years_experience: getFormDataNumber(formData, 'years_experience')
  }

  const parsed = ProfessionalInfoSchema.safeParse(raw)
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
    const message = error instanceof Error ? error.message : 'An error occurred while updating professional information'
    return {
      success: false,
      error: message
    }
  }
} 