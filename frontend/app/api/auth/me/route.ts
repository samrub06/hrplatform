import { AuthDAL } from '@/lib/dal/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await AuthDAL.getUserBasic();
    
    if (!user?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user.userId,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    console.error('Error in GET /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 