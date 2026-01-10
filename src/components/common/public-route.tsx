import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/use-auth-store';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Public Route wrapper
 * Redirects to dashboard if user is already authenticated
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
