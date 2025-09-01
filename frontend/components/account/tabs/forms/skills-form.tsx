"use client"

import { Button } from "@/components/common/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/common/form"
import { Input } from "@/components/common/input"
import { Slider } from "@/components/common/slider"
import { useSkillsForm } from "@/lib/hooks/useSkillsForm"
import { UserData } from "@/lib/types"
import { getSkillLevelText } from "@/lib/validations/skills"
import { Plus, Trash2 } from "lucide-react"

interface SkillsFormProps {
  skillsData?: UserData['cv']
}

export function SkillsForm({ skillsData }: SkillsFormProps) {
  const {
    form,
    fields,
    isSubmitting,
    addSkill,
    removeSkill,
    handleSubmit
  } = useSkillsForm(skillsData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Expertise</CardTitle>
        <CardDescription>Showcase your technical and professional skills</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-end">
              <Button type="button" variant="outline" onClick={addSkill}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {fields.map((field, index) => (
                <div key={field.id} className="p-3 border rounded-md bg-card/50 space-y-2">
                  {/* Header compact avec skill name */}
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`skills.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input 
                              placeholder="React..." 
                              maxLength={12}
                              className="h-8 text-sm font-medium text-center border-0 bg-transparent focus:bg-background"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(index)}
                        className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Level compact */}
                  <FormField
                    control={form.control}
                    name={`skills.${index}.level`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Level</span>
                          <span className="text-xs font-semibold text-primary">
                            {field.value}/10
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                            className="w-full h-2"
                          />
                        </FormControl>
                        <div className="text-xs text-center text-muted-foreground mt-1">
                          {getSkillLevelText(field.value || 5)}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No skills added yet. Click &quot;Add Skill&quot; to get started.</p>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Skills"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 