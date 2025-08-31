"use client"

import { ContactTab, DocumentsTab, EducationTab, PersonalTab, ProfessionalTab, ProfileHeader, SkillsTab } from "@/components/account/tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs"
import { type UserData } from "@/lib/types"
import { useState } from "react"

interface AccountSettingsPageProps {
  initialUserData?: UserData
}

export default function AccountSettingsPage({ initialUserData }: AccountSettingsPageProps) {
  const [userData, setUserData] = useState<UserData | null>(initialUserData || null)

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData((prev) => prev ? { ...prev, ...newData, updatedAt: new Date() } : null)
  }

  if (!userData) return null // Server provides data, no need for loading

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile information and account preferences</p>
      </div>

      <ProfileHeader 
        userData={userData}
        onUpdateProfilePicture={(url) => updateUserData({ profilePicture: url })}
      />

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
          <PersonalTab userData={userData} />
        </TabsContent>

        <TabsContent value="contact">
          <ContactTab userData={userData} />
        </TabsContent>

        <TabsContent value="professional">
          <ProfessionalTab userData={userData} />
        </TabsContent>

        <TabsContent value="education">
          <EducationTab userEducationData={userData.cv} />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsTab userDataSkills={userData.cv} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab userData={userData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}