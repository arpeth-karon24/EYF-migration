/**
 * Cloudflare Pages Function: POST /api/volunteer
 * Handles volunteer registration form submissions
 */

import {
  validateRequired,
  validateEmailField,
  validatePhone,
  validateMustBeTrue,
  sanitizeObject,
  buildValidationErrorResponse,
  buildSuccessResponse,
  buildErrorResponse,
} from '@/lib/validation';
import { validateTurnstileToken } from '@/lib/turnstile';
import { sendBatchEmails } from '@/lib/resend';
import { volunteerRegistrationUserEmail, volunteerRegistrationAdminEmail } from '@/lib/emailTemplates';
import { ValidationError } from '@/types/api';

interface Env {
  ADMIN_EMAIL?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

interface VolunteerRequest {
  name?: string;
  email?: string;
  contactNumber?: string;
  eventTitle?: string;
  city?: string;
  availability?: string;
  skillsAndInterests?: string;
  motivation?: string;
  emergencyContact?: string;
  agreeToGuidelines?: boolean;
  turnsileToken?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // Parse request body
    let body: VolunteerRequest;
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

    const phoneError = validatePhone(body.contactNumber, 'Contact Number');
    if (phoneError) errors.push(phoneError);

    const eventError = validateRequired(body.eventTitle, 'Event Title');
    if (eventError) errors.push(eventError);

    const cityError = validateRequired(body.city, 'City');
    if (cityError) errors.push(cityError);

    const availabilityError = validateRequired(body.availability, 'Availability');
    if (availabilityError) errors.push(availabilityError);

    const skillsError = validateRequired(body.skillsAndInterests, 'Skills and Interests');
    if (skillsError) errors.push(skillsError);

    const motivationError = validateRequired(body.motivation, 'Motivation');
    if (motivationError) errors.push(motivationError);

    const emergencyError = validateRequired(body.emergencyContact, 'Emergency Contact');
    if (emergencyError) errors.push(emergencyError);

    const agreementError = validateMustBeTrue(body.agreeToGuidelines, 'Guidelines Agreement');
    if (agreementError) errors.push(agreementError);

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
      contactNumber: body.contactNumber || '',
      eventTitle: body.eventTitle || '',
      city: body.city || '',
      availability: body.availability || '',
      skillsAndInterests: body.skillsAndInterests || '',
      motivation: body.motivation || '',
      emergencyContact: body.emergencyContact || '',
    });

    const adminEmail = env.ADMIN_EMAIL || 'admin@engage-youth.org';
    const submittedAt = new Date().toLocaleString();

    const userEmailHtml = volunteerRegistrationUserEmail(sanitized.name, sanitized.email, sanitized.eventTitle);
    const adminEmailHtml = volunteerRegistrationAdminEmail(
      sanitized.name,
      sanitized.email,
      sanitized.contactNumber,
      sanitized.eventTitle,
      sanitized.city,
      sanitized.availability,
      sanitized.skillsAndInterests,
      sanitized.motivation,
      submittedAt
    );

    const emailResults = await sendBatchEmails(
      {
        to: sanitized.email,
        subject: 'Welcome to the Volunteer Team - Engage Youth Fund',
        html: userEmailHtml,
        replyTo: adminEmail,
      },
      {
        to: adminEmail,
        subject: `New Volunteer Registration: ${sanitized.name}`,
        html: adminEmailHtml,
        replyTo: sanitized.email,
      },
      env.RESEND_API_KEY
    );

    if (!emailResults.user) {
      console.error('Failed to send volunteer confirmation email', emailResults);
      return new Response(
        JSON.stringify(buildErrorResponse(
          'Registration received but failed to send confirmation email. Please try again or contact us directly.',
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
      JSON.stringify(buildSuccessResponse('Your volunteer registration has been received. We will be in touch shortly.', {
        submissionId: emailResults.user.id,
      })),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Volunteer registration handler error:', error);
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
