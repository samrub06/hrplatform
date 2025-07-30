import axiosInstance from '@/lib/axiosInstance'
import { cookies } from 'next/headers'
import AccountSettingsClient from './account-client'

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
  createdAt: new Date("2022-01-15"),
  updatedAt: new Date("2023-05-20"),
  birthday: new Date("1990-06-12"),
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor's",
      fieldOfStudy: "Computer Science",
      startDate: new Date("2010-09-01"),
      endDate: new Date("2014-06-30"),
      description: "Graduated with honors",
    },
  ],
}

async function getUserData() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
      return { success: false, data: sampleUser }
    }

    const response = await axiosInstance.get('/user')
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return { success: false, data: sampleUser }
  }
}

export default async function AccountSettingsPage() {
  const { data: userData } = await getUserData()

  return <AccountSettingsClient initialUserData={userData} />
} 