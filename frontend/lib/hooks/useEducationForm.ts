import {
  submitEducationData,
  useEducationFormData
} from "@/lib/services/education"
import { UserData } from "@/lib/types"
import {
  createEmptyEducationItem,
  educationFormSchema,
  type EducationFormData
} from "@/lib/validations/education"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

export const useEducationForm = (userEducationData: UserData['cv']) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: useEducationFormData(userEducationData)
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education"
  })

  const addEducation = () => {
    append(createEmptyEducationItem())
  }

  const removeEducation = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const handleSubmit = async (values: EducationFormData) => {
    setIsSubmitting(true)
    
    try {
      const result = await submitEducationData(values)
      
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
    fields,
    isSubmitting,
    addEducation,
    removeEducation,
    handleSubmit: form.handleSubmit(handleSubmit)
  }
}