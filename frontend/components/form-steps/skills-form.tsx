"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import type { FormValues } from "@/components/multi-step-form"
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface SkillsFormProps {
//   form: UseFormReturn<FormValues>
// }

export function SkillsForm() {
  const { control } = useFormContext<FormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  })

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">What are your skills?</h2>
        <p className="text-muted-foreground">Add your technical and professional skills</p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start space-x-2">
            <div className="grid flex-1 gap-2 md:grid-cols-2">
              <FormField
                control={control}
                name={`skills.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Skill name (e.g. JavaScript)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`skills.${index}.years_of_experience`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Years of experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Less than 1 year</SelectItem>
                          <SelectItem value="1">1 year</SelectItem>
                          <SelectItem value="2">2 years</SelectItem>
                          <SelectItem value="3">3 years</SelectItem>
                          <SelectItem value="4">4 years</SelectItem>
                          <SelectItem value="5">5 years</SelectItem>
                          <SelectItem value="6">6+ years</SelectItem>
                          <SelectItem value="10">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-1">
              <MinusCircleIcon className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => append({ name: "", years_of_experience: 0 })}
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            You haven't added any skills yet. Click the button above to add your first skill.
          </p>
        </div>
      )}
    </div>
  )
}
