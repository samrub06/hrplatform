import { updateProfessionalInfoAction } from "@/app/actions/user"
import { toast } from "@/hooks/use-toast"
import { UserData } from "@/lib/types"
import { ProfessionalFormData } from "@/lib/validations/professional"

// Data transformation utilities
export const transformProfessionalForSubmit = (professional: ProfessionalFormData) => {
  return {
    ...professional,
    // Ensure proper data types
    years_of_experience: professional.years_of_experience || 0,
    // Handle empty strings
    role: professional.role || null,
    current_position: professional.current_position || null,
    current_company: professional.current_company || null,
    desired_position: professional.desired_position || null,
    salary_expectation: professional.salary_expectation || null
  }
}

export const transformProfessionalFromApi = (userData: Pick<UserData, 'role' | 'current_position' | 'current_company' | 'desired_position' | 'salary_expectation' | 'years_of_experience'>) => {
  return {
    role: userData.role || "",
    current_position: userData.current_position || "",
    current_company: userData.current_company || "",
    desired_position: userData.desired_position || "",
    salary_expectation: userData.salary_expectation || "",
    years_of_experience: userData.years_of_experience || 0
  }
}

// API service functions
export const submitProfessionalData = async (values: ProfessionalFormData) => {
  try {
    // Transform data for API
    const professionalData = transformProfessionalForSubmit(values)
    
    // Create FormData for Server Action
    const formData = new FormData()
    Object.entries(professionalData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value))
      }
    })
    
    // Call server action
    const result = await updateProfessionalInfoAction({ success: false, error: null }, formData)
    
    if (result.success) {
      toast.success("Professional information updated successfully!")
      return { success: true, data: result }
    } else {
      toast.error(result.error || "Failed to update professional information")
      return { success: false, error: result.error }
    }
  } catch {
    const errorMessage = "An error occurred while updating professional information"
    toast.error(errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Form utility functions
export const useProfessionalFormData = (userData: Pick<UserData, 'role' | 'current_position' | 'current_company' | 'desired_position' | 'salary_expectation' | 'years_of_experience'>) => {
  return transformProfessionalFromApi(userData)
}