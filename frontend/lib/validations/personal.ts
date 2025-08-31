import { z } from "zod"

// Personal info validation schema
export const personalFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  birthday: z.date().optional(),
})

// Type definitions based on schema
export type PersonalFormData = z.infer<typeof personalFormSchema>

// Validation helpers
export const validateAge = (birthday: Date): boolean => {
  const today = new Date()
  const age = today.getFullYear() - birthday.getFullYear()
  const monthDiff = today.getMonth() - birthday.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    return age - 1 >= 16 // Minimum age of 16
  }
  
  return age >= 16
}

export const calculateAge = (birthday: Date): number => {
  const today = new Date()
  let age = today.getFullYear() - birthday.getFullYear()
  const monthDiff = today.getMonth() - birthday.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--
  }
  
  return age
}

export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}