import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const { hasRole, isLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error("Please sign in to access this page");
        navigate('/landing');
        return;
      }

      if (requireAdmin && !hasRole('admin')) {
        toast.error("Admin access required");
        navigate('/landing');
        return;
      }
    }
  }, [user, hasRole, isLoading, requireAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 gradient-primary rounded-full animate-pulse mx-auto"></div>
          <p className="gradient-text font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (requireAdmin && !hasRole('admin'))) {
    return null;
  }

  return <>{children}</>;
};