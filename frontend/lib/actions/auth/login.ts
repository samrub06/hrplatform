'use server'

import { AuthDAL } from '@/lib/dal/auth'
import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

type ActionResult = { success: boolean; error: string | null; redirect?: string }

interface LoginRequestDto { 
  email: string; 
  password: string 
}

const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

interface DecodedToken {
  roleId?: string | null;
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

export async function loginActionDirect(formData: FormData): Promise<void> {
  const result = await loginAction({ error: null, success: false }, formData)
  if (result.success) {
    redirect(result.redirect || '/dashboard')
  }
  redirect('/login?error=1')
} 