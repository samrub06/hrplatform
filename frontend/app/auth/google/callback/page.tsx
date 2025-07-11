// frontend/app/auth/google/callback/page.tsx
"use client"

import { Icons } from '@/components/icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token')
        const error = searchParams.get('error')

        if (error) {
          setError('Authentication failed. Please try again.')
          setStatus('error')
          return
        }

        if (!token) {
          setError('No access token received')
          setStatus('error')
          return
        }

        const response = await fetch('/api/auth/google/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to set authentication token' + response.statusText)
        }

        const data = await response.json()
        console.log('API response:', data)
        
        setStatus('success')
        setTimeout(() => {
          router.push(data.redirectUrl || '/dashboard')
        }, 1500)
        
      } catch (err) {
        console.error('Google callback error:', err)
        setError('Failed to complete authentication. Please try again.')
        setStatus('error')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Completing authentication...'}
            {status === 'success' && 'Authentication successful!'}
            {status === 'error' && 'Authentication failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we complete your login'}
            {status === 'success' && 'Redirecting you...'}
            {status === 'error' && 'There was an issue with your authentication'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="flex justify-center">
              <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex justify-center text-green-600">
              <Icons.check className="h-8 w-8" />
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex justify-center text-red-600">
                <Icons.alertCircle className="h-8 w-8" />
              </div>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => router.push('/login')}
                className="text-sm text-primary hover:underline"
              >
                Return to login
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}