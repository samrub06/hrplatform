import {
    handleFileDownload,
    handleFileRemove,
    handleFileUpload,
    useDocumentsFormData
} from "@/lib/services/documents"
import { UserData } from "@/lib/types"
import {
    documentsFormSchema,
    type DocumentsFormData
} from "@/lib/validations/documents"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

export const useDocumentsForm = (userData: Pick<UserData, 'cv'>) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const form = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsFormSchema),
    defaultValues: useDocumentsFormData(userData)
  })

  const handleFileSelect = async (file: File) => {
    setIsSubmitting(true)
    
    try {
      const result = await handleFileUpload(file)
      
      if (result.success) {
        // Update form with new file data
        form.setValue('cv', result.data)
        form.reset({ cv: result.data })
        return result
      }
      
      return result
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFileSelect(files[0])
    }
  }

  const downloadCv = () => {
    if (userData.cv) {
      handleFileDownload(userData.cv.url, userData.cv.name || "cv.pdf")
    }
  }

  const removeCv = async () => {
    if (userData.cv?.id) {
      const result = await handleFileRemove(userData.cv.id)
      if (result.success) {
        form.setValue('cv', undefined)
        form.reset({ cv: undefined })
      }
    }
  }

  return {
    form,
    isSubmitting,
    dragOver,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleInputChange,
    downloadCv,
    removeCv
  }
}