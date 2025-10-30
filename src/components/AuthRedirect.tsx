import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const AuthRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is not authenticated and trying to access root, redirect to landing
    if (!user && location.pathname === '/') {
      navigate('/landing', { replace: true });
    }
    // If user is authenticated and on landing, redirect to home
    if (user && location.pathname === '/landing') {
      navigate('/', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return null;
};
