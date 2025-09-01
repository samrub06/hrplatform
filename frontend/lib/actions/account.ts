'use server'

import { backendFetch } from '@/lib/backendFetch'
import { type UserData } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schemas
const PersonalInfoSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  birthday: z.string().optional()
})

const ContactInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone_number: z.string().optional().or(z.literal('')),
  github_link: z.string().url().optional().or(z.literal('')),
  linkedin_link: z.string().url().optional().or(z.literal('')),
})

const ProfessionalInfoSchema = z.object({
  role: z.string().optional().or(z.literal('')),
  current_position: z.string().optional().or(z.literal('')),
  current_company: z.string().optional().or(z.literal('')),
  desired_position: z.string().optional().or(z.literal('')),
  salary_expectation: z.string().optional().or(z.literal('')),
  years_experience: z.number().min(0).optional()
})

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

const SkillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  level: z.number().min(1).max(10)
})

const SkillsSchema = z.object({
  skills: z.array(SkillItemSchema)
})

const ProfilePictureSchema = z.object({
  profilePicture: z.string().url('Invalid profile picture URL')
})

const CVUploadSchema = z.object({
  cv: z.string().url('Invalid CV URL')
})

// Helper functions
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

// Get user data
export async function getUserDataAction(): Promise<UserData | null> {
  try {
    const response = await backendFetch('/user/me', {
      method: 'GET',
      credentials: 'include'
    })
    
    if (!response) {
      return null
    }

    return {
      id: response.id,
      first_name: response.first_name,
      last_name: response.last_name,
      email: response.email,
      role: response.role,
      current_position: response.current_position,
      current_company: response.current_company,
      desired_position: response.desired_position,
      salary_expectation: response.salary_expectation,
      years_experience: response.years_experience,
      phone_number: response.phone_number,
      github_link: response.github_link,
      linkedin_link: response.linkedin_link,
      public_profile_url: response.public_profile_url,
      birthday: response.birthday,
      profilePicture: response.profilePicture,
      cv: response.cv,
      updatedAt: new Date(response.updatedAt)
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

// Update personal information
export async function updatePersonalInfoAction(prevState: any, formData: FormData) {
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

// Update contact information
export async function updateContactInfoAction(prevState: any, formData: FormData) {
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

// Update professional information
export async function updateProfessionalInfoAction(prevState: any, formData: FormData) {
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

// Update education
export async function updateEducationAction(prevState: any, formData: FormData) {
  try {
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

    const response = await backendFetch('/cv/education/me', {
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

// Update skills
export async function updateSkillsAction(prevState: any, formData: FormData) {
  try {
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

    const response = await backendFetch('/cv/skills/me', {
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

// Update profile picture
export async function updateProfilePictureAction(prevState: any, formData: FormData) {
  const raw = {
    profilePicture: formData.get('profilePicture')?.toString() || ''
  }

  const parsed = ProfilePictureSchema.safeParse(raw)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid profile picture data'
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
    const message = error instanceof Error ? error.message : 'An error occurred while updating profile picture'
    return {
      success: false,
      error: message
    }
  }
}

// Update CV
export async function updateCVAction(prevState: any, formData: FormData) {
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