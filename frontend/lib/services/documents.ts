import { toast } from "@/hooks/use-toast"
import { UserData } from "@/lib/types"
import { DocumentsFormData, isValidDocumentFile } from "@/lib/validations/documents"

// Data transformation utilities
export const transformDocumentsForSubmit = (documents: DocumentsFormData) => {
  return {
    cv: documents.cv || null
  }
}

export const transformDocumentsFromApi = (userData: Pick<UserData, 'cv'>) => {
  return {
    cv: userData.cv || undefined
  }
}

// File handling utilities
export const handleFileUpload = async (file: File): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Validate file
    const validation = isValidDocumentFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Create FormData for upload
    const formData = new FormData()
    formData.append('file', file)
    
    // Upload file (replace with your actual upload endpoint)
    const response = await fetch('/api/user/upload-file', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Upload failed')
    }
    
    const result = await response.json()
    
    toast.success("Document uploaded successfully!")
    return { success: true, data: result }
    
  } catch (error) {
    const errorMessage = "Failed to upload document"
    toast.error(errorMessage)
    return { success: false, error: errorMessage }
  }
}

export const handleFileDownload = (fileUrl: string, fileName: string) => {
  try {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success("Download started")
  } catch (error) {
    toast.error("Failed to download file")
  }
}

export const handleFileRemove = async (fileId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Call API to remove file (replace with your actual endpoint)
    const response = await fetch(`/api/user/documents/${fileId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Remove failed')
    }
    
    toast.success("Document removed successfully!")
    return { success: true }
    
  } catch (error) {
    const errorMessage = "Failed to remove document"
    toast.error(errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Form utility functions
export const useDocumentsFormData = (userData: Pick<UserData, 'cv'>) => {
  return transformDocumentsFromApi(userData)
}