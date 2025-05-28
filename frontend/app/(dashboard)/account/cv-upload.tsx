"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Upload, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface CVUploadProps {
  currentCV?: {
    fileName: string
    id: string
    name: string
  } | null
  onUpdate: (cv: any) => void
}

export default function CVUpload({ currentCV, onUpdate }: CVUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload
    setTimeout(() => {
      // In a real app, you would upload the file to your server or a storage service
      // and get back information about the uploaded file
      const fakeUploadedCV = {
        fileName: file.name,
        id: `cv-${Date.now()}`,
        name: file.name.split(".")[0],
      }

      onUpdate(fakeUploadedCV)
      setIsUploading(false)
      toast({
        title: "CV uploaded",
        description: "Your CV has been uploaded successfully.",
      })
    }, 1500)
  }

  const removeCV = () => {
    onUpdate(null)
    toast({
      title: "CV removed",
      description: "Your CV has been removed.",
    })
  }

  const downloadCV = () => {
    // In a real app, this would download the actual file
    toast({
      title: "Download started",
      description: "Your CV is being downloaded.",
    })
  }

  return (
    <div className="space-y-6">
      {currentCV ? (
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{currentCV.name}</p>
              <p className="text-sm text-muted-foreground">{currentCV.fileName}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={downloadCV}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={removeCV}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium mb-1">Upload your CV</h3>
          <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to upload your CV</p>
          <label htmlFor="cv-upload">
            <Button disabled={isUploading}>{isUploading ? "Uploading..." : "Select File"}</Button>
          </label>
          <input
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground mt-4">PDF or Word document, max 10MB</p>
        </div>
      )}

      {currentCV && (
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Upload a new version</h3>
          <div className="flex items-center space-x-2">
            <label htmlFor="cv-upload-new" className="flex-1">
              <Button variant="outline" className="w-full" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Select New File"}
              </Button>
            </label>
            <input
              id="cv-upload-new"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        </div>
      )}
    </div>
  )
}
