import axiosInstance from '@/lib/axiosInstance';
import { AuthDAL } from '@/lib/dal/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Save CV data to database
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await AuthDAL.getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fileName } = body;
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing required field: fileName' }, 
        { status: 400 }
      );
    }

    // Save CV data to backend
    const response = await axiosInstance.post('/cv/save', {
      userId,
      fileName
    });
    
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Error saving CV data:', error);
    
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