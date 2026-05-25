/**
 * Cloudflare Pages Function: POST /api/contact
 * Handles contact form submissions
 */

import {
  validateRequired,
  validateEmailField,
  validateMinLength,
  sanitizeObject,
  buildValidationErrorResponse,
  buildSuccessResponse,
  buildErrorResponse,
} from '@/lib/validation';
import { validateTurnstileToken } from '@/lib/turnstile';
import { sendBatchEmails } from '@/lib/resend';
import { contactInquiryUserEmail, contactInquiryAdminEmail } from '@/lib/emailTemplates';
import { ValidationError } from '@/types/api';

interface Env {
  ADMIN_EMAIL?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

interface ContactRequest {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  turnsileToken?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // Parse request body
    let body: ContactRequest;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify(buildErrorResponse('Invalid JSON in request body')), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate Turnstile token first
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

    const subjectError = validateRequired(body.subject, 'Subject');
    if (subjectError) errors.push(subjectError);

    const messageError = validateMinLength(body.message, 2, 'Message');
    if (messageError) errors.push(messageError);

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
      subject: body.subject || '',
      message: body.message || '',
    });

    // Get admin email from environment
    const adminEmail = env.ADMIN_EMAIL || 'admin@engage-youth.org';
    const submittedAt = new Date().toLocaleString();

    // Generate email templates
    const userEmailHtml = contactInquiryUserEmail(sanitized.name, sanitized.email);
    const adminEmailHtml = contactInquiryAdminEmail(
      sanitized.name,
      sanitized.email,
      sanitized.subject,
      sanitized.message,
      submittedAt
    );

    // Send emails
    const emailResults = await sendBatchEmails(
      {
        to: sanitized.email,
        subject: 'We Received Your Inquiry - Engage Youth Fund',
        html: userEmailHtml,
        replyTo: adminEmail,
      },
      {
        to: adminEmail,
        subject: `New Contact Inquiry: ${sanitized.subject}`,
        html: adminEmailHtml,
        replyTo: sanitized.email,
      },
      env.RESEND_API_KEY
    );

    if (!emailResults.admin) {
      console.error('Failed to send admin notification email', emailResults);
      return new Response(
        JSON.stringify(buildErrorResponse(
          'Message failed to send. Please try again or contact us directly.',
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
          'Message failed to send. Please try again or contact us directly.',
          'USER_EMAIL_FAILED'
        )),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify(buildSuccessResponse('Your message has been received. We will respond shortly.', {
        submissionId: emailResults.user?.id ?? emailResults.admin.id,
      })),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Contact form handler error:', error);
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
