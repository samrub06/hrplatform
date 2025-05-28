"use client"

import { useState } from "react"
import { X, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
      toast({
        title: "Skill already added",
        description: `${skill.name} is already in your skills list.`,
        variant: "destructive",
      })
      return
    }

    const updatedSkills = [...skills, skill]
    setSkills(updatedSkills)
    onUpdate(updatedSkills)
    setNewSkill("")
    setOpen(false)

    toast({
      title: "Skill added",
      description: `${skill.name} has been added to your skills.`,
    })
  }

  const addCustomSkill = () => {
    if (!newSkill.trim()) return

    if (skills.some((s) => s.name.toLowerCase() === newSkill.toLowerCase())) {
      toast({
        title: "Skill already added",
        description: `${newSkill} is already in your skills list.`,
        variant: "destructive",
      })
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

    toast({
      title: "Skill added",
      description: `${customSkill.name} has been added to your skills.`,
    })
  }

  const removeSkill = (skillId: string) => {
    const updatedSkills = skills.filter((skill) => skill.id !== skillId)
    setSkills(updatedSkills)
    onUpdate(updatedSkills)

    toast({
      title: "Skill removed",
      description: "The skill has been removed from your profile.",
    })
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
