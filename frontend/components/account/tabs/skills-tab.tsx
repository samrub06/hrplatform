import { type UserData } from '@/lib/types'
import { SkillsForm } from './forms/skills-form'

interface SkillsTabProps {
  userDataSkills?: UserData['cv']
}

export default function SkillsTab({ userDataSkills }: SkillsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Skills</h3>
        <p className="text-sm text-muted-foreground">
          Manage your technical skills and proficiency levels.
        </p>
      </div>
      
      <SkillsForm 
        skillsData={userDataSkills}
      />
    </div>
  )
} 