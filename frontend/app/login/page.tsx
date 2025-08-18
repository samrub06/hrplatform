import { LoginForm } from "@/components/auth/form/login-form"
import OAuthButtonsClient from "@/components/auth/form/OAuthButtonsClient"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/common/card"
import { Separator } from "@/components/common/separator"
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"

export default function Page({ searchParams }: { searchParams?: { error?: string } }) {
  const hasError = searchParams?.error
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </Link>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <OAuthButtonsClient />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
        
            <LoginForm error={hasError} />
           
          </CardContent>
      
        </Card>
      </div>
    </div>
  )
}
