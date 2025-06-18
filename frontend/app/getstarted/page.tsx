"use client"
import RoleSelectionForm from "@/components/form-steps/role-selection-form"
import { MultiStepForm } from "@/components/multi-step-form"
import RecruiterForm from "@/components/recruiter-form"
import { useState } from "react"

export default function Page() {
  const [role, setRole] = useState<string | null>(null)

  return (
    <main className="flex min-h-screen flex-col items-center justify-start ">
      <div className="w-11/12 max-w-3xl p-3 md:p-5">
        {!role && (
          <RoleSelectionForm onSelectRole={setRole} />
        )}
        {role === "recruiter" && <RecruiterForm />}
        {(role === "candidate" || role === "referee") && <MultiStepForm />}
      </div>
    </main>
  )
}
