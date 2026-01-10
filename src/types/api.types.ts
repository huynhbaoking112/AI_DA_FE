/**
 * API Types - Shared types for API requests and responses
 */

/**
 * FastAPI error response format
 */
export interface ApiErrorResponse {
  detail: string;
}

/**
 * Paginated response wrapper (for future use)
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
