import { AuthDAL } from '@/lib/dal/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get user session with permissions
    const user = await AuthDAL.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return user data with permissions
    return NextResponse.json({
      id: user.userId,
      email: user.email,
      role: user.role,
      permissions: user.permissions || []
    });

  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 