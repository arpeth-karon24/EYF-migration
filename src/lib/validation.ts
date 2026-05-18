/**
 * Form Validation Utilities
 * Reusable validators for all form types
 */

import { ValidationError } from '@/types/api';

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate required field
 */
export function validateRequired(value: string | undefined | null, fieldName: string): ValidationError | null {
  if (!value || value.trim().length === 0) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      code: 'FIELD_REQUIRED',
    };
  }
  return null;
}

/**
 * Validate email field
 */
export function validateEmailField(email: string | undefined, fieldName: string = 'email'): ValidationError | null {
  const requiredError = validateRequired(email, fieldName);
  if (requiredError) return requiredError;

  if (!validateEmail(email!)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid email address`,
      code: 'INVALID_EMAIL',
    };
  }
  return null;
}

/**
 * Validate phone number (basic format)
 */
export function validatePhone(phone: string | undefined, fieldName: string = 'phone'): ValidationError | null {
  const requiredError = validateRequired(phone, fieldName);
  if (requiredError) return requiredError;

  const phoneRegex = /^[+]?[\d\s\-().]{6,20}$/;
  if (!phoneRegex.test(phone!)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid phone number`,
      code: 'INVALID_PHONE',
    };
  }
  return null;
}

/**
 * Validate minimum length
 */
export function validateMinLength(
  value: string | undefined,
  minLength: number,
  fieldName: string
): ValidationError | null {
  const requiredError = validateRequired(value, fieldName);
  if (requiredError) return requiredError;

  if (value!.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${minLength} characters`,
      code: 'MIN_LENGTH_EXCEEDED',
    };
  }
  return null;
}

/**
 * Validate maximum length
 */
export function validateMaxLength(
  value: string | undefined,
  maxLength: number,
  fieldName: string
): ValidationError | null {
  if (!value) return null;

  if (value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} must not exceed ${maxLength} characters`,
      code: 'MAX_LENGTH_EXCEEDED',
    };
  }
  return null;
}

/**
 * Validate boolean is true (for checkboxes/agreements)
 */
export function validateMustBeTrue(
  value: boolean | undefined,
  fieldName: string
): ValidationError | null {
  if (value !== true) {
    return {
      field: fieldName,
      message: `You must agree to ${fieldName}`,
      code: 'MUST_AGREE',
    };
  }
  return null;
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sanitized as any)[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sanitized as any)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  return sanitized;
}

/**
 * Build validation error response
 */
export function buildValidationErrorResponse(errors: ValidationError[]) {
  return {
    success: false,
    message: 'Validation failed',
    errors,
  };
}

/**
 * Build success response
 */
export function buildSuccessResponse<T>(message: string, data?: T) {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Build error response
 */
export function buildErrorResponse(message: string, code?: string) {
  return {
    success: false,
    message,
    code,
  };
}
