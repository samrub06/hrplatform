"use client"

import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import { type ActionResult } from '@/interfaces/account.interface'
import { type UserData } from '@/lib/types'
import { useFormState } from 'react-dom'

interface PersonalInfoFormProps {
  userData: UserData
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>
}

export function PersonalInfoForm({ userData, action }: PersonalInfoFormProps) {
  const [state, formAction] = useFormState(action, { success: false, error: null })

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            defaultValue={userData.first_name}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            defaultValue={userData.last_name}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthday">Birthday</Label>
        <Input
          id="birthday"
          name="birthday"
          type="date"
          defaultValue={userData.birthday?.toString().split('T')[0]}
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      {state.success && (
        <p className="text-sm text-green-600">Personal information updated successfully!</p>
      )}

      <Button type="submit" className="w-full md:w-auto">
        Update Personal Information
      </Button>
    </form>
  )
} 