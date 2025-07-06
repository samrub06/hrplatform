import { AxiosError } from 'axios';

export interface ServerError {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export interface ErrorResult {
  error: string;
  success: false;
}

export interface SuccessResult {
  error: null;
  success: true;
  redirect?: string;
}

export interface InitialState {
  error: null;
  success: false;
}

export type ActionResult = ErrorResult | SuccessResult | InitialState;

/**
 * Generic error handler for Next.js actions
 * @param error - The captured error
 * @param defaultMessage - Default error message
 * @returns An object with error and success
 */
export function handleServerError(error: unknown, defaultMessage: string = "An error occurred"): ErrorResult {
  // Handle server validation errors
  console.log("error",error)
  if (error instanceof AxiosError && error.response?.data) {
    const serverError = error.response.data as ServerError;
    
    // If error contains an array of validation messages
    if (Array.isArray(serverError.message)) {
      return {
        error: serverError.message.join(', '),
        success: false
      };
    }
    
    // If error contains a simple message
    if (serverError.message && typeof serverError.message === 'string') {
      return {
        error: serverError.message,
        success: false
      };
    }
    
    // If error contains a generic error message
    if (serverError.error) {
      return {
        error: serverError.error,
        success: false
      };
    }
  }
  
  // Default error if no specific error is found
  return {
    error: error instanceof Error ? error.message : defaultMessage,
    success: false
  };
}

/**
 * Form validation error handler
 * @param formData - Form data
 * @param requiredFields - Required fields
 * @param customValidations - Custom validations
 * @returns An object with error and success
 */
export function validateFormData(
  formData: FormData, 
  requiredFields: string[],
  customValidations?: Array<{ field: string; validator: (value: string) => string | null }>
): ErrorResult | null {
  // Validate required fields
  for (const field of requiredFields) {
    const value = formData.get(field);
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return {
        error: `${field} is required`,
        success: false
      };
    }
  }

  // Custom validations
  if (customValidations) {
    for (const validation of customValidations) {
      const value = formData.get(validation.field) as string;
      const error = validation.validator(value);
      if (error) {
        return {
          error,
          success: false
        };
      }
    }
  }

  return null; // No error
}

/**
 * Success result creator
 */
export function createSuccessResult(): SuccessResult {
  return {
    error: null,
    success: true
  };
}

/**
 * Success result creator with redirect
 */
export function createSuccessResultWithRedirect(redirectPath: string): SuccessResult {
  return {
    error: null,
    success: true,
    redirect: redirectPath
  };
}

/**
 * Error result creator
 */
export function createErrorResult(message: string): ErrorResult {
  return {
    error: message,
    success: false
  };
}

/**
 * Initial state creator for actions
 */
export function createInitialState(): InitialState {
  return {
    error: null,
    success: false
  };
} 