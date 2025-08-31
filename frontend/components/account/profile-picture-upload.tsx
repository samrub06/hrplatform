"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/avatar"
import { Button } from "@/components/common/button"
import { toast } from "@/hooks/use-toast"
import { Camera, X } from "lucide-react"
import { useState } from "react"

interface ProfilePictureUploadProps {
  currentPicture?: string
  onUpdate: (url: string) => void
}

export default function ProfilePictureUpload({ currentPicture, onUpdate }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentPicture)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please upload an image file (JPEG, PNG, etc.)")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Please upload an image smaller than 5MB")
      return
    }

    setIsUploading(true)

    // Create a preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Simulate upload
    setTimeout(() => {
      // In a real app, you would upload the file to your server or a storage service
      // and get back a URL to the uploaded file
      const fakeUploadedUrl = URL.createObjectURL(file)
      onUpdate(fakeUploadedUrl)
      setIsUploading(false)
      toast.success("Profile picture updated successfully")
    }, 1500)
  }

  const removeProfilePicture = () => {
    setPreviewUrl(undefined)
    onUpdate("")
    toast.success("Profile picture removed successfully")
  }

  const getInitials = () => {
    // This is a placeholder. In a real app, you would get the user's initials from their name
    return "JD"
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={previewUrl || "/placeholder.svg"} />
          <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
        </Avatar>

        {previewUrl && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
            onClick={removeProfilePicture}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="absolute bottom-0 right-0">
          <label htmlFor="profile-picture-upload">
            <div className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center cursor-pointer">
              <Camera className="h-4 w-4" />
            </div>
          </label>
          <input
            id="profile-picture-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">{isUploading ? "Uploading..." : "Upload a profile picture"}</p>
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF, max 5MB</p>
      </div>
    </div>
  )
}
