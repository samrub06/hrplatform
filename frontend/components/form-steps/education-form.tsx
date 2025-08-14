"use client"

import type { FormValues } from "@/components/form-steps/multi-step-form"
import { format } from "date-fns"
import { CalendarIcon, GraduationCapIcon, MinusCircleIcon, PlusCircleIcon } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { Button } from "@/components/common/button"
import { Calendar } from "@/components/common/calendar"
import { Card, CardContent } from "@/components/common/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/common/form"
import { Input } from "@/components/common/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/popover"
import { Textarea } from "@/components/common/textarea"

export function EducationForm() {
  const { control, trigger } = useFormContext<FormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  })

  const handleAddEducation = async () => {
    if (fields.length > 0) {
      const lastIndex = fields.length - 1
      const isValid = await trigger(`education.${lastIndex}.institution`) && 
                     await trigger(`education.${lastIndex}.degree`)
      
      if (!isValid) {
        return
      }
    }

    append({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      period: [new Date(), new Date()],
      description: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Education History</h2>
        <p className="text-muted-foreground">Tell us about your educational background</p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative overflow-hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="absolute right-2 top-2"
            >
              <MinusCircleIcon className="h-5 w-5 text-destructive" />
            </Button>

            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={control}
                    name={`education.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <GraduationCapIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input className="pl-10" placeholder="University name" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input placeholder="Bachelor of Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={`education.${index}.fieldOfStudy`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={control}
                    name={`education.${index}.period.0`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`education.${index}.period.1`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={`education.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your studies, achievements, etc."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleAddEducation}
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t added any education yet. Click the button above to add your educational background.
          </p>
        </div>
      )}
    </div>
  )
}