import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleGoogleCallback } from '../services/auth.service';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('token');
    if (accessToken) {
      handleGoogleCallback(accessToken)
        .then((user) => {
          setUser(user);
          navigate('/complete-profile');
        })
        .catch((error) => {
          console.error('Error during Google connection:', error);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div>Connexion in Progress...</div>
  );
} 