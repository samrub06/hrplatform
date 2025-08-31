import { z } from "zod"

// Professional info validation schema
export const professionalFormSchema = z.object({
  role: z.string().optional(),
  current_position: z.string().optional(),
  current_company: z.string().optional(),
  desired_position: z.string().optional(),
  salary_expectation: z.string().optional(),
  years_of_experience: z.number().min(0).max(50).optional(),
})

// Type definitions based on schema
export type ProfessionalFormData = z.infer<typeof professionalFormSchema>

// Validation helpers
export const formatSalary = (salary: string): string => {
  // Remove all non-digit characters except comma and dot
  const digits = salary.replace(/[^\d,.-]/g, '')
  
  // Format with thousands separator
  const number = parseFloat(digits.replace(',', '.'))
  if (!isNaN(number)) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number)
  }
  
  return salary
}

export const validateExperience = (years: number): boolean => {
  return years >= 0 && years <= 50
}

// Experience level helpers
export const getExperienceLevel = (years: number): string => {
  if (years === 0) return "No experience"
  if (years <= 2) return "Junior"
  if (years <= 5) return "Mid-level"
  if (years <= 10) return "Senior"
  return "Expert"
}