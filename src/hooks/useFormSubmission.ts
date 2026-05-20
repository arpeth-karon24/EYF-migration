/**
 * useFormSubmission Hook
 * Reusable hook for form submission with API calls and loading/error states
 */

import { useState, useCallback } from 'react';
import { FormSubmissionResponse, ValidationError } from '@/types/api';

export interface UseFormSubmissionOptions {
  endpoint: string;
  onSuccess?: (response: FormSubmissionResponse) => void;
  onError?: (error: string) => void;
}

export interface UseFormSubmissionState {
  isLoading: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
  errors: ValidationError[];
  submissionId?: string;
}

/**
 * Hook for handling form submissions to Cloudflare Functions
 */
export function useFormSubmission(options: UseFormSubmissionOptions) {
  const { endpoint, onSuccess, onError } = options;

  const [state, setState] = useState<UseFormSubmissionState>({
    isLoading: false,
    message: null,
    errors: [],
  });

  const submit = useCallback(
    async (formData: Record<string, unknown>, turnsileToken: string) => {
      // Reset state
      setState({
        isLoading: true,
        message: null,
        errors: [],
      });

      try {
        // Validate Turnstile token
        if (!turnsileToken) {
          setState({
            isLoading: false,
            message: {
              type: 'error',
              text: 'CAPTCHA validation failed. Please try again.',
            },
            errors: [],
          });
          onError?.('CAPTCHA validation failed');
          return false;
        }

        // Prepare request body with Turnstile token
        const requestBody = {
          ...formData,
          turnsileToken,
        };

        // Make API call to Cloudflare Function
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        // Guard: if the endpoint isn't a Cloudflare Function (e.g. running
        // `npm run dev` instead of `wrangler pages dev`), the server returns
        // an HTML 404 page. Parsing that as JSON throws an opaque
        // "Unexpected token '<'" error. Detect and message clearly instead.
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) {
          const isLocalDev =
            typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' ||
              window.location.hostname === '127.0.0.1');

          const friendlyMessage = isLocalDev
            ? 'Forms only work on the deployed site, not on localhost. Either submit this form on https://engage-youth-web.pages.dev, or run `npx wrangler pages dev out` locally.'
            : `The form endpoint is not responding correctly (status ${response.status}). Please try again later or contact admin@engage-youth.org.`;

          setState({
            isLoading: false,
            message: { type: 'error', text: friendlyMessage },
            errors: [],
          });
          onError?.(friendlyMessage);
          return false;
        }

        const data: FormSubmissionResponse = await response.json();

        if (!response.ok) {
          // Handle validation errors
          if (data.errors && data.errors.length > 0) {
            const errorMessages = data.errors.map((e: ValidationError) => e.message).join(', ');
            setState({
              isLoading: false,
              message: {
                type: 'error',
                text: errorMessages || data.message || 'Validation failed. Please check the form.',
              },
              errors: data.errors,
            });
            onError?.(data.message);
            return false;
          }

          // Handle other errors
          setState({
            isLoading: false,
            message: {
              type: 'error',
              text: data.message || 'An error occurred. Please try again.',
            },
            errors: [],
          });
          onError?.(data.message);
          return false;
        }

        // Success
        setState({
          isLoading: false,
          message: {
            type: 'success',
            text: data.message || 'Form submitted successfully!',
          },
          errors: [],
          submissionId: data.data?.submissionId as string | undefined,
        });

        onSuccess?.(data);
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

        setState({
          isLoading: false,
          message: {
            type: 'error',
            text: errorMessage || 'Failed to submit form. Please try again.',
          },
          errors: [],
        });

        onError?.(errorMessage);
        return false;
      }
    },
    [endpoint, onSuccess, onError]
  );

  const clearMessage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      message: null,
      errors: [],
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errors: [],
    }));
  }, []);

  return {
    ...state,
    submit,
    clearMessage,
    clearErrors,
  };
}
