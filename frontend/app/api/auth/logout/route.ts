import { AuthDAL } from '@/lib/dal/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Logout using AuthDAL
    await AuthDAL.logout();

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in /api/auth/logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 