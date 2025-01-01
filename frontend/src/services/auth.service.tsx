import { AuthUser, RegisterDto } from "@/interface/auth.interface";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../utils/axiosInstance";

export interface RegisterRequestDto {
  email: string;
  password: string;
  password_confirmation: string;
}
export interface LoginRequestDto {
  email: string;
  password: string;
}

export const login = async (credentials: LoginRequestDto): Promise<AuthUser> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  const { access_token } = response.data;
  localStorage.setItem('token', access_token);
  
  const decodedToken = jwtDecode(access_token) as { sub: string, email: string };
  const permissionsResponse = await axiosInstance.get('/user/me/permissions');
  
  const userWithPermissions: AuthUser = {
    id: decodedToken.sub,
    email: decodedToken.email,
    role: 'candidate', // ou la valeur appropriée du token
    permissions: permissionsResponse.data
  };

  return userWithPermissions; // Retournez l'utilisateur au lieu de le stocker directement
};

export const loginGoogle = async (): Promise<void> => {
  // Redirection directe vers l'endpoint Google du backend
  window.location.href = 'http://localhost:3000/api/auth/google';
};

export const register = async (data: RegisterDto): Promise<AuthUser> => {
  const response = await axiosInstance.post('/auth/register', data);
  const { access_token } = response.data;
  localStorage.setItem('token', access_token);

  const decodedToken = jwtDecode(access_token) as { id: string, email: string ,role:string};
  const permissionsResponse = await axiosInstance.get('/user/me/permissions');
  
  const userWithPermissions: AuthUser = {
    id: decodedToken.id,
    email: decodedToken.email,
    role: decodedToken?.role as 'admin' | 'publisher' | 'candidate' | 'viewer',    permissions: permissionsResponse.data
  };

  localStorage.setItem('user', JSON.stringify(userWithPermissions));
  return userWithPermissions;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth/login';
};

export const handleGoogleCallback = async (token: string): Promise<AuthUser> => {
  localStorage.setItem('token', token);
  
  const decodedToken = jwtDecode(token) as { sub: string, email: string };
  const permissionsResponse = await axiosInstance.get('/user/me/permissions');
  
  const userWithPermissions: AuthUser = {
    id: decodedToken.sub,
    email: decodedToken.email,
    role: 'candidate',
    permissions: permissionsResponse.data
  };

  localStorage.setItem('user', JSON.stringify(userWithPermissions));
  return userWithPermissions;
};