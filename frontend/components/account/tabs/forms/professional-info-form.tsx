"use client"

import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import { type ActionResult } from '@/interfaces/account.interface'
import { type UserData } from '@/lib/types'
import { useFormState } from 'react-dom'

interface ProfessionalInfoFormProps {
  userData: UserData
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>
}

export function ProfessionalInfoForm({ userData, action }: ProfessionalInfoFormProps) {
  const [state, formAction] = useFormState(action, { success: false, error: null })

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="current_position">Current Position</Label>
          <Input
            id="current_position"
            name="current_position"
            defaultValue={userData.current_position}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="current_company">Current Company</Label>
          <Input
            id="current_company"
            name="current_company"
            defaultValue={userData.current_company}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="desired_position">Desired Position</Label>
          <Input
            id="desired_position"
            name="desired_position"
            defaultValue={userData.desired_position}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="salary_expectation">Salary Expectation</Label>
          <Input
            id="salary_expectation"
            name="salary_expectation"
            defaultValue={userData.salary_expectation}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="years_experience">Years of Experience</Label>
        <Input
          id="years_experience"
          name="years_experience"
          type="number"
          min="0"
          defaultValue={userData.years_experience}
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      {state.success && (
        <p className="text-sm text-green-600">Professional information updated successfully!</p>
      )}

      <Button type="submit" className="w-full md:w-auto">
        Update Professional Information
      </Button>
    </form>
  )
} 