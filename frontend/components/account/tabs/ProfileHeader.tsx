"use client"

import { Card, CardContent } from "@/components/common/card"
import type { UserData } from "@/lib/types"
import ProfilePictureUpload from "../profile-picture-upload"

interface ProfileHeaderProps {
  userData: UserData
  onUpdateProfilePicture: (url: string) => void
}

export default function ProfileHeader({ userData, onUpdateProfilePicture }: ProfileHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Photo section - plus fin */}
      <Card className="md:col-span-1">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <ProfilePictureUpload
              currentPicture={userData.profilePicture}
              onUpdate={onUpdateProfilePicture}
            />
            <h2 className="text-xl font-semibold mt-4 text-center">
              {userData.first_name} {userData.last_name}
            </h2>
            <p className="text-muted-foreground text-center">{userData.role || "No role specified"}</p>
            <p className="text-sm text-muted-foreground mt-1 text-center">{userData.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Section info étendue - plus large */}
      <Card className="md:col-span-3">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Profile Information</h3>
              <p className="text-muted-foreground">
                Use the tabs below to manage your account settings and personal information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}