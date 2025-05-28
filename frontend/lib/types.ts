export interface UserData {
  id?: string
  first_name?: string
  last_name?: string
  email?: string
  birthday?: Date
  role?: string
  adminNotes?: string
  current_position?: string
  current_company?: string
  desired_position?: string
  salary_expectation?: number
  cv?: {
    fileName: string
  }
  skills?: {
    name: string
    years_of_experience: number
  }[]
  education?: {
    institution: string
    degree: string
    fieldOfStudy: string
    period: [Date, Date]
    description: string
  }[]
  profilePicture?: string
  phone_number?: string
  github_link?: string
  linkedin_link?: string
}
