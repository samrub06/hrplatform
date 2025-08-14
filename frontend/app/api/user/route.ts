import { handleApiError } from '@/lib/apiErrorHandler';
import axiosInstance from '@/lib/axiosInstance';
import { AuthDAL } from '@/lib/dal/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const userId = await AuthDAL.getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const response = await axiosInstance.patch(`/user/${userId}`, body);
    
    return NextResponse.json(response.data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    // Get cookies directly without cache
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token' }, 
        { status: 401 }
      );
    }
    
    // Decode JWT to get user ID
    const { jwtDecode } = await import('jwt-decode')
    const decoded = jwtDecode(token) as { id: string }
    const userId = decoded?.id
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token' }, 
        { status: 401 }
      );
    }
    
    const response = await axiosInstance.get('/api/user/' + userId);
    
    return NextResponse.json(response.data);
  } catch (error) {
    return handleApiError(error);
  }
} 