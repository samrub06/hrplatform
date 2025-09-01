import { type AccountTabProps } from '@/interfaces/account.interface'
import { updatePersonalInfoAction } from '@/lib/actions/account'
import { PersonalInfoForm } from './forms/personal-info-form'

export default function PersonalTab({ userData }: AccountTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal details and basic information.
        </p>
      </div>
      
      <PersonalInfoForm 
        userData={userData}
        action={updatePersonalInfoAction}
      />
    </div>
  )
} 