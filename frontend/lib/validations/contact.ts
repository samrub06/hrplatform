import { z } from "zod"

// Contact info validation schema
export const contactFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone_number: z.string().optional(),
  github_link: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  linkedin_link: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
})

// Type definitions based on schema
export type ContactFormData = z.infer<typeof contactFormSchema>

// Validation helpers
export const isValidUrl = (url: string): boolean => {
  if (!url || url === "") return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // Format as needed (example: +33 1 23 45 67 89)
  if (digits.length >= 10) {
    return digits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '+33 $1 $2 $3 $4 $5')
  }
  
  return phone
}