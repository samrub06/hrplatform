import { jwtVerify } from 'jose';
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
interface User {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface UserJwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  permissions: Permission[];
  exp?: number;
}

export interface UserWithPermissions extends UserJwtPayload {
  permissions: Permission[];
}

export class AuthDAL {
  private static readonly JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET 
  );

  static async verifySession() {
    const token = (await cookies()).get('refreshToken')?.value;
    console.log(token, 'token');
    if (!token) {
      return null;
    }

    try {
      const verifiedJWT = await jwtVerify(token, this.JWT_SECRET);
      console.log(verifiedJWT, 'verifiedJWT');
      const payload = verifiedJWT.payload as unknown as UserJwtPayload;
      return {
        isAuth: true, userId: payload.id 
      };

    } catch {
      return null;
    }
  }

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


  static getUser = cache(async () => {
  const session = await AuthDAL.verifySession(); 
  if (!session?.userId) {
      return null
  }

  // api request auth/permissions
  const permissionsResponse = await axiosInstance.get('/user/me/permissions');
  return {
    ...session,
    userId: permissionsResponse.data.userId,
    role: permissionsResponse.data.role,
    permissions: permissionsResponse.data
  };

  })

} 


