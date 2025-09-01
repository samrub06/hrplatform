import { toast } from "@/hooks/use-toast"
import { UserData } from "@/lib/types"
import { SkillItem, SkillsFormData } from "@/lib/validations/skills"
import { updateSkillsAction } from "../actions/account"

// Data transformation utilities
export const transformSkillsForSubmit = (skills: SkillItem[]) => {
  return skills.map(skill => ({
    ...skill,
    // Ensure proper data types
    level: Number(skill.level),
    name: skill.name.trim()
  }))
}

export const transformSkillsFromApi = (cvData: UserData['cv']) => {
  return {
    skills: cvData?.skills?.map(skill => ({
      id: skill.id,
      name: skill.name,
      level: skill.level || 5
    })) || []
  }
}

// API service functions
export const submitSkillsData = async (values: SkillsFormData) => {
  try {
    // Transform data for API
    const skillsData = transformSkillsForSubmit(values.skills)
    
    // Create FormData for Server Action
    const formData = new FormData()
    formData.append('skills', JSON.stringify(skillsData))
    
    // Call server action
    const result = await updateSkillsAction({ success: false, error: null }, formData)
    
    if (result.success) {
      toast.success("Skills updated successfully!")
      return { success: true, data: result }
    } else {
      toast.error(result.error || "Failed to update skills")
      return { success: false, error: result.error }
    }
  } catch {
    const errorMessage = "An error occurred while updating skills"
    toast.error(errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Skill management utilities
export const addSkillToList = (skills: SkillItem[], newSkill: SkillItem): SkillItem[] => {
  // Check for duplicates
  const exists = skills.some(skill => 
    skill.name.toLowerCase() === newSkill.name.toLowerCase()
  )
  
  if (exists) {
    toast.error("This skill already exists")
    return skills
  }
  
  return [...skills, newSkill]
}

export const removeSkillFromList = (skills: SkillItem[], skillId: string): SkillItem[] => {
  return skills.filter(skill => skill.id !== skillId)
}

export const updateSkillInList = (skills: SkillItem[], updatedSkill: SkillItem): SkillItem[] => {
  return skills.map(skill => 
    skill.id === updatedSkill.id ? updatedSkill : skill
  )
}

// Form utility functions
export const useSkillsFormData = (userDataSkills: UserData['cv']) => {
  return transformSkillsFromApi(userDataSkills)
}