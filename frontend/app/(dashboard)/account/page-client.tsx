"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs"
import { useEffect, useState } from "react"
import ContactInfoForm from "./contact-info-form"
import CVUpload from "./cv-upload"
import EducationForm from "./education-form"
import PersonalInfoForm from "./personal-info-form"
import ProfessionalInfoForm from "./professional-info-form"
import ProfilePictureUpload from "./profile-picture-upload"
import SkillsManager from "./skills-manager"

// Sample user data for demonstration
const sampleUser: UserData = {
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

interface AccountSettingsPageProps {
  initialUserData?: any // Will be properly typed from UserService
}

export default function AccountSettingsPage({ initialUserData }: AccountSettingsPageProps) {
  const [userData, setUserData] = useState<UserData | null>(initialUserData || null)
  const [loading, setLoading] = useState(!initialUserData) // Only load if no initial data
  const [error, setError] = useState<string | null>(null)

  // Function to fetch user data by ID
  const getUserById = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await response.json()
      setUserData(userData)
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to load user data')
      // Fallback to sample data if API fails
      setUserData(sampleUser)
    } finally {
      setLoading(false)
    }
  }

  // Load user data on component mount only if no initial data
  useEffect(() => {
    if (!initialUserData) {
      getUserById()
    }
  }, [initialUserData])

  const updateUserData = (newData: Partial<UserData>) => {
    if (userData) {
      setUserData((prev) => prev ? ({ ...prev, ...newData, updatedAt: new Date() }) : null)
    }
  }

  // Wrapper functions for form components to handle type compatibility
  const updatePersonalInfo = (data: { first_name: string; last_name: string; birthday?: Date | null }) => {
    updateUserData(data)
  }

  const updateContactInfo = (data: { email: string; phone_number?: string; github_link?: string; linkedin_link?: string; public_profile_url?: string }) => {
    updateUserData(data)
  }

  const updateProfessionalInfo = (data: { role?: string; current_position?: string; current_company?: string; desired_position?: string; salary_expectation?: string; years_of_experience?: number }) => {
    updateUserData(data)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !userData) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={getUserById}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Use sample data as fallback if no user data is available
  const currentUserData = userData || sampleUser

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile information and account preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <ProfilePictureUpload
                currentPicture={currentUserData.profilePicture}
                onUpdate={(url) => updateUserData({ profilePicture: url })}
              />
              <h2 className="text-xl font-semibold mt-4">
                {currentUserData.first_name} {currentUserData.last_name}
              </h2>
              <p className="text-muted-foreground">{currentUserData.role || "No role specified"}</p>
              <p className="text-sm text-muted-foreground mt-1">{currentUserData.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
            <CardDescription>Your profile at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Current Position</h3>
                <p>{currentUserData?.current_position || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                <p>{currentUserData?.current_company || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
                <p>{currentUserData?.years_of_experience ? `${currentUserData.years_of_experience} years` : "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
                <p>{currentUserData?.skills?.map((s: Skill) => s.name).join(", ") || "None added"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm userData={currentUserData} onUpdate={updatePersonalInfo} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Manage your contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactInfoForm userData={currentUserData} onUpdate={updateContactInfo} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Update your career details</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfessionalInfoForm userData={currentUserData} onUpdate={updateProfessionalInfo} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Manage your educational background</CardDescription>
            </CardHeader>
            <CardContent>
              <EducationForm
                education={currentUserData.education || []}
                onUpdate={(education) => updateUserData({ education })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Manage your professional skills</CardDescription>
            </CardHeader>
            <CardContent>
              <SkillsManager userSkills={currentUserData.skills} onUpdate={(skills) => updateUserData({ skills })} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Manage your resume and other documents</CardDescription>
            </CardHeader>
            <CardContent>
              <CVUpload currentCV={currentUserData.cv} onUpdate={(cv) => updateUserData({ cv })} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
