import {
    submitPersonalData,
    usePersonalFormData
} from "@/lib/services/personal"
import { UserData } from "@/lib/types"
import {
    personalFormSchema,
    type PersonalFormData
} from "@/lib/validations/personal"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

export const usePersonalForm = (userData: Pick<UserData, 'first_name' | 'last_name' | 'birthday'>) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PersonalFormData>({
    resolver: zodResolver(personalFormSchema),
    defaultValues: usePersonalFormData(userData)
  })

  const handleSubmit = async (values: PersonalFormData) => {
    setIsSubmitting(true)
    
    try {
      const result = await submitPersonalData(values)
      
      if (result.success) {
        // Reset form to show clean state
        form.reset(values)
        return result
      }
      
      return result
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit)
  }
}