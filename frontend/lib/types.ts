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
  years_of_experience?: number
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

// Interface for server data (dates as strings)
export interface UserDataFromServer {
  id: string
  first_name: string
  last_name: string
  email: string
  role?: string
  current_position?: string
  current_company?: string
  desired_position?: string
  salary_expectation?: string
  years_of_experience?: number
  phone_number?: string
  github_link?: string
  linkedin_link?: string
  public_profile_url?: string
  birthday?: string
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
  createdAt: string
  updatedAt: string
}

// Interface pour les candidats
export interface Candidate {
  id: string
  first_name?: string
  last_name?: string
  full_name?: string
  email?: string
  phone?: string
  location?: string
  role_type?: string
  profile_complete?: boolean
  availability?: string
  years_experience?: number
  desired_salary?: number
  bio?: string
  portfolio_url?: string
  linkedin_url?: string
  github_url?: string
  admin_notes?: string
  created_date: string
  updated_date: string
}

// Interface pour les CV
export interface CV {
  id: string
  file_name: string
  file_url: string
  created_date: string
  user_id: string
}

// Interface pour les compétences
export interface Skill {
  id: string
  skill_name: string
  years_of_experience?: number
  user_id: string
}

// Interface pour les expériences
export interface Experience {
  id: string
  position_title: string
  company_name: string
  start_date: string
  end_date?: string
  is_current: boolean
  user_id: string
}

// Interface pour les filtres
export interface CandidateFiltersType {
  roleType: string
  profileComplete: string
  availability: string
}

// Interface pour les données de candidat détaillées
export interface CandidateData {
  cvs: CV[]
  skills: Skill[]
  experiences: Experience[]
}
