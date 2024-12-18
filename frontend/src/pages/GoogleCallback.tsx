import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGoogleCallback } from '../services/auth.service';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleGoogleCallback(token)
        .then(() => {
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error('Erreur lors de la connexion Google:', error);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div>Connexion en cours...</div>
  );
} 