import axiosInstance from '@/lib/axiosInstance';
import { AuthDAL } from '@/lib/dal/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Upload file to AWS S3 using presigned URL
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileKey = formData.get('fileKey') as string;
    
    if (!file || !fileKey) {
      return NextResponse.json(
        { error: 'Missing required fields: file, fileKey' }, 
        { status: 400 }
      );
    }

    // Generate presigned URL
    const presignedResponse = await axiosInstance.post('/user/presigned-url', {
      fileName: file.name,
      fileKey,
      folderUserId: userId
    });

    const { presignedUrl } = presignedResponse.data;

    // Upload to S3 using presigned URL
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to S3');
    }

    // Update user profile with file information
    const updateResponse = await axiosInstance.patch(`/user/${userId}`, {
      [fileKey]: file.name
    });

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileKey,
      userData: updateResponse.data
    });
    
  } catch (error: unknown) {
    console.error('Error uploading file:', error);
    
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