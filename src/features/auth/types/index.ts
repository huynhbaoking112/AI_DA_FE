/**
 * Auth Feature Types
 * Based on FastAPI backend schemas: ai_service_kiro/app/domain/schemas/auth.py
 */

/**
 * User information returned from API
 */
export interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request payload
 * Password must be at least 8 characters
 */
export interface RegisterRequest {
  email: string;
  password: string;
}

/**
 * Token response after successful login
 */
export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
}
