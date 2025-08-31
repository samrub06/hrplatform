import { z } from "zod"

// Skill item validation schema
export const skillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  level: z.number().min(1).max(10)
})

// Skills form validation schema
export const skillsFormSchema = z.object({
  skills: z.array(skillItemSchema)
})

// Type definitions based on schemas
export type SkillItem = z.infer<typeof skillItemSchema>
export type SkillsFormData = z.infer<typeof skillsFormSchema>

// Skill level helpers
export const getSkillLevelText = (level: number): string => {
  if (level <= 2) return "Beginner"
  if (level <= 4) return "Basic"
  if (level <= 6) return "Intermediate"
  if (level <= 8) return "Advanced"
  return "Expert"
}

export const getSkillLevelColor = (level: number): string => {
  if (level <= 2) return "bg-red-500"
  if (level <= 4) return "bg-orange-500"
  if (level <= 6) return "bg-yellow-500"
  if (level <= 8) return "bg-blue-500"
  return "bg-green-500"
}

export const createEmptySkill = (): SkillItem => ({
  id: crypto.randomUUID(),
  name: "",
  level: 5
})

// Validation helpers
export const validateSkillName = (name: string, existingSkills: SkillItem[], currentId?: string): boolean => {
  const duplicateSkill = existingSkills.find(skill => 
    skill.name.toLowerCase() === name.toLowerCase() && skill.id !== currentId
  )
  return !duplicateSkill
}

export const suggestSkillLevel = (skillName: string): number => {
  // Basic skill level suggestions based on common patterns
  const beginnerSkills = ['html', 'css', 'git basics']
  const intermediateSkills = ['javascript', 'python', 'react', 'nodejs']
  const advancedSkills = ['typescript', 'docker', 'kubernetes', 'aws']
  
  const lowerName = skillName.toLowerCase()
  
  if (beginnerSkills.some(skill => lowerName.includes(skill))) return 3
  if (intermediateSkills.some(skill => lowerName.includes(skill))) return 6
  if (advancedSkills.some(skill => lowerName.includes(skill))) return 8
  
  return 5 // Default to intermediate
}