import { cookies } from 'next/headers';

export class TokenService {
  // Store access token
  static async setAccessToken(token: string): Promise<void> {
    if (typeof window === 'undefined') {
      // Server side - store in httpOnly cookie
      const cookieStore = await cookies();
      cookieStore.set('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    } else {
      // Client side - store in localStorage
      localStorage.setItem('accessToken', token);
    }
  }

  // Store refresh token
  static async setRefreshToken(token: string): Promise<void> {
    if (typeof window === 'undefined') {
      // Server side - store in httpOnly cookie
      const cookieStore = await cookies();
      cookieStore.set('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    } else {
      // Client side - store in localStorage
      localStorage.setItem('refreshToken', token);
    }
  }

  // Get access token
  static async getAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') {
      // Server side - get from cookie
      const cookieStore = await cookies();
      return cookieStore.get('accessToken')?.value || null;
    } else {
      // Client side - get from localStorage
      return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    }
  }

  // Get refresh token
  static async getRefreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') {
      // Server side - get from cookie
      const cookieStore = await cookies();
      return cookieStore.get('refreshToken')?.value || null;
    } else {
      // Client side - get from localStorage
      return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    }
  }

  // Clear all tokens
  static async clearTokens(): Promise<void> {
    if (typeof window === 'undefined') {
      // Server side - clear cookies
      const cookieStore = await cookies();
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
    } else {
      // Client side - clear localStorage and sessionStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return !!accessToken;
  }
} 