"use client"

import { Button } from "@/components/common/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/common/form"
import { Input } from "@/components/common/input"
import { Slider } from "@/components/common/slider"
import { useProfessionalForm } from "@/lib/hooks/useProfessionalForm"
import { UserData } from "@/lib/types"

interface ProfessionalInfoFormProps {
  userData: Pick<UserData, 'role' | 'current_position' | 'current_company' | 'desired_position' | 'salary_expectation' | 'years_experience'>
}

export default function ProfessionalInfoForm({ userData }: ProfessionalInfoFormProps) {
  const {
    form,
    isSubmitting,
    handleSubmit
  } = useProfessionalForm(userData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Information</CardTitle>
        <CardDescription>Update your career details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Role</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Software Developer" {...field} />
                </FormControl>
                <FormDescription>Your primary professional title.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="years_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={50}
                    step={1}
                    defaultValue={[field.value || 0]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="current_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Position</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Senior Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Company</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="desired_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Position</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Lead Developer" {...field} />
                </FormControl>
                <FormDescription>The role you&apos;re aiming for in your career.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary_expectation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Expectation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. $120,000" {...field} />
                </FormControl>
                <FormDescription>Your expected compensation range.</FormDescription>
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
