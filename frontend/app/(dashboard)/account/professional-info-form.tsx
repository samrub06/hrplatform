"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"

interface ProfessionalInfoFormProps {
  userData: any
  onUpdate: (data: any) => void
}

const formSchema = z.object({
  role: z.string().optional(),
  current_position: z.string().optional(),
  current_company: z.string().optional(),
  desired_position: z.string().optional(),
  salary_expectation: z.string().optional(),
  years_of_experience: z.number().min(0).max(50).optional(),
})

export default function ProfessionalInfoForm({ userData, onUpdate }: ProfessionalInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: userData.role || "",
      current_position: userData.current_position || "",
      current_company: userData.current_company || "",
      desired_position: userData.desired_position || "",
      salary_expectation: userData.salary_expectation || "",
      years_of_experience: userData.years_of_experience || 0,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onUpdate(values)
      setIsSubmitting(false)
      toast({
        title: "Professional info updated",
        description: "Your professional information has been updated successfully.",
      })
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="years_of_experience"
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
                <FormDescription>The role you're aiming for in your career.</FormDescription>
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
  )
}
