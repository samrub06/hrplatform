import { updatePersonalInfoAction } from "@/app/actions/user"
import { toast } from "@/hooks/use-toast"
import { UserData } from "@/lib/types"
import { PersonalFormData } from "@/lib/validations/personal"

// Data transformation utilities
export const transformPersonalForSubmit = (personal: PersonalFormData) => {
  return {
    ...personal,
    // Convert date to ISO string for API
    birthday: personal.birthday ? personal.birthday.toISOString() : null
  }
}

export const transformPersonalFromApi = (userData: Pick<UserData, 'first_name' | 'last_name' | 'birthday'>) => {
  return {
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    birthday: userData.birthday ? new Date(userData.birthday) : undefined
  }
}

// API service functions
export const submitPersonalData = async (values: PersonalFormData) => {
  try {
    // Transform data for API
    const personalData = transformPersonalForSubmit(values)
    
    // Create FormData for Server Action
    const formData = new FormData()
    Object.entries(personalData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value))
      }
    })
    
    // Call server action
    const result = await updatePersonalInfoAction({ success: false, error: null }, formData)
    
    if (result.success) {
      toast.success("Personal information updated successfully!")
      return { success: true, data: result }
    } else {
      toast.error(result.error || "Failed to update personal information")
      return { success: false, error: result.error }
    }
  } catch {
    const errorMessage = "An error occurred while updating personal information"
    toast.error(errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Form utility functions
export const usePersonalFormData = (userData: Pick<UserData, 'first_name' | 'last_name' | 'birthday'>) => {
  return transformPersonalFromApi(userData)
}