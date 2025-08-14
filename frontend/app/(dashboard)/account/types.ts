export interface Skill {
  id: string
  name: string
}

export interface UserData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  github_link?: string
  linkedin_link?: string
  public_profile_url?: string
  cv?: {
    fileName: string
    id: string
    name: string
  } | null
  role?: string
  adminNotes?: string
  profilePicture?: string
  years_of_experience?: number
  skills: Skill[]
  desired_position?: string
  salary_expectation?: string
  current_position?: string
  current_company?: string
  createdAt: Date
  updatedAt: Date
  birthday?: Date | null
  education?: {
    institution: string
    degree: string
    fieldOfStudy: string
    startDate: Date
    endDate?: Date | null
    description?: string
  }[]
}

export interface UserDataFromServer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  github_link?: string
  linkedin_link?: string
  public_profile_url?: string
  cv?: {
    fileName: string
    id: string
    name: string
  } | null
  role?: string
  adminNotes?: string
  profilePicture?: string
  years_of_experience?: number
  skills: Skill[]
  desired_position?: string
  salary_expectation?: string
  current_position?: string
  current_company?: string
  createdAt: string
  updatedAt: string
  birthday?: string
  education?: {
    institution: string
    degree: string
    fieldOfStudy: string
    startDate: string
    endDate?: string
    description?: string
  }[]
} 