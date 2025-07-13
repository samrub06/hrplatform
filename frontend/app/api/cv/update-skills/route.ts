import axiosInstance from '@/lib/axiosInstance';
import { AuthDAL } from '@/lib/dal/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Update CV skills for current user
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
    const { skills } = body;
    
    if (!skills || !Array.isArray(skills)) {
      return NextResponse.json(
        { error: 'Skills array is required' }, 
        { status: 400 }
      );
    }

    // Update CV skills in backend
    const response = await axiosInstance.put(`/cv/update-skills/${userId}`, {
      skills
    });
    
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Error updating CV skills:', error);
    
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
          { error: 'Bad Request - Invalid skill data' }, 
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