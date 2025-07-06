'use client'

import { useEffect, useState } from 'react';
import { TokenService } from '../services/tokenService';

export interface User {
  id: string;
  email: string;
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await TokenService.isAuthenticated();
        setAuthState({
          isAuthenticated: isAuth,
          isLoading: false,
          user: isAuth ? await getUserInfo() : null
        });
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    await TokenService.setAccessToken(accessToken);
    await TokenService.setRefreshToken(refreshToken);
    
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user: await getUserInfo()
    });
  };

  const logout = async () => {
    await TokenService.clearTokens();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null
    });
  };

  const getUserInfo = async (): Promise<User | null> => {
    try {
      const accessToken = await TokenService.getAccessToken();
      if (!accessToken) return null;

      // Decode JWT token to get user info
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  };

  return {
    ...authState,
    login,
    logout
  };
} 