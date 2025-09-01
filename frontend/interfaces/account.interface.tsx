// Account page interfaces
export interface AccountTabProps {
  userData: UserData
}

export interface ProfileHeaderProps {
  userData: UserData
  onUpdateProfilePicture?: (url: string) => void
}

// Form data interfaces
export interface PersonalInfoFormData {
  first_name: string
  last_name: string
  birthday?: string
}

export interface ContactInfoFormData {
  email: string
  phone_number?: string
  github_link?: string
  linkedin_link?: string
}

export interface ProfessionalInfoFormData {
  role?: string
  current_position?: string
  current_company?: string
  desired_position?: string
  salary_expectation?: string
  years_of_experience?: number
}

export interface EducationItem {
  id?: string
  institution: string
  degree: string
  field?: string
  startDate: string
  endDate?: string
  current: boolean
}

export interface EducationFormData {
  education: EducationItem[]
}

export interface SkillItem {
  id?: string
  name: string
  level: number
}

export interface SkillsFormData {
  skills: SkillItem[]
}

export interface DocumentFormData {
  profilePicture?: string
  cv?: string
}

// Action result interfaces
export interface ActionResult {
  success: boolean
  error: string | null
  data?: unknown
}

// Import UserData from lib/types
import { UserData } from '@/lib/types'
