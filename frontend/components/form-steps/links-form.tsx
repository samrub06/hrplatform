"use client"

import type { FormValues } from "@/components/multi-step-form"
import { GithubIcon, LinkedinIcon, PhoneIcon } from "lucide-react"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"

export function LinksForm() {
  const { control } = useFormContext<FormValues>()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Contact Information</h2>
        <p className="text-muted-foreground">How can potential employers reach you?</p>
      </div>

      <FormField
        control={control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input className="pl-10" placeholder="+1 (555) 123-4567" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="github_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GitHub Profile</FormLabel>
            <FormControl>
              <div className="relative">
                <GithubIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input className="pl-10" placeholder="https://github.com/username" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="linkedin_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile</FormLabel>
            <FormControl>
              <div className="relative">
                <LinkedinIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input className="pl-10" placeholder="https://linkedin.com/in/username" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
