'use server'


import { backendFetch } from '@/lib/backendFetch';
import { EducationFormData } from '@/lib/types/education.types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Types for action results
type ActionResult = { 
  success: boolean
  error: string | null
  data?: unknown
}

// Validation schemas matching your backend DTOs
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
  public_profile_url: z.string().url().optional().or(z.literal(''))
})

const ProfessionalInfoSchema = z.object({
  role: z.string().optional().or(z.literal('')),
  current_position: z.string().optional().or(z.literal('')),
  current_company: z.string().optional().or(z.literal('')),
  desired_position: z.string().optional().or(z.literal('')),
  salary_expectation: z.string().optional().or(z.literal('')),
  years_of_experience: z.number().min(0).optional()
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

// helper function to call cv backend update endpoint
export async function updateEducationUserAction(education: EducationFormData[]): Promise<Record<string, unknown>> {
  const response = await backendFetch('/cv/education/me', {
    method: 'PATCH',
    body: JSON.stringify({ education })
  })
  return response
}




/**
 * Update Personal Information (first_name, last_name, birthday)
 */
export async function updatePersonalInfoAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate data
    const rawData = {
      first_name: getFormDataString(formData, 'first_name'),
      last_name: getFormDataString(formData, 'last_name'),
      birthday: getFormDataOptionalString(formData, 'birthday')
    }

    const parsed = PersonalInfoSchema.safeParse(rawData)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => issue.message).join(', ')
      return { success: false, error: errors }
    }

    console.log(parsed.data)
    // Update in backend (auth handled automatically by backendFetch)
    const updatedUser = await updateUserInBackend(parsed.data)

    // Revalidate the account page to show updated data
    revalidatePath('/account')

    return {
      success: true,
      error: null,
      data: updatedUser
    }
  } catch (error) {
    console.error('Error updating personal info:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update personal information'
    }
  }
}

/**
 * Update Contact Information (email, phone, links)
 */
export async function updateContactInfoAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      email: getFormDataString(formData, 'email'),
      phone_number: getFormDataString(formData, 'phone_number'),
      github_link: getFormDataString(formData, 'github_link'),
      linkedin_link: getFormDataString(formData, 'linkedin_link'),
    }

    const parsed = ContactInfoSchema.safeParse(rawData)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => issue.message).join(', ')
      return { success: false, error: errors }
    }

    const updatedUser = await updateUserInBackend(parsed.data)

    revalidatePath('/account')

    return {
      success: true,
      error: null,
      data: updatedUser
    }
  } catch (error) {
    console.error('Error updating contact info:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update contact information'
    }
  }
}

/**
 * Update Professional Information (role, position, company, etc.)
 */
export async function updateProfessionalInfoAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      role: getFormDataString(formData, 'role'),
      current_position: getFormDataString(formData, 'current_position'),
      current_company: getFormDataString(formData, 'current_company'),
      desired_position: getFormDataString(formData, 'desired_position'),
      salary_expectation: getFormDataString(formData, 'salary_expectation'),
      years_of_experience: formData.get('years_of_experience') ? 
        parseInt(getFormDataString(formData, 'years_of_experience')) : undefined
    }

    const parsed = ProfessionalInfoSchema.safeParse(rawData)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => issue.message).join(', ')
      return { success: false, error: errors }
    }

    const updatedUser = await updateUserInBackend(parsed.data)

    revalidatePath('/account')

    return {
      success: true,
      error: null,
      data: updatedUser
    }
  } catch (error) {
    console.error('Error updating professional info:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update professional information'
    }
  }
}

/**
 * Update Profile Picture
 */
export async function updateProfilePictureAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      profilePicture: getFormDataString(formData, 'profilePicture')
    }

    const parsed = ProfilePictureSchema.safeParse(rawData)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => issue.message).join(', ')
      return { success: false, error: errors }
    }

    const updatedUser = await updateUserInBackend(parsed.data)

    revalidatePath('/account')

    return {
      success: true,
      error: null,
      data: updatedUser
    }
  } catch (error) {
    console.error('Error updating profile picture:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile picture'
    }
  }
}

/**
 * Update CV/Resume
 */
export async function updateCVAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      cv: getFormDataString(formData, 'cv')
    }

    const parsed = CVUploadSchema.safeParse(rawData)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => issue.message).join(', ')
      return { success: false, error: errors }
    }

    const updatedUser = await updateUserInBackend(parsed.data)

    revalidatePath('/account')

    return {
      success: true,
      error: null,
      data: updatedUser
    }
  } catch (error) {
    console.error('Error updating CV:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update CV'
    }
  }
}




export async function updateContactInfoDirectAction(formData: FormData): Promise<void> {
  const result = await updateContactInfoAction({ success: false, error: null }, formData)
  if (result.success) {
    redirect('/account?updated=contact')
  } else {
    redirect(`/account?error=${encodeURIComponent(result.error || 'Update failed')}`)
  }
}

export async function updateProfessionalInfoDirectAction(formData: FormData): Promise<void> {
  const result = await updateProfessionalInfoAction({ success: false, error: null }, formData)
  if (result.success) {
    redirect('/account?updated=professional')
  } else {
    redirect(`/account?error=${encodeURIComponent(result.error || 'Update failed')}`)
  }
}

/**
 * Get current user data (Server Action)
 */
export async function getUserDataAction() {
  try {
    const userData = await backendFetch('/user/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    return userData
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}

/**
 * Update user education information (Server Action)
 */
export async function updateEducationAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const educationJSON = getFormDataString(formData, 'education')
    const education = JSON.parse(educationJSON)
    
    const rawData = { education }

    const parsed = EducationSchema.safeParse(rawData)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => issue.message).join(', ')
      return { success: false, error: errors }
    }

    const updatedUser = await updateEducationUserAction(parsed.data.education)

    revalidatePath('/account')

    return {
      success: true,
      error: null,
      data: updatedUser
    }
  } catch (error) {
    console.error('Error updating education info:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update education information'
    }
  }
}

/**
 * Update user skills information (Server Action)
 */
export async function updateSkillsAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const skillsJSON = getFormDataString(formData, 'skills')
    const skills = JSON.parse(skillsJSON)
    
    const rawData = { skills }

    const parsed = SkillsSchema.safeParse(rawData)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => issue.message).join(', ')
      return { success: false, error: errors }
    }

    const updatedUser = await updateUserInBackend({ 
      cv: { skills: parsed.data.skills }
    })

    revalidatePath('/account')

    return {
      success: true,
      error: null,
      data: updatedUser
    }
  } catch (error) {
    console.error('Error updating skills info:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update skills information'
    }
  }
}