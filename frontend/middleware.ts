import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthDAL } from './lib/dal/auth';

// Liste des routes protégées
const protectedRoutes = ['/dashboard', '/referals', '/settings'];
// Liste des routes publiques
const publicRoutes = ['/login', '/register', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(pathname);

  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  console.log(isProtectedRoute);
  console.log(isPublicRoute);

  // Si ce n'est ni une route protégée ni une route publique, laisser passer
  if (!isProtectedRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  // Vérifier le token d'accès
  const session = await AuthDAL.verifySession(); 

  // Si c'est une route protégée et qu'il n'y a pas d'utilisateur
  if (isProtectedRoute && !session?.userId) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Si c'est une route publique et qu'il y a un utilisateur
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 