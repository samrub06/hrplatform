import { MultiStepForm } from "@/components/multi-step-form"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 md:p-5">
      <div className="w-full max-w-3xl">
        <h1 className="mb-2 text-center text-3xl font-bold">User Profile</h1>
        <MultiStepForm />
      </div>
    </main>
  )
}
