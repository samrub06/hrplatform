'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  
  // Clear authentication cookies
  cookieStore.delete('accessToken')
  cookieStore.delete('refresh_token')
  
  // Redirect to login page
  redirect('/login')
} 