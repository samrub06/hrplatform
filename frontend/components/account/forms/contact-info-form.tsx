"use client"

import { Button } from "@/components/common/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/common/form"
import { Input } from "@/components/common/input"
import { useContactForm } from "@/lib/hooks/useContactForm"
import { UserData } from "@/lib/types"

interface ContactInfoFormProps {
  userData: Pick<UserData, 'email' | 'phone_number' | 'github_link' | 'linkedin_link' >
}

export default function ContactInfoForm({ userData }: ContactInfoFormProps) {
  const {
    form,
    isSubmitting,
    handleSubmit
  } = useContactForm(userData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Manage your contact details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormDescription>This is your primary contact email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 123-4567" {...field} />
              </FormControl>
              <FormDescription>Your phone number will only be used for important notifications.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="github_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Profile</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>




        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
