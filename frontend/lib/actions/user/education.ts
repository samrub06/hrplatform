'use server'

import { backendFetch } from '@/lib/backendFetch'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type ActionResult = { 
  success: boolean
  error: string | null
  data?: unknown
}

const EducationItemSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean()
})

const EducationSchema = z.object({
  education: z.array(EducationItemSchema)
})

export async function updateEducationAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    // Parse education data from form
    const educationData = formData.get('education')
    if (!educationData) {
      return { success: false, error: 'Education data is required' }
    }

    const education = JSON.parse(educationData.toString())
    const parsed = EducationSchema.safeParse({ education })

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Invalid education data'
      return { success: false, error: message }
    }

    const response = await backendFetch('/cv/education', {
      method: 'PUT',
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
    const message = error instanceof Error ? error.message : 'An error occurred while updating education'
    return {
      success: false,
      error: message
    }
  }
} 