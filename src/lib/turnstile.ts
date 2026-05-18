/**
 * Cloudflare Turnstile Validation
 * Verifies CAPTCHA tokens from frontend forms
 */

export interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  'error-messages'?: string[];
}

/**
 * Verify Cloudflare Turnstile token
 * Call this in Cloudflare Pages Functions to validate CAPTCHA
 */
export async function validateTurnstileToken(token: string, secretKeyOverride?: string): Promise<boolean> {
  const secretKey = secretKeyOverride || process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY environment variable not set');
    return false;
  }

  if (!token) {
    console.error('Turnstile token not provided');
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    if (!response.ok) {
      console.error('Turnstile verification request failed:', response.statusText);
      return false;
    }

    const data: TurnstileVerifyResponse = await response.json();

    if (!data.success) {
      console.warn('Turnstile verification failed:', data['error-codes']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

/**
 * Turnstile error codes and their meanings
 */
export const TURNSTILE_ERROR_CODES: Record<string, string> = {
  'missing-input-secret': 'The secret parameter was not passed.',
  'invalid-input-secret': 'The secret parameter was invalid or did not match the one passed to Turnstile.',
  'missing-input-response': 'The response parameter (token) was not passed.',
  'invalid-input-response': 'The response parameter (token) was invalid or did not match the one Turnstile created.',
  'invalid-widget-id': 'The widget ID extracted from the response was invalid.',
  'invalid-parsed-secret': 'The secret extracted from the JSON body was invalid.',
  'bad-request': 'The request was rejected because of bad syntax.',
  'timeout-or-duplicate': 'The response parameter (token) has already been validated before.',
  'internal-error': 'An internal error happened during token validation.',
};

/**
 * Get human-readable error message for Turnstile error code
 */
export function getTurnstileErrorMessage(code: string): string {
  return TURNSTILE_ERROR_CODES[code] || `Verification failed: ${code}`;
}
