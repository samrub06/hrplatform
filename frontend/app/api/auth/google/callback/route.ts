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
  
  try {
    const body = await request.json();
    
    const { token } = body;
      if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }


    const cookieStore = await cookies();
    
    cookieStore.set('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 60 * 60, // 3 heures
      path: '/'
    });


    // Decode the JWT token to check for roleId
    const decoded = jwt.decode(token) as DecodedToken;
    const hasRoleId = decoded?.roleId !== null && decoded?.roleId !== undefined;
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