import ProfileHeader from '@/components/account/profile-header'
import {
  ContactTab,
  DocumentsTab,
  EducationTab,
  PersonalTab,
  ProfessionalTab,
  SkillsTab
} from '@/components/account/tabs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs"
import { getUserDataAction } from '@/lib/actions/account'
import { redirect } from 'next/navigation'

// Main page component - Server Component
export default async function AccountPage() {
  // Use Server Action to get user data
  const userData = await getUserDataAction()
  
  if (!userData) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile information and account preferences</p>
      </div>

      <ProfileHeader userData={userData} />

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
