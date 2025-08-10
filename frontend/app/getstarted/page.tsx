"use client"
import { MultiStepForm } from "@/components/form-steps/multi-step-form"
import RecruiterForm from "@/components/form-steps/recruiter-form"
import RoleSelectionForm from "@/components/form-steps/role-selection-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)

  // Initialize role from URL params on component mount
  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam && ['recruiter', 'candidate', 'referee'].includes(roleParam)) {
      setRole(roleParam)
    }
  }, [searchParams])

  // Update URL when role changes
  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole)
    const params = new URLSearchParams(searchParams)
    params.set('role', selectedRole)
    router.push(`?${params.toString()}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start ">
      <div className="w-11/12 max-w-3xl p-3 md:p-5">
        {!role && (
          <RoleSelectionForm onSelectRole={handleRoleSelect} />
        )}
        {role === "recruiter" && <RecruiterForm />}
        {(role === "candidate" || role === "referee") && <MultiStepForm />}
      </div>
    </main>
  )
}
