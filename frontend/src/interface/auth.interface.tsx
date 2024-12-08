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
  email: string;
  id: number;
  name: string;
  role: string;

}


export interface IAuthContext {
  isAuthenticated?: boolean;
  user: User | null;
  role?: string;
  login: (credentials: IUserLoginRequest) => Promise<void>;
  logout: () => void;
}

export const USER_ROLES = {
  VIEWER: 'viewer',
  USER: 'user',
  ADMIN: 'admin',
};