'use server'
import { cookies } from 'next/headers';
import { login, LoginRequestDto } from '../api/login/route';




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




export async function loginAction(prevState: { error: string | null; success: boolean }, formData: FormData) {
  const loginFormData = new LoginFormData(formData)
  const validation = loginFormData.validate()

  if (!validation.isValid) {
    return {
      error: validation.error || "Invalid form data",
      success: false
    }
  }

  try {
    const response = await login(loginFormData.toLoginRequestDto());
    const { accessToken, refreshToken } = response;
        // Stockage dans les cookies
        const cookieStore = await cookies();
        cookieStore.set('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        cookieStore.set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
    
        return { success: true, error: null };

  } catch (err) {
    console.log('err',err);
    return {
      error: err instanceof Error ? err.message : 'Une erreur est survenue',
      success: false
    }
  }
}
  

export type SignupState = {
  error: string | null;
  success: boolean;
}



export async function signupAction(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')

  if (!email || !password || !confirmPassword || !firstName || !lastName) {
    return {
      error: "All fields are required",
      success: false
    }
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
      success: false
    }
  }

  let response;
  try {
    response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({  email, password, password_confirmation:confirmPassword, first_name: firstName, last_name: lastName }),
      credentials: 'include',
    })

    const data = await response.json()
    if (!response.ok) {
      return {
        error: data.message || "An error occurred during signup",
        success: false
      }
    }

    return {
      error: null,
      success: true
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred during signup",
      success: false
    }
  }
}
