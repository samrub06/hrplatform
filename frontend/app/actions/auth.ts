'use server'
import { backendFetch } from '@/lib/backendFetch'
import { AuthDAL } from '@/lib/dal/auth'
import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

type ActionResult = { success: boolean; error: string | null; redirect?: string }

interface LoginRequestDto { email: string; password: string }
const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

interface DecodedToken {
  roleId?: string | null;
}

export async function loginActionDirect(formData: FormData): Promise<void> {
  const result = await loginAction({ error: null, success: false }, formData)
  if (result.success) {
    redirect(result.redirect || '/dashboard')
  }
  redirect('/login?error=1')
}


// Delegate login to DAL
async function performLogin(credentials: LoginRequestDto) {
  return AuthDAL.login(credentials)
}

export async function loginAction(prevState: { error: string | null; success: boolean }, formData: FormData): Promise<ActionResult> {
  const raw = {
    email: (formData.get('email') as string) || '',
    password: (formData.get('password') as string) || ''
  }
  const parsed = LoginSchema.safeParse(raw)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || 'Invalid form data'
    return { success: false, error: message }
  }

  try {
    const response = await performLogin(parsed.data);
    console.log('🔴 Response in loginAction:', response);
    const { accessToken, refreshToken } = response;

    // Store tokens in HTTP-only cookies
    const cookieStore = await cookies();
    
    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    // Use backend-compatible cookie name for refresh token
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    
    // Decode JWT to check for roleId (server-safe)
    const decoded = decodeJwt(accessToken) as DecodedToken
    const hasRoleId = decoded?.roleId !== null && decoded?.roleId !== undefined;
    
    return {
      success: true,
      error: null,
      redirect: hasRoleId ? '/dashboard' : '/getstarted'
    };
  } catch (error: unknown) {
    console.log('🔴 Error in loginAction:', error);
    const message = error instanceof Error ? error.message : 'An error occurred during login'
    return {
      error: message,
      success: false
    };
  }
}

export type SignupState = ActionResult;

export async function signupAction(prevState: SignupState, formData: FormData): Promise<SignupState> {
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
  const { email, password, confirmPassword, firstName, lastName } = parsed.data

  try {
    await backendFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        password_confirmation: confirmPassword,
        first_name: firstName,
        last_name: lastName
      })
    })
    // If not 200, backendFetch already threw. res is parsed JSON here.

    
    return {
      success: true,
      error: null,
      redirect: '/getstarted'
    };
  } catch (error) {
    console.log('🔴 Error in signupAction:', error);
    let message = 'An error occurred during signup'
    if (typeof error === 'object' && error !== null && 'message' in error) {
      const errObj = error as Record<string, unknown>
      if (typeof errObj.message === 'string') message = errObj.message
    }
    return {
      error: message,
      success: false
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    // Clear cookies
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('refresh_token');
    
    return {
      success: true,
      error: null,
      redirect: '/login'
    };
  } catch (error) {
    console.log('🔴 Error in logoutAction:', error);
    return {
      error: "An error occurred during logout",
      success: false
    };
  }
}

// Removed legacy validateFormData helper; Zod schemas are used instead
