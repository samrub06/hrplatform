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

export interface AuthUser {
  id: string;
  email?: string;
  role?: 'admin' | 'publisher' | 'candidate' | 'viewer';
  permissions: Permission[];
}


export interface RegisterDto {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
}