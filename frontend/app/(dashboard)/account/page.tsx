import axiosInstance from '@/lib/axiosInstance'
import { cookies } from 'next/headers'
import AccountSettingsClient from './account-client'

interface Education {
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string | Date
  endDate?: string | Date
  description?: string
}

interface UserDataRaw {
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
  skills: Array<{ id: string; name: string }>
  desired_position?: string
  salary_expectation?: string
  current_position?: string
  current_company?: string
  createdAt: string | Date
  updatedAt: string | Date
  birthday?: string | Date
  education?: Education[]
}

// Sample user data for fallback
const sampleUser = {
  id: "1",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  phone_number: "+1 (555) 123-4567",
  github_link: "https://github.com/johndoe",
  linkedin_link: "https://linkedin.com/in/johndoe",
  public_profile_url: "https://example.com/profile/johndoe",
  cv: {
    fileName: "john_doe_resume.pdf",
    id: "cv123",
    name: "John Doe Resume",
  },
  role: "Software Developer",
  profilePicture: "/placeholder.svg?height=150&width=150",
  years_of_experience: 5,
  skills: [
    { id: "1", name: "React" },
    { id: "2", name: "TypeScript" },
    { id: "4", name: "Node.js" },
  ],
  desired_position: "Senior Frontend Developer",
  salary_expectation: "$120,000",
  current_position: "Frontend Developer",
  current_company: "Tech Solutions Inc.",
  createdAt: "2022-01-15T00:00:00.000Z",
  updatedAt: "2023-05-20T00:00:00.000Z",
  birthday: "1990-06-12T00:00:00.000Z",
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor's",
      fieldOfStudy: "Computer Science",
      startDate: "2010-09-01T00:00:00.000Z",
      endDate: "2014-06-30T00:00:00.000Z",
      description: "Graduated with honors",
    },
  ],
}

// Helper function to serialize dates in user data
function serializeUserData(userData: UserDataRaw | null) {
  if (!userData) return sampleUser
  
  return {
    ...userData,
    createdAt: userData.createdAt ? new Date(userData.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: userData.updatedAt ? new Date(userData.updatedAt).toISOString() : new Date().toISOString(),
    birthday: userData.birthday ? new Date(userData.birthday).toISOString() : undefined,
    education: userData.education?.map((edu: Education) => ({
      ...edu,
      startDate: edu.startDate ? new Date(edu.startDate).toISOString() : new Date().toISOString(),
      endDate: edu.endDate ? new Date(edu.endDate).toISOString() : undefined,
    })) || [],
  }
}

async function getUserData() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
      return { success: false, data: sampleUser }
    }

    const response = await axiosInstance.get('/user')
    const serializedData = serializeUserData(response.data)
    return { success: true, data: serializedData }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return { success: false, data: sampleUser }
  }
}

export default async function AccountSettingsPage() {
  const { data: userData } = await getUserData()

  return <AccountSettingsClient initialUserData={userData} />
} 