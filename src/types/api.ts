/**
 * API Response Types for Cloudflare Pages Functions
 * Used across all form submission endpoints
 */

export interface FormSubmissionResponse<T = Record<string, unknown>> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiRequest {
  method: string;
  headers: Record<string, string>;
  body?: unknown;
  turnsileToken?: string;
}

export interface RateLimitInfo {
  remaining: number;
  resetAt: number;
  limit: number;
}
