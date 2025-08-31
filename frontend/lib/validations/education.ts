import { z } from "zod"

// Education item validation schema
export const educationItemSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  current: z.boolean()
})

// Full education form validation schema
export const educationFormSchema = z.object({
  education: z.array(educationItemSchema)
})

// Type definitions based on schemas
export type EducationItem = z.infer<typeof educationItemSchema>
export type EducationFormData = z.infer<typeof educationFormSchema>

// Validation helpers
export const validateEducationDates = (startDate: Date, endDate?: Date) => {
  if (!endDate) return true
  return startDate < endDate
}

export const createEmptyEducationItem = (): EducationItem => ({
  id: crypto.randomUUID(),
  institution: "",
  degree: "",
  field: "",
  startDate: new Date(),
  current: false
})