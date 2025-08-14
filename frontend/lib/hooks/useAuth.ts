'use client'

import { useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  role?: string;
  firstName?: string;
  lastName?: string;
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
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Call API route to check authentication status
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Important: envoie les cookies
      });
      
      if (response.ok) {
        const user = await response.json();
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        });
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      });
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      });
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshAuth = () => {
    checkAuth();
  };

  return {
    ...authState,
    logout,
    refreshAuth
  };
} 