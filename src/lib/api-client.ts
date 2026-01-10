import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/stores/use-auth-store';

import { ApiError } from './api-error';

import type { ApiErrorResponse } from '@/types/api.types';

/**
 * Axios instance with base configuration
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor - Attach Bearer Token
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor - Transform errors to ApiError
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Network error (no response from server)
    if (!error.response) {
      return Promise.reject(
        new ApiError(0, 'Network error. Please check your connection.', error)
      );
    }

    const { status, data } = error.response;
    const detail = data?.detail || 'An unexpected error occurred';

    // Handle 401 - Unauthorized: auto logout
    if (status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(new ApiError(status, detail, error));
  }
);

/**
 * API Client wrapper with typed methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  /**
   * POST request
   */
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),

  /**
   * PUT request
   */
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),

  /**
   * PATCH request
   */
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  /**
   * DELETE request
   */
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};

/**
 * Export axios instance for advanced use cases
 */
export { axiosInstance };
