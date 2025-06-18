"use client"

import type React from "react"

import type { FormValues } from "@/components/multi-step-form"
import { BriefcaseIcon, DollarSignIcon, UserIcon } from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useFormContext } from "react-hook-form"

export function PersonalInfoForm() {
  const { control, watch } = useFormContext<FormValues>()
  const role = watch("role")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File) => void) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center mb-2">
        <FormField
          control={control}
          name="profilePicture"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <div className="flex flex-col items-center gap-0.5">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={previewUrl || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <UserIcon className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="profile-picture"
                  className="cursor-pointer text-xs font-medium text-primary hover:underline"
                >
                  Upload photo
                </Label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileChange(e, onChange)
                    }
                  }}
                  value={field.value ? undefined : ""}
                  {...field}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <FormField
          control={control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john.doe@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {role === "candidate" && (
        <div className="space-y-2">
          <FormField
            control={control}
            name="desired_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Desired Position</FormLabel>
                <FormControl>
                  <div className="relative">
                    <BriefcaseIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-8" placeholder="Software Engineer" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="salary_expectation"
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel className="text-sm">Expected Salary (k₪/month)</FormLabel>
                <FormControl>
                  <div className="space-y-1">
                    <Slider
                      defaultValue={[value || 30]}
                      min={8}
                      max={70}
                      step={2}
                      onValueChange={(vals) => onChange(vals[0])}
                      {...fieldProps}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>8k₪</span>
                      <span>20k₪</span>
                      <span>30k₪</span>
                      <span>40k₪</span>
                      <span>50k₪</span>
                      <span>60k₪</span>
                      <span>70k₪</span>
                    </div>
                    <div className="text-center text-sm font-medium">{value || 30}k₪/month</div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {role === "publisher" && (
        <div className="space-y-2">
          <FormField
            control={control}
            name="current_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Current Position</FormLabel>
                <FormControl>
                  <div className="relative">
                    <BriefcaseIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-8" placeholder="Recruiter" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="current_company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Current Company</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-8" placeholder="Acme Inc." {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  )
}
