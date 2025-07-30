import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

export interface BackendError {
  message: string;
  statusCode: number;
  error?: string;
  stack?: string;
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Handle Axios errors (backend API calls)
  if (error instanceof AxiosError) {
    const backendError = error.response?.data as BackendError;
    
    // If backend sent a structured error
    if (backendError?.message && backendError?.statusCode) {
      return NextResponse.json(
        { 
          error: backendError.message,
          details: backendError.error || null
        },
        { status: backendError.statusCode }
      );
    }
    
    // If backend sent a simple error message
    if (backendError?.message) {
      return NextResponse.json(
        { error: backendError.message },
        { status: error.response?.status || 500 }
      );
    }
    
    // Generic axios error
    return NextResponse.json(
      { error: error.message || 'Network error' },
      { status: error.response?.status || 500 }
    );
  }

  // Handle other errors
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Fallback
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
} 