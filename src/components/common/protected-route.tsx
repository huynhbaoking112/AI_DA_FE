import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/use-auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route wrapper
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
