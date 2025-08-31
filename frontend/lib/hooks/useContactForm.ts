import {
  submitContactData,
  useContactFormData
} from "@/lib/services/contact"
import { UserData } from "@/lib/types"
import {
  contactFormSchema,
  type ContactFormData
} from "@/lib/validations/contact"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

export const useContactForm = (userData: Pick<UserData, 'email' | 'phone_number' | 'github_link' | 'linkedin_link'>) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: useContactFormData(userData)
  })

  const handleSubmit = async (values: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const result = await submitContactData(values)
      
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