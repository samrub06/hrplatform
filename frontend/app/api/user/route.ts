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
    console.log('🔴 Response in PATCH /user:', response.data);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.log('🔴 Error in PATCH /user:', error);
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const user = await AuthDAL.getUser();
    
    if (!user?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const response = await axiosInstance.get('/user');
    
    return NextResponse.json(response.data);
  } catch (error) {
    return handleApiError(error);
  }
} 