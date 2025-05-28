import { AuthUser, RegisterDto } from "@/interfaces/login.interface";
import axiosInstance from "@/lib/axiosInstance";
import { jwtDecode } from "jwt-decode";

export interface Permission {
  id: string;
  name: string;
  domain: string;
  can_read: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  password_confirmation: string;
}
export interface LoginRequestDto {
  email: string;
  password: string;
}

export const testCookie = async (): Promise<void> => {
  try {
    const response = await axiosInstance.post('/auth/refresh-token');
    console.log('Réponse du refresh:', response.data);
  } catch (error) {
    console.error('Erreur lors du test du cookie:', error);
  }
};


export async function login(loginData: LoginRequestDto) {
  try {
    const credentials = await axiosInstance.post('/auth/login', loginData);
    const {accessToken, refreshToken} = credentials.data;
    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof Error && error.message === 'CredentialsSignin') {
      throw new Error('Invalid credentials.');
    } else {
      throw new Error('Something went wrong.');
    }
  }
}

export const loginGoogle = async (): Promise<void> => {
  window.location.href = 'http://localhost:3000/api/auth/google';

};

export const register = async (data: RegisterDto): Promise<AuthUser> => {
  const response = await axiosInstance.post('/auth/register', data);
  const { access_token } = response.data;

  const decodedToken = jwtDecode(access_token) as { id: string, email: string };
  return decodedToken;
};

export const logout = () => {
  window.location.href = '/auth/login';
};

export const handleGoogleCallback = async (accessToken: string): Promise<AuthUser> => {
  
  const decodedToken = jwtDecode(accessToken) as { id: string, email: string };
  const permissionsResponse = await axiosInstance.get('/user/me/permissions');
  
  const userWithPermissions: AuthUser = {
    id: decodedToken.id,
    email: decodedToken.email,
    permissions: permissionsResponse.data
  };

  return userWithPermissions;
};

export const loginLinkedIn = async (): Promise<void> => {
  window.location.href = 'http://localhost:3000/api/auth/linkedin';
};

export const handleLinkedInCallback = async (accessToken: string): Promise<AuthUser> => {
    const decodedToken = jwtDecode(accessToken) as { id: string, email: string };
  const permissionsResponse = await axiosInstance.get('/user/me/permissions');
  
  const userWithPermissions: AuthUser = {
    id: decodedToken.id,
    email: decodedToken.email,
    permissions: permissionsResponse.data
  };

  return userWithPermissions;
};


export const validateSession = async (id: string) => {
  const session = await axiosInstance.post(`/verify/session/${id}`)
  if (!session) return null
 
  return session
}