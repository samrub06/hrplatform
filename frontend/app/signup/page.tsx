import { SignupForm } from "@/components/auth/form/signup-form"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link href="/" className="flex items-center gap-2 self-center font-medium">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <span className="text-lg">A</span>
        </div>
        <span>Acme Inc.</span>
      </Link>
      <SignupForm />
    </div>
  )
}
