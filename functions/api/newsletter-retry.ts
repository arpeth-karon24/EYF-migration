/**
 * Cloudflare Pages Function: POST /api/newsletter-retry
 *
 * Retries failed newsletter deliveries for a given post.  Queries "deliveryLog"
 * Sanity documents where status == "failed" for the specified postId, rebuilds
 * the notification email for each, and re-attempts delivery via Resend.
 *
 * Each retry increments the "retryCount" field on the deliveryLog document,
 * preserving a full audit trail of attempts.
 *
 * Security:
 *   • Requires Authorization: Bearer <NEWSLETTER_WEBHOOK_SECRET> header.
 *     This is an admin-only endpoint — not linked from any public page.
 *
 * Request body (JSON):
 *   { "postId": "<sanity-post-id>", "postTitle": "...", "slug": "...", "excerpt": "..." }
 *
 * postTitle, slug, and excerpt are optional — if omitted the email falls back
 * to a generic subject/body, but providing them improves email quality.
 *
 * Required Cloudflare environment variables:
 *   NEWSLETTER_WEBHOOK_SECRET
 *   NEWSLETTER_UNSUBSCRIBE_SECRET
 *   RESEND_API_KEY
 *   SANITY_WRITE_TOKEN
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   NEXT_PUBLIC_SITE_URL
 */

import { sendManyEmails } from '@/lib/resend';
import { postNotificationEmail } from '@/lib/emailTemplates';
import {
  getFailedDeliveries,
  updateDeliveryLogs,
  generateUnsubscribeToken,
} from '../lib/newsletterSubscribers';

interface Env {
  NEWSLETTER_WEBHOOK_SECRET?: string;
  NEWSLETTER_UNSUBSCRIBE_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  SANITY_WRITE_TOKEN?: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
}

interface RetryBody {
  postId?: string;
  postTitle?: string;
  slug?: string;
  excerpt?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // ── 1. Authenticate ───────────────────────────────────────────────────
    const secret = env.NEWSLETTER_WEBHOOK_SECRET;
    if (!secret) {
      console.warn('[newsletter-retry] NEWSLETTER_WEBHOOK_SECRET not configured.');
      return json({ error: 'Server misconfiguration' }, 500);
    }

    const authHeader = request.headers.get('Authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token || token !== secret) {
      return json({ error: 'Unauthorized' }, 401);
    }

    // ── 2. Parse body ─────────────────────────────────────────────────────
    let body: RetryBody;
    try {
      body = await request.json() as RetryBody;
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const { postId, postTitle, slug, excerpt } = body;
    if (!postId) {
      return json({ error: 'postId is required' }, 400);
    }

    // ── 3. Load failed deliveries ─────────────────────────────────────────
    const failures = await getFailedDeliveries(env, postId);
    if (failures.length === 0) {
      console.log(`[newsletter-retry] No failed deliveries for post ${postId}.`);
      return json({ ok: true, retried: 0, sent: 0, failed: 0 });
    }

    console.log(`[newsletter-retry] post=${postId} retrying ${failures.length} failed deliveries.`);

    // ── 4. Build emails ───────────────────────────────────────────────────
    const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? 'https://engage-youth-web.pages.dev').replace(/\/$/, '');
    const resolvedTitle = postTitle ?? 'New post from Engage Youth Foundation';
    const resolvedSlug = slug ?? '';
    const postUrl = resolvedSlug
      ? `${siteUrl}/news-and-social-media/${resolvedSlug}`
      : siteUrl;
    const resolvedExcerpt = excerpt ?? '';
    const unsubSecret = env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? 'fallback-secret';
    const fromEmail = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const emails = await Promise.all(
      failures.map(async ({ subscriberEmail }) => {
        const token = await generateUnsubscribeToken(subscriberEmail, unsubSecret);
        const unsubUrl =
          `${siteUrl}/api/newsletter-unsubscribe` +
          `?email=${encodeURIComponent(subscriberEmail)}&token=${token}`;
        return {
          from: fromEmail,
          to: subscriberEmail,
          subject: `New post: ${resolvedTitle}`,
          html: postNotificationEmail(resolvedTitle, postUrl, resolvedExcerpt, unsubUrl, siteUrl),
        };
      })
    );

    // ── 5. Send ───────────────────────────────────────────────────────────
    const { sent, failed, results } = await sendManyEmails(emails, env.RESEND_API_KEY);
    console.log(`[newsletter-retry] post=${postId} retried=${failures.length} sent=${sent} failed=${failed}`);

    // ── 6. Update delivery logs (isRetry=true increments retryCount) ──────
    await updateDeliveryLogs(env, postId, results, true);

    return json({ ok: true, retried: failures.length, sent, failed });
  } catch (error) {
    console.error('[newsletter-retry] Unhandled error:', error);
    return json({ error: 'Internal server error' }, 500);
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
