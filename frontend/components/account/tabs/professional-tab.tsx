import { type AccountTabProps } from '@/interfaces/account.interface'
import { updateProfessionalInfoAction } from '@/lib/actions/account'
import { ProfessionalInfoForm } from './forms/professional-info-form'

export default function ProfessionalTab({ userData }: AccountTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Professional Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your professional experience and career goals.
        </p>
      </div>
      
      <ProfessionalInfoForm 
        userData={userData}
        action={updateProfessionalInfoAction}
      />
    </div>
  )
} 