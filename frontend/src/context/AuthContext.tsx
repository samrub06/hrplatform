import { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from '../interface/auth.interface';

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  checkPermission: (domain: string, action: 'create' | 'read' | 'edit' | 'delete') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const checkPermission = (domain: string, action: 'create' | 'read' | 'edit' | 'delete') => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const permission = user.permissions?.find(p => p.domain === domain);

    if (!permission) return false;
    switch (action) {
      case 'create': return permission.can_create;
      case 'read': return permission.can_read;
      case 'edit': return permission.can_edit;
      case 'delete': return permission.can_delete;
      default: return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


