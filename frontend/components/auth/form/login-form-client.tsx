'use client'

// Small client-only form that uses useActionState to get loading and error states
import { loginAction } from '@/app/actions/auth'
import { Button } from '@/components/common/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/common/form'
import { Icons } from '@/components/common/icons'
import { Input } from '@/components/common/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginState = {
  error: string | null
  success: boolean
  redirect?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Login in progress...
        </>
      ) : (
        'Login'
      )}
    </Button>
  )
}

export default function LoginFormClient() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, { error: null, success: false })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (state.success) {
      const redirectUrl = state.redirect || '/dashboard'
      window.location.href = redirectUrl
    }
  }, [state.success, state.redirect])

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {state?.error && <div className="text-sm text-red-500 text-center">{state.error}</div>}
        <SubmitButton />
      </form>
    </Form>
  )
}

