"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar'
import { Button } from '@/components/common/button'
import { type ProfileHeaderProps } from '@/interfaces/account.interface'
import { updateProfilePictureAction } from '@/lib/actions/account'
import { Camera, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ProfileHeader({ userData, onUpdateProfilePicture }: ProfileHeaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const initials = `${userData.first_name?.[0] || ''}${userData.last_name?.[0] || ''}`.toUpperCase()
  
  // Handle file selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }
  
  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return
    
    setIsUploading(true)
    try {
      // Create FormData for the upload
      const formData = new FormData()
      formData.append('profilePicture', selectedFile)
      
      // Call the server action
      const result = await updateProfilePictureAction({ success: false, error: null }, formData)
      
      if (result.success) {
        toast.success('Profile picture updated successfully!')
        // Update the preview with the new URL
        if (onUpdateProfilePicture) {
          onUpdateProfilePicture(previewUrl || '')
        }
        // Reset state
        setSelectedFile(null)
        setPreviewUrl(null)
      } else {
        toast.error(result.error || 'Failed to update profile picture')
      }
    } catch {
      toast.error('An error occurred while uploading')
    } finally {
      setIsUploading(false)
    }
  }
  
  // Cancel upload
  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }
  
  return (
    <div className="flex items-center space-x-6 mb-8 p-6 bg-card rounded-lg border">
      <div className="relative">
        <Avatar className="h-20 w-20">
          <AvatarImage 
            src={previewUrl || userData.profilePicture} 
            alt={`${userData.first_name} ${userData.last_name}`} 
          />
          <AvatarFallback className="text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload button */}
        <Button
          size="sm"
          variant="outline"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (file) {
                handleFileSelect(file)
              }
            }
            input.click()
          }}
          disabled={isUploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Upload actions */}
      {selectedFile && (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex-1">
        <h2 className="text-2xl font-bold">
          {userData.first_name} {userData.last_name}
        </h2>
        <p className="text-muted-foreground">
          {userData.current_position && userData.current_company 
            ? `${userData.current_position} at ${userData.current_company}`
            : userData.email
          }
        </p>
        {userData.role && (
          <p className="text-sm text-muted-foreground capitalize">
            {userData.role}
          </p>
        )}
      </div>
    </div>
  )
} 