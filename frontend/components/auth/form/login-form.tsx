
import LoginFormClient from "@/components/auth/form/LoginFormClient"
import { cn } from "@/lib/utils"
import Link from "next/link"



export function LoginForm({
  className,
  error,
  ...props
}: React.ComponentProps<"div"> & { error?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {error && (
        <div className="text-sm text-red-500 text-center">
          Invalid email or password. Please try again.
        </div>
      )}
      <LoginFormClient />
      <div className="text-sm text-muted-foreground text-center w-full">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  )
}
