import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../interface/auth.interface';

interface IAuthContext {
  isAuthenticated?: boolean;
  user?: User;
  role?: string;
}

interface IJWTDecode {
  exp: number;
  iat: number;
  id: string;
  name: string;
  authorization: string;
  organizationId: string;
  email: string;
  phone: string;
  address: string;
}

const UseAuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      sessionStorage.getItem('token') !== null &&
      sessionStorage.getItem('user') !== null &&
      sessionStorage.getItem('auth') !== null
  );
  const [role, setRole] = useState(() => {
    const role = sessionStorage.getItem('role') ?? null;
    return role;
  });

  const [auth, setauth] = useState(() => {
    const auth = sessionStorage.getItem('auth');
    return auth ? JSON.parse(auth) : null;
  });
  const [user, setuser] = useState(() => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  const navigate = useNavigate();




 




  const updateUser = (userData: User) => {
    setuser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <UseAuthContext.Provider
      value={
        {
          isAuthenticated,
          user,
          auth,
          role,
          updateUser
        } as IAuthContext
      }
      key={'LOGINCONTEXT'}
    >
      {children}
    </UseAuthContext.Provider>
  );
};

export default UseAuthContext;
