import { apiClient } from '@/lib/api-client';

import type { LoginRequest, RegisterRequest, TokenResponse, User } from '../types';

export const register = (data: RegisterRequest): Promise<User> =>
  apiClient.post<User>('/auth/register', data);

export const login = (data: LoginRequest): Promise<TokenResponse> =>
  apiClient.post<TokenResponse>('/auth/login', data);

/**
 * Get current authenticated user's profile
 * Requires valid Bearer token in Authorization header
 */
export const getCurrentUser = (): Promise<User> =>
  apiClient.get<User>('/users/me');
