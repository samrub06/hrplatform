import { useQuery } from '@tanstack/react-query'

interface Skill {
  id: string
  name: string
}

interface UserData {
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
  birthday?: Date
  education?: {
    institution: string
    degree: string
    fieldOfStudy: string
    startDate: Date
    endDate?: Date
    description?: string
  }[]
}

const fetchUserData = async (): Promise<UserData> => {
  const response = await fetch('/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }

  return response.json()
}

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
} 