import { jwtDecode, JwtPayload } from "jwt-decode";
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUserLoginRequest, User } from '../interface/auth.interface';
import { Login, Register } from '../services/auth.service';

interface IAuthContext {
  isAuthenticated?: boolean;
  user: User | null
  role?: string;
  login: (credentials: IUserLoginRequest) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

export const UseAuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const initialUser: User | null = token ? jwtDecode<JwtPayload>(token) as User : null;
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState<User | null>(initialUser);

  const login = async (userData: IUserLoginRequest) => {
    try {
      const response = await Login(userData);
      const { access_token } = response;
      
      localStorage.setItem('token', access_token);
      const decoded: any = jwtDecode(access_token);
      setUser(decoded);
      setIsAuthenticated(true);
      
      if (decoded.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await Register(userData);
      const { access_token } = response;

      localStorage.setItem('token', access_token);
      const decoded: any = jwtDecode(access_token);
      setUser(decoded);
      setIsAuthenticated(true);

      if (decoded.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/auth/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <UseAuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </UseAuthContext.Provider>
  );
};


