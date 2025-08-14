import { Suspense } from 'react'
import AccountSettingsPage from './page-client'

// Loading component for better UX
function AccountLoading() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading account settings...</p>
        </div>
      </div>
    </div>
  )
}

// Main page component - Server Component
export default async function AccountPage() {
  try {
    // Get cookies to extract token
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    
    if (!token) {
      throw new Error('No access token found')
    }
    
    // Call NestJS /user/me endpoint directly
    const response = await fetch('http://localhost:3000/api/user/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const userData = await response.json()
    
    return (
      <Suspense fallback={<AccountLoading />}>
        <AccountSettingsPage initialUserData={userData} />
      </Suspense>
    )
  } catch {
    // Return loading state if server-side fetch fails
    return <AccountLoading />
  }
} 