import {
  submitProfessionalData,
  useProfessionalFormData
} from "@/lib/services/professional"
import { UserData } from "@/lib/types"
import {
  professionalFormSchema,
  type ProfessionalFormData
} from "@/lib/validations/professional"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

export const useProfessionalForm = (userData: Pick<UserData, 'role' | 'current_position' | 'current_company' | 'desired_position' | 'salary_expectation' | 'years_experience'>) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: useProfessionalFormData(userData)
  })

  const handleSubmit = async (values: ProfessionalFormData) => {
    setIsSubmitting(true)
    
    try {
      const result = await submitProfessionalData(values)
      
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