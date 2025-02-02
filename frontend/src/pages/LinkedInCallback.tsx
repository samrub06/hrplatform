import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleLinkedInCallback } from '../services/auth.service';

export default function LinkedInCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('token');
    if (accessToken) {
      handleLinkedInCallback(accessToken)
        .then((user) => {
          setUser(user);
          navigate('/complete-profile');
        })
        .catch((error) => {
          console.error('Error during LinkedIn connection:', error);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div>Connexion LinkedIn en cours...</div>
  );
} 