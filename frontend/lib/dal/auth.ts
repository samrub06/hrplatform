import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';
import 'server-only';
import { backendFetch } from '../backendFetch';

export interface Permission {
  id: string;
  name: string;
  domain: string;
  can_read: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface UserJwtPayload {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  iat?: number;
  permissions: Permission[];
  exp?: number;
}

export interface UserWithPermissions extends UserJwtPayload {
  permissions: Permission[];
}

export interface SessionData {
  isAuth: boolean;
  userId: string;
  email?: string;
  role?: string;
  permissions?: Permission[];
  firstName?: string;
  lastName?: string;
}

export class AuthDAL {
  // Login with credentials against backend
  static async login(credentials: { email: string; password: string }): Promise<{ accessToken: string; refreshToken: string }> {
    try {
    const res = await backendFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    console.log('🔴 Login response:', res)
    if(res.statusCode === 401) {
      throw new Error(res.message)
    }
    return res
    
  } catch (error) {
    console.log('🔴 Error during login:', error)
    throw error
  }
  }
  // Verify session using refresh token - cached for performance
  static verifySession = cache(async (): Promise<SessionData | null> => {
    const token = (await cookies()).get('accessToken')?.value;

    if (!token) {
      return null;
    }

    try {
      const decodedJWT = decodeJwt(token);
      const payload = decodedJWT as unknown as UserJwtPayload;
      return {
        isAuth: true, 
        userId: payload.id,
        email: payload.email,
        role: payload.role,
        firstName: payload.firstName,
        lastName: payload.lastName
      };

    } catch (error) {
      console.log('error', error)
      return null;
    }
  });

  // Get user with permissions - cached with better control
  static getUser = cache(async (): Promise<SessionData | null> => {
    const session = await AuthDAL.verifySession(); 
    if (!session?.userId) {
      return null;
    }

    try {
      const permissions = await backendFetch('/user/me/permissions')
      return {
        ...session,
        permissions
      };
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      // Return session without permissions if API fails
      return session;
    }
  });

  // Get user without permissions - for cases where we only need basic user info
  static getUserBasic = cache(async (): Promise<SessionData | null> => {
    return await AuthDAL.verifySession();
  });

  static getUserId = cache(async (): Promise<string | null> => {
    const session = await AuthDAL.verifySession();
    return session?.userId || null;
  });

  // Check if user is authenticated (without fetching permissions)
  static isAuthenticated = cache(async (): Promise<boolean> => {
    const session = await AuthDAL.verifySession();
    return !!session?.isAuth;
  });

  // Check if user has specific permission
  static hasPermission(user: UserWithPermissions, domain: string, action: 'read' | 'create' | 'edit' | 'delete'): boolean {
    const permission = user.permissions.find(p => p.domain === domain);
    if (!permission) return false;

    switch (action) {
      case 'read':
        return permission.can_read;
      case 'create':
        return permission.can_create;
      case 'edit':
        return permission.can_edit;
      case 'delete':
        return permission.can_delete;
      default:
        return false;
    }
  }

  // Refresh access token if needed
  static async refreshAccessToken(): Promise<string | null> {
    try {
      const data = await backendFetch('/auth/refresh-token', { method: 'POST' })
      const { accessToken } = data
      const cookieStore = await cookies()
      cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
      return accessToken
    } catch (error) {
      console.error('Error refreshing access token:', error)
      return null
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      // Optionally: call backend revoke endpoint here if available
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      const cookieStore = await cookies()
      cookieStore.delete('accessToken')
      cookieStore.delete('refreshToken')
      cookieStore.delete('refresh_token')
    }
  }
} 


