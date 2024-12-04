export interface IUserLoginRequest {
  email: string;
  password: string;
}

export interface IAdminLoginRequest {
  password: string;
}

export interface IUserLoginResponse {
  success?: boolean;
  token: string;
}

export interface User {
  email?: string;
  name: string;
  role: string;

}


export interface IAuthContext {
  isAuthenticated?: boolean;
  user?: User;
  role?: string;

}

export const USER_ROLES = {
  VIEWER: 'viewer',
  USER: 'user',
  ADMIN: 'admin',
};