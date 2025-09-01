import { toast } from "@/hooks/use-toast"
import { UserData } from "@/lib/types"
import { ContactFormData } from "@/lib/validations/contact"
import { updateContactInfoAction } from "../actions/account"

// Data transformation utilities
export const transformContactForSubmit = (contact: ContactFormData) => {
  return {
    ...contact,
    // Ensure empty strings are handled properly
    github_link: contact.github_link || null,
    linkedin_link: contact.linkedin_link || null,
    phone_number: contact.phone_number || null
  }
}

export const transformContactFromApi = (userData: Pick<UserData, 'email' | 'phone_number' | 'github_link' | 'linkedin_link'>) => {
  return {
    email: userData.email || "",
    phone_number: userData.phone_number || "",
    github_link: userData.github_link || "",
    linkedin_link: userData.linkedin_link || ""
  }
}

// API service functions
export const submitContactData = async (values: ContactFormData) => {
  try {
    // Transform data for API
    const contactData = transformContactForSubmit(values)
    
    // Create FormData for Server Action
    const formData = new FormData()
    Object.entries(contactData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value))
      }
    })
    
    // Call server action
    const result = await updateContactInfoAction({ success: false, error: null }, formData)
    
    if (result.success) {
      toast.success("Contact information updated successfully!")
      return { success: true, data: result }
    } else {
      toast.error(result.error || "Failed to update contact information")
      return { success: false, error: result.error }
    }
  } catch {
    const errorMessage = "An error occurred while updating contact information"
    toast.error(errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Form utility functions
export const useContactFormData = (userData: Pick<UserData, 'email' | 'phone_number' | 'github_link' | 'linkedin_link'>) => {
  return transformContactFromApi(userData)
}