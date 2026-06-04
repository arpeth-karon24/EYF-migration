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
import {
  getVolunteerByEmail,
  createVolunteerRecord,
  incrementSiteStatsVolunteerCount,
  incrementSiteStatsVolunteerHours,
  getEventEstimatedHours,
  getEventTitleById,
} from '../lib/sanityStats';

interface Env {
  ADMIN_EMAIL?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
  // Sanity write credentials — used to bump the homepage volunteerCount.
  // Set in Cloudflare Pages → Settings → Environment Variables.
  SANITY_WRITE_TOKEN?: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
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

    // ── Deduplication ───────────────────────────────────────────────────────
    // Block repeat registrations from the same email so the volunteer count
    // reflects unique people, not raw submissions. If the dedup check can't
    // run (Sanity not configured), we proceed — better to allow a possible
    // duplicate than to block a legitimate new volunteer.
    const alreadyRegistered = await getVolunteerByEmail(env, sanitized.email);
    if (alreadyRegistered === true) {
      return new Response(
        JSON.stringify(buildSuccessResponse(
          "You're already registered as a volunteer with this email. Thank you for your continued interest — we'll be in touch about upcoming opportunities.",
          { alreadyRegistered: true }
        )),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // ── Resolve the event _id from the dropdown to a human-readable title ────
    // The "Event title" dropdown sends event._id as the value (e.g. a UUID).
    // Resolve it to the actual event name so emails + the Sanity record show
    // "Beach Cleanup" instead of an opaque ID. Falls back to a friendly label
    // for "general" or unresolved IDs.
    let eventTitleResolved =
      sanitized.eventTitle === 'general'
        ? 'General volunteering'
        : sanitized.eventTitle;
    if (sanitized.eventTitle && sanitized.eventTitle !== 'general') {
      const lookedUp = await getEventTitleById(env, sanitized.eventTitle);
      if (lookedUp) eventTitleResolved = lookedUp;
    }

    // ── Capture the lead FIRST — the record is the source of truth ───────────
    // The volunteer record (not the email) is what the homepage count and the
    // admin's CRM rely on, so it must NOT depend on whether a confirmation
    // email delivers. We create it BEFORE sending emails, so a valid
    // registration is captured even if email fails (e.g. Resend can't reach an
    // external address while the sending domain is still unverified).
    // Awaited so the Worker isn't torn down before the write completes; the
    // deterministic doc ID prevents duplicates even under concurrency.
    let recordSaved = false;
    try {
      recordSaved = await createVolunteerRecord(env, {
        name: sanitized.name,
        email: sanitized.email,
        contactNumber: sanitized.contactNumber,
        city: sanitized.city,
        eventTitle: eventTitleResolved,
        availability: sanitized.availability,
        skillsAndInterests: sanitized.skillsAndInterests,
      });
    } catch (err) {
      console.error('Failed to create Sanity volunteer record:', err);
    }

    // Bump the homepage counter. The static homepage reads volunteer numbers
    // from siteStats (publicly visible), NOT from volunteerRegistration docs
    // (which the unauthenticated API can't see). We only get here for NEW
    // volunteers — duplicates returned earlier — so the count stays unique.
    // Awaited so the Worker doesn't tear down before the write completes.
    try {
      await incrementSiteStatsVolunteerCount(env);
    } catch (err) {
      console.error('Failed to bump siteStats volunteerCount:', err);
    }

    // Bump siteStats.volunteerHours by the registered event's estimate.
    // Auto-skips when the volunteer chose "General volunteering" (eventTitle
    // is "general") or when the event has no estimate set (returns 0).
    try {
      const hours = await getEventEstimatedHours(env, sanitized.eventTitle);
      if (hours > 0) {
        await incrementSiteStatsVolunteerHours(env, hours);
      }
    } catch (err) {
      console.error('Failed to bump siteStats volunteerHours:', err);
    }

    const adminEmail = env.ADMIN_EMAIL || 'admin@engage-youth.org';
    const fromEmail = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const submittedAt = new Date().toLocaleString();

    // Use the RESOLVED event title (not the raw _id) in both emails so the
    // user can see which event they registered for and the admin can read it
    // at a glance instead of decoding a UUID.
    const userEmailHtml = volunteerRegistrationUserEmail(sanitized.name, sanitized.email, eventTitleResolved);
    const adminEmailHtml = volunteerRegistrationAdminEmail(
      sanitized.name,
      sanitized.email,
      sanitized.contactNumber,
      eventTitleResolved,
      sanitized.city,
      sanitized.availability,
      sanitized.skillsAndInterests,
      sanitized.motivation,
      submittedAt
    );

    // ── Emails are best-effort notifications, NOT a gate on registration ─────
    // While the Resend sending domain is unverified, confirmation emails to
    // external addresses fail. That must not block a valid registration — the
    // record is already saved above. We log failures for visibility; once the
    // domain is verified, both emails deliver normally and these become no-ops.
    const emailResults = await sendBatchEmails(
      {
        from: fromEmail,
        to: sanitized.email,
        subject: 'Welcome to the Volunteer Team - Engage Youth Fund',
        html: userEmailHtml,
        replyTo: adminEmail,
      },
      {
        from: fromEmail,
        to: adminEmail,
        subject: `New Volunteer Registration: ${sanitized.name}`,
        html: adminEmailHtml,
        replyTo: sanitized.email,
      },
      env.RESEND_API_KEY
    );

    if (!emailResults.admin) {
      console.warn('Volunteer admin notification email failed (record still saved)', emailResults);
    }
    if (!emailResults.user) {
      console.warn(
        'Volunteer user confirmation email failed — likely Resend unverified-domain block (record still saved)',
        emailResults,
      );
    }

    return new Response(
      JSON.stringify(buildSuccessResponse('Your volunteer registration has been received. We will be in touch shortly.', {
        // Guard with optional chaining — either email may be null now that
        // email delivery is best-effort and no longer blocks registration.
        submissionId: emailResults.user?.id ?? emailResults.admin?.id ?? null,
        recordSaved,
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
