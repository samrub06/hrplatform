// frontend/app/api/auth/google/callback/route.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface DecodedToken {
  email: string;
  id: string;
  roleId?: string | null;
}

export async function POST(request: NextRequest) {
  console.log('API route called!');
  
  try {
    const body = await request.json();
    console.log('Body received:', body);
    
    const { token } = body;
    console.log('Token received:', token);
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    console.log('Setting token in cookie:', token);

    const cookieStore = await cookies();
    
    // ✅ Stocker le token dans un cookie HttpOnly (sécurisé)
    cookieStore.set('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 60 * 60, // 3 heures
      path: '/'
    });

    console.log('Token stored successfully');

    // Decode the JWT token to check for roleId
    const decoded = jwt.decode(token) as DecodedToken;
    const hasRoleId = decoded?.roleId !== null && decoded?.roleId !== undefined;
    console.log('hasRoleId', decoded);
    // Redirect based on roleId presence
    const redirectUrl = hasRoleId ? '/dashboard' : '/getstarted';

    return NextResponse.json({ 
      success: true, 
      redirectUrl,
      hasRoleId 
    });
  } catch (error) {
    console.error('Error setting token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}