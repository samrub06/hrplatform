"use client"

import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import { type ActionResult } from '@/interfaces/account.interface'
import { type UserData } from '@/lib/types'
import { useFormState } from 'react-dom'

interface ContactInfoFormProps {
  userData: UserData
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>
}

export function ContactInfoForm({ userData, action }: ContactInfoFormProps) {
  const [state, formAction] = useFormState(action, { success: false, error: null })

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={userData.email}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          name="phone_number"
          type="tel"
          defaultValue={userData.phone_number}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_link">GitHub Profile</Label>
        <Input
          id="github_link"
          name="github_link"
          type="url"
          defaultValue={userData.github_link}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin_link">LinkedIn Profile</Label>
        <Input
          id="linkedin_link"
          name="linkedin_link"
          type="url"
          defaultValue={userData.linkedin_link}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="public_profile_url">Public Profile URL</Label>
        <div className="flex items-center gap-2">
          {userData.public_profile_url && (
            <a href={userData.public_profile_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {userData.public_profile_url}
            </a>
          )}
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      {state.success && (
        <p className="text-sm text-green-600">Contact information updated successfully!</p>
      )}

      <Button type="submit" className="w-full md:w-auto">
        Update Contact Information
      </Button>
    </form>
  )
} 