import { decodeJwt } from 'jose';
import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';
import { cache } from 'react';
import 'server-only';
import axiosInstance from '../axiosInstance';

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
  static getUser = unstable_cache(
    async (): Promise<SessionData | null> => {
      const session = await AuthDAL.verifySession(); 
      if (!session?.userId) {
        return null;
      }

      try {
        // Fetch permissions from API
        const permissionsResponse = await axiosInstance.get('/user/me/permissions');
        return {
          ...session,
          permissions: permissionsResponse.data
        };
      } catch (error) {
        console.error('Error fetching user permissions:', error);
        // Return session without permissions if API fails
        return session;
      }
    },
    ['user-permissions'], // Cache key
    {
      revalidate: 300, // Cache for 5 minutes
      tags: ['user', 'permissions']
    }
  );

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
      const response = await axiosInstance.post('/auth/refresh-token');
      const { accessToken } = response.data;
      
      // Update cookie
      const cookieStore = await cookies();
      cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      
      return accessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear cookies
      const cookieStore = await cookies();
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
    }
  }
} 


