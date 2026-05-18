/**
 * Cloudflare Pages Function: POST /api/donation
 * Handles donation requests (monetary and in-kind)
 */

import {
  validateRequired,
  validateEmailField,
  sanitizeObject,
  buildValidationErrorResponse,
  buildSuccessResponse,
  buildErrorResponse,
} from '@/lib/validation';
import { validateTurnstileToken } from '@/lib/turnstile';
import { sendBatchEmails } from '@/lib/resend';
import { donationUserEmail, donationAdminEmail } from '@/lib/emailTemplates';
import { ValidationError } from '@/types/api';

interface Env {
  ADMIN_EMAIL?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

interface DonationRequest {
  name?: string;
  email?: string;
  donationType?: 'monetary' | 'in-kind';
  items?: string;
  notes?: string;
  turnsileToken?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // Parse request body
    let body: DonationRequest;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify(buildErrorResponse('Invalid JSON in request body')), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate Turnstile token
    if (!body.turnsileToken) {
      return new Response(JSON.stringify(buildErrorResponse('CAPTCHA validation required')), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isTurnstileValid = await validateTurnstileToken(body.turnsileToken, env.TURNSTILE_SECRET_KEY);
    if (!isTurnstileValid) {
      return new Response(JSON.stringify(buildErrorResponse('CAPTCHA verification failed')), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate form fields
    const errors: ValidationError[] = [];

    const nameError = validateRequired(body.name, 'Name');
    if (nameError) errors.push(nameError);

    const emailError = validateEmailField(body.email);
    if (emailError) errors.push(emailError);

    const donationTypeError = validateRequired(body.donationType, 'Donation Type');
    if (donationTypeError) errors.push(donationTypeError);

    if (body.donationType && !['monetary', 'in-kind'].includes(body.donationType)) {
      errors.push({
        field: 'donationType',
        message: 'Donation type must be either monetary or in-kind',
        code: 'INVALID_DONATION_TYPE',
      });
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify(buildValidationErrorResponse(errors)), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sanitize input
    const sanitized = sanitizeObject({
      name: body.name || '',
      email: body.email || '',
      donationType: body.donationType || 'monetary',
      items: body.items || '',
      notes: body.notes || '',
    });

    const adminEmail = env.ADMIN_EMAIL || 'admin@engage-youth.org';
    const submittedAt = new Date().toLocaleString();

    const userEmailHtml = donationUserEmail(sanitized.name, sanitized.email, sanitized.donationType);
    const adminEmailHtml = donationAdminEmail(
      sanitized.name,
      sanitized.email,
      sanitized.donationType,
      sanitized.items || undefined,
      sanitized.notes || undefined,
      submittedAt
    );

    const emailResults = await sendBatchEmails(
      {
        to: sanitized.email,
        subject: 'Thank You for Your Generous Donation - Engage Youth Fund',
        html: userEmailHtml,
        replyTo: adminEmail,
      },
      {
        to: adminEmail,
        subject: `New Donation Request: ${sanitized.name}`,
        html: adminEmailHtml,
        replyTo: sanitized.email,
      },
      env.RESEND_API_KEY
    );

    if (!emailResults.user) {
      console.error('Failed to send donation confirmation email', emailResults);
      return new Response(
        JSON.stringify(buildErrorResponse(
          'Donation request received but failed to send confirmation. Please try again or contact us directly.',
          'EMAIL_SEND_FAILED'
        )),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    if (!emailResults.admin) {
      console.error('Failed to send admin notification email', emailResults);
    }

    return new Response(
      JSON.stringify(buildSuccessResponse('Thank you for your generous donation! We will be in touch shortly.', {
        submissionId: emailResults.user.id,
      })),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Donation handler error:', error);
    return new Response(JSON.stringify(buildErrorResponse('An unexpected error occurred. Please try again later.')), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
