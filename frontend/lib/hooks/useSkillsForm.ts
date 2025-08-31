import {
    submitSkillsData,
    useSkillsFormData
} from "@/lib/services/skills"
import { UserData } from "@/lib/types"
import {
    createEmptySkill,
    skillsFormSchema,
    type SkillItem,
    type SkillsFormData
} from "@/lib/validations/skills"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"

export const useSkillsForm = (userDataSkills: UserData['cv']) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SkillsFormData>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: useSkillsFormData(userDataSkills)
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills"
  })

  const addSkill = () => {
    const newSkill = createEmptySkill()
    append(newSkill)
  }

  const removeSkill = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const updateSkillLevel = (index: number, level: number) => {
    form.setValue(`skills.${index}.level`, level)
  }

  const updateSkillName = (index: number, name: string) => {
    form.setValue(`skills.${index}.name`, name)
  }

  const handleSubmit = async (values: SkillsFormData) => {
    setIsSubmitting(true)
    
    try {
      const result = await submitSkillsData(values)
      
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

  // Skill management helpers
  const getSkillByIndex = (index: number): SkillItem | undefined => {
    return form.getValues(`skills.${index}`)
  }

  const getAllSkills = (): SkillItem[] => {
    return form.getValues('skills') || []
  }

  const hasSkillWithName = (name: string, excludeIndex?: number): boolean => {
    const skills = getAllSkills()
    return skills.some((skill, index) => 
      skill.name.toLowerCase() === name.toLowerCase() && 
      index !== excludeIndex
    )
  }

  return {
    form,
    fields,
    isSubmitting,
    addSkill,
    removeSkill,
    updateSkillLevel,
    updateSkillName,
    handleSubmit: form.handleSubmit(handleSubmit),
    getSkillByIndex,
    getAllSkills,
    hasSkillWithName
  }
}