'use server'

import { AuthDAL } from '@/lib/dal/auth';
import { z } from 'zod';

export type SignupState = { success: boolean; error: string | null; redirect?: string }

const SignupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must contain at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must contain at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export async function registerAction(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const raw = {
    email: (formData.get('email') as string) || '',
    password: (formData.get('password') as string) || '',
    confirmPassword: (formData.get('confirmPassword') as string) || '',
    firstName: (formData.get('firstName') as string) || '',
    lastName: (formData.get('lastName') as string) || ''
  }

  const parsed = SignupSchema.safeParse(raw)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid form data'
    return { success: false, error: message }
  }

  try {
    await AuthDAL.register({
      email: parsed.data.email,
      password: parsed.data.password,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName
    })

    return {
      success: true,
      error: null,
      redirect: '/login?registered=true'
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred during registration'
    return {
      error: message,
      success: false
    }
  }
} 