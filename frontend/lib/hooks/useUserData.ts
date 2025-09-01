'use client'


export interface UserData {
  id: string
  first_name: string
  last_name: string
  email: string
  role?: string
  current_position?: string
  current_company?: string
  desired_position?: string
  salary_expectation?: string
  years_experience?: number
  phone_number?: string
  github_link?: string
  linkedin_link?: string
  public_profile_url?: string
  birthday?: string | Date | null
  profilePicture?: string
  cv?: {
    fileName: string
    id: string
    name: string
    skills: Array<{ id: string; name: string; level: number }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate?: string
    current: boolean
  }>  
  }

  updatedAt?: Date
}


