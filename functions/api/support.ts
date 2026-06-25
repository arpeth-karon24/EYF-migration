/**
 * Cloudflare Pages Function: POST /api/support
 * Handles volunteer support requests
 */

import {
  validateRequired,
  validateEmailField,
  validatePhone,
  sanitizeObject,
  buildValidationErrorResponse,
  buildSuccessResponse,
  buildErrorResponse,
} from '@/lib/validation';
import { validateTurnstileToken } from '@/lib/turnstile';
import { sendBatchEmails } from '@/lib/resend';
import { supportRequestUserEmail, supportRequestAdminEmail } from '@/lib/emailTemplates';
import { ValidationError } from '@/types/api';

interface Env {
  ADMIN_EMAIL?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

interface SupportRequest {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  location?: string;
  volunteersNeeded?: number | string;
  eventDescription?: string;
  turnsileToken?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // Parse request body
    let body: SupportRequest;
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

    const phoneError = validatePhone(body.phone, 'Phone');
    if (phoneError) errors.push(phoneError);

    const dateError = validateRequired(body.date, 'Event Date');
    if (dateError) errors.push(dateError);

    const timeError = validateRequired(body.time, 'Event Time');
    if (timeError) errors.push(timeError);

    const locationError = validateRequired(body.location, 'Location');
    if (locationError) errors.push(locationError);

    const descriptionError = validateRequired(body.eventDescription, 'Event Description');
    if (descriptionError) errors.push(descriptionError);

    const volunteersNeeded = parseInt(String(body.volunteersNeeded), 10);
    if (isNaN(volunteersNeeded) || volunteersNeeded < 1) {
      errors.push({
        field: 'volunteersNeeded',
        message: 'Number of volunteers needed must be at least 1',
        code: 'INVALID_VOLUNTEERS_COUNT',
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
      phone: body.phone || '',
      date: body.date || '',
      time: body.time || '',
      location: body.location || '',
      eventDescription: body.eventDescription || '',
    });

    const adminEmail = env.ADMIN_EMAIL || 'admin@engage-youth.org';
    const fromEmail = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const submittedAt = new Date().toLocaleString();
    const siteUrl = (env.NEXT_PUBLIC_SITE_URL || 'https://engage-youth-web.pages.dev').trim();

    const userEmailHtml = supportRequestUserEmail(sanitized.name, sanitized.email, sanitized.date, siteUrl);
    const adminEmailHtml = supportRequestAdminEmail(
      sanitized.name,
      sanitized.email,
      sanitized.phone,
      sanitized.date,
      sanitized.time,
      sanitized.location,
      volunteersNeeded,
      sanitized.eventDescription,
      submittedAt,
      siteUrl
    );

    const emailResults = await sendBatchEmails(
      {
        from: fromEmail,
        to: sanitized.email,
        subject: 'Volunteer Support Request Received - Engage Youth Fund',
        html: userEmailHtml,
        replyTo: adminEmail,
      },
      {
        from: fromEmail,
        to: adminEmail,
        subject: `New Support Request: ${sanitized.name} - ${sanitized.date}`,
        html: adminEmailHtml,
        replyTo: sanitized.email,
      },
      env.RESEND_API_KEY
    );

    if (!emailResults.admin) {
      console.error('Failed to send admin notification email', emailResults);
      return new Response(
        JSON.stringify(buildErrorResponse(
          'Request failed to register. Please try again or contact us directly.',
          'ADMIN_EMAIL_FAILED'
        )),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!emailResults.user) {
      console.error('Failed to send user confirmation email', emailResults);
      return new Response(
        JSON.stringify(buildErrorResponse(
          'Request failed to register. Please try again or contact us directly.',
          'USER_EMAIL_FAILED'
        )),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify(buildSuccessResponse('Your support request has been received. We will confirm volunteer availability shortly.', {
        submissionId: emailResults.user?.id ?? emailResults.admin.id,
      })),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Support request handler error:', error);
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
