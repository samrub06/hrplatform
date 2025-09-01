// Models for the application
export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface CV {
  id: string
  file_name: string
  file_url: string
  created_date: string
  user_id: string
}

export interface Skill {
  id: string
  skill_name: string
  years_of_experience?: number
  user_id: string
}

export interface Experience {
  id: string
  position_title: string
  company_name: string
  start_date: string
  end_date?: string
  is_current: boolean
  user_id: string
} 