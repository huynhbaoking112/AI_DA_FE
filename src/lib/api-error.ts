/**
 * Custom API Error class for handling HTTP errors
 */
export class ApiError extends Error {
  statusCode: number;
  detail: string;
  originalError?: unknown;

  constructor(statusCode: number, detail: string, originalError?: unknown) {
    super(detail);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.detail = detail;
    this.originalError = originalError;
  }

  /**
   * Check if error is 401 Unauthorized
   */
  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Check if error is 403 Forbidden
   */
  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Check if error is 404 Not Found
   */
  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Check if error is 400 Bad Request
   */
  get isBadRequest(): boolean {
    return this.statusCode === 400;
  }

  /**
   * Check if error is 5xx Server Error
   */
  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /**
   * Check if error is network error (no response)
   */
  get isNetworkError(): boolean {
    return this.statusCode === 0;
  }
}
