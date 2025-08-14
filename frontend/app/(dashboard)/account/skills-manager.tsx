"use client"

import { Badge } from "@/components/common/badge"
import { Button } from "@/components/common/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/common/command"
import { Input } from "@/components/common/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/popover"
import { toast } from "@/hooks/use-toast"
import { Plus, Search, X } from "lucide-react"
import { useState } from "react"

interface Skill {
  id: string
  name: string
}

interface SkillsManagerProps {
  userSkills: Skill[]
  onUpdate: (skills: Skill[]) => void
}

// Sample available skills for demonstration
const availableSkills: Skill[] = [
  { id: "1", name: "React" },
  { id: "2", name: "TypeScript" },
  { id: "3", name: "CSS" },
  { id: "4", name: "Node.js" },
  { id: "5", name: "Python" },
  { id: "6", name: "MongoDB" },
  { id: "7", name: "PostgreSQL" },
  { id: "8", name: "AWS" },
  { id: "9", name: "Docker" },
  { id: "10", name: "Kubernetes" },
  { id: "11", name: "UI/UX" },
  { id: "12", name: "Figma" },
  { id: "13", name: "Java" },
  { id: "14", name: "C#" },
  { id: "15", name: "PHP" },
]

export default function SkillsManager({ userSkills, onUpdate }: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>(userSkills)
  const [newSkill, setNewSkill] = useState("")
  const [open, setOpen] = useState(false)

  const addSkill = (skill: Skill) => {
    if (skills.some((s) => s.id === skill.id)) {
      toast.error(`${skill.name} is already in your skills list.`)
      return
    }

    const newSkills = [...skills, skill]
    onUpdate(newSkills)
    toast.success(`${skill.name} added to your skills`)
  }

  const addCustomSkill = () => {
    if (!newSkill.trim()) return

    if (skills.some((s) => s.name.toLowerCase() === newSkill.toLowerCase())) {
      toast.error(`${newSkill} is already in your skills list.`)
      return
    }

    const customSkill: Skill = {
      id: `custom-${Date.now()}`,
      name: newSkill.trim(),
    }

    const updatedSkills = [...skills, customSkill]
    setSkills(updatedSkills)
    onUpdate(updatedSkills)
    setNewSkill("")

    toast.success(`${customSkill.name} has been added to your skills.`)
  }

  const removeSkill = (skillId: string) => {
    const newSkills = skills.filter((s) => s.id !== skillId)
    onUpdate(newSkills)
    toast.success("Skill removed from your list")
  }

  // Filter out skills that the user already has
  const filteredSkills = availableSkills.filter((skill) => !skills.some((s) => s.id === skill.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                {skills.length === 0 ? "Add skills" : "Add more skills"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start" side="bottom" sideOffset={5}>
              <Command>
                <CommandInput placeholder="Search skills..." />
                <CommandList>
                  <CommandEmpty>
                    <div className="p-2">
                      <p className="text-sm text-muted-foreground">No skill found.</p>
                      <div className="mt-2 flex items-center">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add custom skill"
                          className="flex-1"
                        />
                        <Button size="sm" className="ml-2" onClick={addCustomSkill} disabled={!newSkill.trim()}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CommandEmpty>
                  <CommandGroup heading="Available Skills">
                    {filteredSkills.map((skill) => (
                      <CommandItem key={skill.id} onSelect={() => addSkill(skill)} className="cursor-pointer">
                        {skill.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills added yet. Add skills to showcase your expertise.</p>
          ) : (
            skills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="px-3 py-1 text-sm">
                {skill.name}
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium">Add Custom Skill</h3>
        <div className="flex space-x-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter a skill not in the list"
            className="flex-1"
          />
          <Button onClick={addCustomSkill} disabled={!newSkill.trim()}>
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
