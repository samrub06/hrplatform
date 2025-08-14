"use client"

import { Button } from "@/components/common/button"
import { Calendar } from "@/components/common/calendar"
import { Card, CardContent } from "@/components/common/card"
import { Checkbox } from "@/components/common/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/common/form"
import { Input } from "@/components/common/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/popover"
import { Textarea } from "@/components/common/textarea"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface EducationItem {
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: Date
  endDate?: Date | null
  description?: string
}

interface EducationFormProps {
  education: EducationItem[]
  onUpdate: (education: EducationItem[]) => void
}

const educationItemSchema = z.object({
  institution: z.string().min(2, {
    message: "Institution name must be at least 2 characters.",
  }),
  degree: z.string().min(2, {
    message: "Degree must be at least 2 characters.",
  }),
  fieldOfStudy: z.string().min(2, {
    message: "Field of study must be at least 2 characters.",
  }),
  startDate: z.date(),
  endDate: z.date().optional(),
  currentlyStudying: z.boolean().optional(),
  description: z.string().optional(),
})

export default function EducationForm({ education, onUpdate }: EducationFormProps) {
  const [educationList, setEducationList] = useState<EducationItem[]>(education)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof educationItemSchema>>({
    resolver: zodResolver(educationItemSchema),
    defaultValues: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: new Date(),
      currentlyStudying: false,
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof educationItemSchema>) {
    setIsSubmitting(true)

    const educationItem: EducationItem = {
      institution: values.institution,
      degree: values.degree,
      fieldOfStudy: values.fieldOfStudy,
      startDate: values.startDate,
      endDate: values.currentlyStudying ? null : values.endDate || null,
      description: values.description,
    }

    let updatedList: EducationItem[]

    if (editingIndex !== null) {
      updatedList = [...educationList]
      updatedList[editingIndex] = educationItem
    } else {
      updatedList = [...educationList, educationItem]
    }

    setTimeout(() => {
      setEducationList(updatedList)
      onUpdate(updatedList)
      setIsSubmitting(false)
      setEditingIndex(null)
      form.reset({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: new Date(),
        currentlyStudying: false,
        description: "",
      })
      toast.success("Education updated")
    }, 1000)
  }

  function editEducation(index: number) {
    const item = educationList[index]
    setEditingIndex(index)
    form.reset({
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy,
      startDate: new Date(item.startDate),
      endDate: item.endDate ? new Date(item.endDate) : undefined,
      currentlyStudying: !item.endDate,
      description: item.description || "",
    })
  }

  function removeEducation(index: number) {
    const updatedList = [...educationList]
    updatedList.splice(index, 1)
    setEducationList(updatedList)
    onUpdate(updatedList)
    toast.success("Education removed")
  }

  return (
    <div className="space-y-8">
      {educationList.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Education History</h3>
          {educationList.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{item.institution}</h4>
                    <p className="text-muted-foreground">
                      {item.degree} in {item.fieldOfStudy}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(item.startDate), "MMM yyyy")} -{" "}
                      {item.endDate ? format(new Date(item.endDate), "MMM yyyy") : "Present"}
                    </p>
                    {item.description && <p className="mt-2 text-sm">{item.description}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => editEducation(index)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeEducation(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">{editingIndex !== null ? "Edit Education" : "Add Education"}</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. University of Technology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bachelor's" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "MMMM yyyy") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentlyStudying"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I am currently studying here</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {!form.watch("currentlyStudying") && (
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "MMMM yyyy") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || (form.watch("startDate") && date < form.watch("startDate"))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your studies, achievements, etc."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional details about your education.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              {editingIndex !== null && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingIndex(null)
                    form.reset({
                      institution: "",
                      degree: "",
                      fieldOfStudy: "",
                      startDate: new Date(),
                      currentlyStudying: false,
                      description: "",
                    })
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingIndex !== null ? "Update Education" : "Add Education"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
