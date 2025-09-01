import { type AccountTabProps } from '@/interfaces/account.interface'
import { DocumentsForm } from './forms/documents-form'

export default function DocumentsTab({ userData }: AccountTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Documents</h3>
        <p className="text-sm text-muted-foreground">
          Upload and manage your profile picture and CV.
        </p>
      </div>
      
      <DocumentsForm 
        userData={userData}
      />
    </div>
  )
} 