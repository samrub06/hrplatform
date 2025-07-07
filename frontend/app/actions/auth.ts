'use server'
import axiosInstance from '@/lib/axiosInstance';
import {
  ActionResult,
  createErrorResult,
  createSuccessResult,
  handleServerError,
  validateFormData
} from '@/lib/errorHandler';
import { TokenService } from '@/lib/services/tokenService';

interface LoginRequestDto {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

class LoginFormData {
private email: string 
private password: string

constructor(formData: FormData){
  this.email= formData.get('email') as string
  this.password= formData.get('password') as string
}

validate() : {isValid: boolean, error?: string}{
  if(!this.email || !this.password){
    return {isValid: false, error: 'Email and password are required'}
  }
  return {isValid: true}
}

toLoginRequestDto(): LoginRequestDto{
  return {email: this.email, password: this.password}
}
}

// Direct login function to avoid circular imports
async function performLogin(credentials: LoginRequestDto): Promise<LoginResponse> {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
}

export async function loginAction(prevState: { error: string | null; success: boolean }, formData: FormData): Promise<ActionResult> {
  const loginFormData = new LoginFormData(formData)
  const validation = loginFormData.validate()

  if (!validation.isValid) {
    return createErrorResult(validation.error || "Invalid form data");
  }

  try {
    const response = await performLogin(loginFormData.toLoginRequestDto());
    const { accessToken, refreshToken } = response;
    
    // Store tokens using the service
    await TokenService.setAccessToken(accessToken);
    await TokenService.setRefreshToken(refreshToken);
    
    return createSuccessResult()
  } catch (error) {
    return handleServerError(error, "An error occurred during login");
  }
}
  

export type SignupState = ActionResult;

export async function signupAction(prevState: SignupState, formData: FormData): Promise<SignupState> {
  // Validate required fields
  const validationError = validateFormData(
    formData, 
    ['email', 'password', 'confirmPassword', 'firstName', 'lastName'],
    [
      {
        field: 'password',
        validator: (value) => {
          if (value.length < 6) {
            return "Password must contain at least 6 characters";
          }
          return null;
        }
      },
      {
        field: 'confirmPassword',
        validator: (value) => {
          const password = formData.get('password') as string;
          if (value !== password) {
            return "Passwords do not match";
          }
          return null;
        }
      }
    ]
  );

  if (validationError) {
    return validationError;
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  try {
    await axiosInstance.post("/auth/register", {
      email, 
      password, 
      password_confirmation: confirmPassword, 
      first_name: firstName, 
      last_name: lastName
    });

    return createSuccessResult();
  } catch (error) {
    return handleServerError(error, "An error occurred during signup");
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    // Import AuthDAL dynamically to avoid server/client issues
    const { AuthDAL } = await import('@/lib/dal/auth');
    await AuthDAL.logout();
    
    return createSuccessResult();
  } catch (error) {
    return handleServerError(error, "An error occurred during logout");
  }
}
