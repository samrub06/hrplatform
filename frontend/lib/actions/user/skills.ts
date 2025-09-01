'use server'

import { backendFetch } from '@/lib/backendFetch'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type ActionResult = { 
  success: boolean
  error: string | null
  data?: unknown
}

const SkillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  level: z.number().min(1).max(10)
})

const SkillsSchema = z.object({
  skills: z.array(SkillItemSchema)
})

export async function updateSkillsAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    // Parse skills data from form
    const skillsData = formData.get('skills')
    if (!skillsData) {
      return { success: false, error: 'Skills data is required' }
    }

    const skills = JSON.parse(skillsData.toString())
    const parsed = SkillsSchema.safeParse({ skills })

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Invalid skills data'
      return { success: false, error: message }
    }

    const response = await backendFetch('/cv/skills', {
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
    const message = error instanceof Error ? error.message : 'An error occurred while updating skills'
    return {
      success: false,
      error: message
    }
  }
} 