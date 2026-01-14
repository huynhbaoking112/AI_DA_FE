import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/use-auth-store';
import { connectSocket, disconnectSocket } from '@/lib/socket-client';

interface SocketProviderProps {
  children: ReactNode;
}

/**
 * Socket Provider
 * Manages socket connection lifecycle based on authentication state.
 * Automatically connects when user is authenticated and disconnects on logout.
 */
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
};
