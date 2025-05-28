"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PersonalInfoForm from "./personal-info-form"
import ContactInfoForm from "./contact-info-form"
import ProfessionalInfoForm from "./professional-info-form"
import EducationForm from "./education-form"
import SkillsManager from "./skills-manager"
import ProfilePictureUpload from "./profile-picture-upload"
import CVUpload from "./cv-upload"

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

export default function AccountSettingsPage() {
  const [userData, setUserData] = useState<UserData>(sampleUser)

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...newData, updatedAt: new Date() }))
  }

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
                currentPicture={userData.profilePicture}
                onUpdate={(url) => updateUserData({ profilePicture: url })}
              />
              <h2 className="text-xl font-semibold mt-4">
                {userData.first_name} {userData.last_name}
              </h2>
              <p className="text-muted-foreground">{userData.role || "No role specified"}</p>
              <p className="text-sm text-muted-foreground mt-1">{userData.email}</p>
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
                <p>{userData.current_position || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                <p>{userData.current_company || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
                <p>{userData.years_of_experience ? `${userData.years_of_experience} years` : "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Skills</h3>
                <p>{userData.skills.map((s) => s.name).join(", ") || "None added"}</p>
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
              <PersonalInfoForm userData={userData} onUpdate={updateUserData} />
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
              <ContactInfoForm userData={userData} onUpdate={updateUserData} />
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
              <ProfessionalInfoForm userData={userData} onUpdate={updateUserData} />
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
                education={userData.education || []}
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
              <SkillsManager userSkills={userData.skills} onUpdate={(skills) => updateUserData({ skills })} />
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
              <CVUpload currentCV={userData.cv} onUpdate={(cv) => updateUserData({ cv })} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
