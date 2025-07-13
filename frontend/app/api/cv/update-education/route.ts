import axiosInstance from '@/lib/axiosInstance';
import { AuthDAL } from '@/lib/dal/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Update CV education for current user
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = await AuthDAL.getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { education } = body;
    
    if (!education || !Array.isArray(education)) {
      return NextResponse.json(
        { error: 'Education array is required' }, 
        { status: 400 }
      );
    }

    // Update CV education in backend
    const response = await axiosInstance.put(`/cv/update-education/${userId}`, {
      education
    });
    
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Error updating CV education:', error);
    
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

      if (axiosError.response?.status === 400) {
        return NextResponse.json(
          { error: 'Bad Request - Invalid education data' }, 
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 