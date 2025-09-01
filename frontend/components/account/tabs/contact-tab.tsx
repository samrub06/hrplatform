import { type AccountTabProps } from '@/interfaces/account.interface'
import { updateContactInfoAction } from '@/lib/actions/account'
import { ContactInfoForm } from './forms/contact-info-form'

export default function ContactTab({ userData }: AccountTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Contact Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your contact details and social media links.
        </p>
      </div>
      
      <ContactInfoForm 
        userData={userData}
        action={updateContactInfoAction}
      />
    </div>
  )
} 