import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleGoogleCallback } from '../services/auth.service';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleGoogleCallback(token)
        .then((user) => {
          setUser(user);
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error('Erreur lors de la connexion Google:', error);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div>Connexion en cours...</div>
  );
} 