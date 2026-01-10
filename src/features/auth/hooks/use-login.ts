import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/use-auth-store';
import { ApiError } from '@/lib/api-error';

import { login, getCurrentUser } from '../api/auth.api';

import type { LoginRequest, TokenResponse } from '../types';

/**
 * Custom hook for handling login mutation
 * Uses TanStack Query's useMutation for optimal caching and state management
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation<TokenResponse, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: async (data) => {
      // Temporarily set token to make authenticated request
      useAuthStore.setState({ token: data.access_token });

      try {
        // Fetch user profile from /users/me endpoint
        const user = await getCurrentUser();

        setAuth(data.access_token, {
          id: user.id,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
          created_at: user.created_at,
        });

        // Navigate to dashboard after successful login
        navigate('/', { replace: true });
      } catch {
        // If fetching user fails, clear the temporary token
        useAuthStore.setState({ token: null });
        throw new ApiError(500, 'Failed to fetch user profile');
      }
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
};
