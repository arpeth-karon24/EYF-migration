/**
 * Cloudflare Pages Function: POST /api/newsletter
 * Handles newsletter subscription requests
 */

import {
  validateEmailField,
  buildValidationErrorResponse,
  buildSuccessResponse,
  buildErrorResponse,
} from '@/lib/validation';
import { validateTurnstileToken } from '@/lib/turnstile';
import { sendBatchEmails } from '@/lib/resend';
import { newsletterUserEmail, newsletterAdminEmail } from '@/lib/emailTemplates';
import { subscribeEmail } from '../lib/newsletterSubscribers';
import { ValidationError } from '@/types/api';

interface Env {
  ADMIN_EMAIL?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
  SANITY_WRITE_TOKEN?: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
}

interface NewsletterRequest {
  email?: string;
  turnsileToken?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // Parse request body
    let body: NewsletterRequest;
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

    const emailError = validateEmailField(body.email);
    if (emailError) errors.push(emailError);

    if (errors.length > 0) {
      return new Response(JSON.stringify(buildValidationErrorResponse(errors)), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

        const email = (body.email || '').toLowerCase().trim();
    const adminEmail = env.ADMIN_EMAIL || 'admin@engage-youth.org';
    const fromEmail = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const submittedAt = new Date().toLocaleString();
    const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://engage-youth-web.pages.dev';

    // ── Persist subscriber in Sanity (idempotent) ──────────────────────
    const subscribeResult = await subscribeEmail(env, email);
    if (subscribeResult === 'already_subscribed') {
      return new Response(
        JSON.stringify(buildSuccessResponse(
          "You're already subscribed! We'll keep you updated with our latest news.",
        )),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }
    // 'error' from subscribeEmail is non-fatal — emails still go out, but
    // we log it so it can be investigated. Don't block the user.

    const userEmailHtml = newsletterUserEmail(email, siteUrl);
    const adminEmailHtml = newsletterAdminEmail(email, submittedAt, siteUrl);

    const emailResults = await sendBatchEmails(
      {
        from: fromEmail,
        to: email,
        subject: 'Welcome to Our Newsletter - Engage Youth Foundation',
        html: userEmailHtml,
        replyTo: adminEmail,
      },
      {
        from: fromEmail,
        to: adminEmail,
        subject: `New Newsletter Subscriber: ${email}`,
        html: adminEmailHtml,
      },
      env.RESEND_API_KEY
    );

    // Log failures but never block the subscription — the record is already
    // saved in Sanity. Email delivery issues are operational, not user errors.
    if (!emailResults.admin) {
      console.warn('[newsletter] Admin notification email failed — subscriber still saved.');
    }
    if (!emailResults.user) {
      console.warn('[newsletter] User confirmation email failed (Resend sandbox restriction?) — subscriber still saved.');
    }

    return new Response(
      JSON.stringify(buildSuccessResponse('Thank you for subscribing to our newsletter!', {
        submissionId: emailResults.user?.id ?? emailResults.admin?.id,
      })),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Newsletter subscription handler error:', error);
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
