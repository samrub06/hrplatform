import { z } from "zod"

// Documents validation schema
export const documentsFormSchema = z.object({
  cv: z.any().optional()
})

// Type definitions based on schema
export type DocumentsFormData = z.infer<typeof documentsFormSchema>

// File validation helpers
export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  return allowedTypes.includes(file.type)
}

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

export const isValidDocumentFile = (file: File): { valid: boolean; error?: string } => {
  if (!validateFileType(file)) {
    return { 
      valid: false, 
      error: "Please upload a PDF or Word document (.pdf, .doc, .docx)" 
    }
  }
  
  if (!validateFileSize(file)) {
    return { 
      valid: false, 
      error: "File size must be less than 5MB" 
    }
  }
  
  return { valid: true }
}

// File utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}