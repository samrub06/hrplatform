import { type UserData } from '@/lib/types'
import { EducationForm } from './forms/education-form'

interface EducationTabProps {
  userEducationData?: UserData['cv']
}

export default function EducationTab({ userEducationData }: EducationTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Education</h3>
        <p className="text-sm text-muted-foreground">
          Manage your educational background and qualifications.
        </p>
      </div>
      
      <EducationForm 
        educationData={userEducationData}
      />
    </div>
  )
} 