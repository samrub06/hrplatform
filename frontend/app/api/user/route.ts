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
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      
      if (axiosError.response?.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized' }, 
          { status: 401 }
        );
      }
      
      if (axiosError.response?.status === 403) {
        return NextResponse.json(
          { error: 'Forbidden' }, 
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
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
  } catch (error: unknown) {
    console.error('Error fetching user:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      
      if (axiosError.response?.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized' }, 
          { status: 401 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 