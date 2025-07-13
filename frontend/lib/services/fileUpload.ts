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

export interface ExtractedCVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  skills: {
    name: string;
    yearsOfExperience: number;
  }[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
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
 * Extract CV data from uploaded file
 */
export async function extractCVData(fileName: string): Promise<ExtractedCVData> {
  const response = await fetch('/api/cv/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to extract CV data');
  }

  return response.json();
}

/**
 * Save CV data to database
 */
export async function saveCVData(fileName: string): Promise<{ id: string; fileName: string }> {
  const response = await fetch('/api/cv/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save CV data');
  }

  return response.json();
}

/**
 * Complete file upload process with progress tracking and CV extraction
 */
export async function uploadFile({
  file,
  fileKey,
  onProgress
}: UploadFileParams): Promise<{ success: boolean; fileName: string; extractedData?: ExtractedCVData }> {
  try {
    // Generate presigned URL
    const { presignedUrl } = await generatePresignedUrl(
      file.name,
      fileKey
    );

    // Upload file to S3
    await uploadFileWithPresignedUrl(file, presignedUrl, onProgress);

    // save cv in db
    const updateResponse = await fetch('/api/cv/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName: file.name }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update user profile');
    }

    // Extract CV data if it's a CV file
    let extractedData: ExtractedCVData | undefined;
    if (fileKey === 'cv') {
      try {
        extractedData = await extractCVData(file.name);
      } catch (error) {
        console.warn('CV extraction failed, but upload was successful:', error);
      }
    }

    return {
      success: true,
      fileName: file.name,
      extractedData
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