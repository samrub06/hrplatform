import { toast } from "@/hooks/use-toast"
import { UserData } from "@/lib/types"
import { EducationFormData, EducationItem } from "@/lib/validations/education"
import { updateEducationAction } from "../actions/account"

// Data transformation utilities
export const transformEducationForSubmit = (education: EducationItem[]) => {
  return education.map(edu => ({
    ...edu,
    startDate: edu.startDate.toISOString(),
    endDate: edu.endDate ? edu.endDate.toISOString() : undefined
  }))
}

export const transformEducationFromApi = (cvData: UserData['cv']) => {
  return cvData?.education?.map(edu => ({
    id: edu.id,
    institution: edu.institution,
    degree: edu.degree,
    field: edu.field || "",
    startDate: new Date(edu.startDate),
    endDate: edu.endDate ? new Date(edu.endDate) : undefined,
    current: !edu.endDate || edu.endDate === null
  })) || []
}

// API service functions
export const submitEducationData = async (values: EducationFormData) => {
  try {
    // Transform data for API
    const educationData = transformEducationForSubmit(values.education)
    
    // Create FormData for Server Action
    const formData = new FormData()
    formData.append('education', JSON.stringify(educationData))
    
    // Call server action
    const result = await updateEducationAction({ success: false, error: null }, formData)
    
    if (result.success) {
      toast.success("Education updated successfully!")
      return { success: true, data: result }
    } else {
      toast.error(result.error || "Failed to update education")
      return { success: false, error: result.error }
    }
  } catch {
    const errorMessage = "An error occurred while updating education"
    toast.error(errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Form utility functions
export const useEducationFormData = (userEducationData: UserData['cv']) => {
  return {
    education: transformEducationFromApi(userEducationData)
  }
}