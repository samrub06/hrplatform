/**
 * File upload service for handling presigned URL uploads
 */

export interface PresignedUrlResponse {
  presignedUrl: string;
}

export interface UploadFileParams {
  file: File;
  fileKey: 'cv' | 'profilePicture';
  onProgress?: (progress: number) => void;
}

/**
 * Generate presigned URL for file upload
 */
export async function generatePresignedUrl(
  fileName: string,
  fileKey: string
): Promise<PresignedUrlResponse> {
  const response = await fetch('/api/user/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName,
      fileKey,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate presigned URL');
  }

  return response.json();
}

/**
 * Upload file using presigned URL
 */
export async function uploadFileWithPresignedUrl(
  file: File,
  presignedUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}

/**
 * Complete file upload process with progress tracking
 */
export async function uploadFile({
  file,
  fileKey,
  onProgress
}: UploadFileParams): Promise<{ success: boolean; fileName: string }> {
  try {
    // Generate presigned URL
    const { presignedUrl } = await generatePresignedUrl(
      file.name,
      fileKey
    );

    // Upload file to S3
    await uploadFileWithPresignedUrl(file, presignedUrl, onProgress);

    // Update user profile with file information
    const updateResponse = await fetch('/api/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [fileKey]: file.name
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update user profile');
    }

    return {
      success: true,
      fileName: file.name
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, maxSizeMB: number = 10): string | null {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size must be less than ${maxSizeMB}MB`;
  }

  // Check file type for CV
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (!allowedTypes.includes(file.type)) {
    return 'File must be PDF, DOC, DOCX, or TXT';
  }

  return null;
} 