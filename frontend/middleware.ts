import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// List of public routes that don't require authentication
// Everything else is protected by default
const PUBLIC_ROUTES = [
  'auth/login',
  'auth/register',
  'auth/google/callback',
  'auth/linkedin/callback',
  'auth/forgot-password',
  'auth/reset-password',
  'api/auth',
  '',
  'login',
  'signup',
  'getstarted'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('🔍 Middleware running for:', pathname)

  // Remove leading slash for comparison
  const cleanPathname = pathname.startsWith('/') ? pathname.slice(1) : pathname

  // Check if the route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => {
    if (route === '' || route === 'login') {
      return cleanPathname === route
    }
    return cleanPathname.startsWith(route)
  })
    
  // If it's a public route, allow access
  if (isPublicRoute) {
    console.log('✅ Public route - allowing access')
    return NextResponse.next()
  }
  
  // Everything else is protected - check authentication
  const accessToken = request.cookies.get('accessToken')
  
  console.log('🔒 Protected route - pathname:', pathname)
  console.log('🔒 All cookies:', request.cookies.getAll().map(c => c.name))
  console.log('🔒 accessToken found:', accessToken ? 'YES' : 'NO')
  
  if (!accessToken) {
    console.log('❌ No token - redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  console.log('✅ Token present - allowing access')
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|apple-touch-icon|.well-known).*)'
  ],
} 