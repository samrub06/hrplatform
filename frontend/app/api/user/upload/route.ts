import axiosInstance from '@/lib/axiosInstance';
import { AuthDAL } from '@/lib/dal/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate presigned URL for file upload
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
    const { fileName, fileKey } = body;
    
    if (!fileName || !fileKey) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, fileKey' }, 
        { status: 400 }
      );
    }

    // Generate presigned URL from backend
    const response = await axiosInstance.post('/user/presigned-url', {
      fileName,
      fileKey,
      folderUserId: userId
    });
    
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Error generating presigned URL:', error);
    
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