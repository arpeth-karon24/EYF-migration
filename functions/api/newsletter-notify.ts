/**
 * Cloudflare Pages Function: POST /api/newsletter-notify
 *
 * Called by a Sanity webhook whenever a "post" document is published.
 * Sends a notification email to every active newsletter subscriber.
 *
 * Security:
 *   • Verifies the Sanity HMAC-SHA256 webhook signature
 *     (header: "sanity-webhook-signature: t=...,v1=...").
 *   • Idempotent — a "notificationLog" Sanity doc prevents duplicate sends
 *     even if the webhook fires or retries multiple times for the same post.
 *
 * Required Cloudflare environment variables:
 *   NEWSLETTER_WEBHOOK_SECRET      — must match the secret set in Sanity
 *   NEWSLETTER_UNSUBSCRIBE_SECRET  — HMAC key for signing unsubscribe URLs
 *   RESEND_API_KEY
 *   SANITY_WRITE_TOKEN
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   NEXT_PUBLIC_SITE_URL           — e.g. https://engage-youth.org
 */

import { sendManyEmails } from '@/lib/resend';
import { postNotificationEmail } from '@/lib/emailTemplates';
import {
  getActiveSubscribers,
  wasPostNotified,
  markPostNotified,
  generateUnsubscribeToken,
  verifySanitySignature,
} from '../lib/newsletterSubscribers';

interface Env {
  NEWSLETTER_WEBHOOK_SECRET?: string;
  NEWSLETTER_UNSUBSCRIBE_SECRET?: string;
  RESEND_API_KEY?: string;
  ADMIN_EMAIL?: string;
  SANITY_WRITE_TOKEN?: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
}

/** Shape of the document Sanity sends in the webhook payload. */
interface SanityPostPayload {
  _id?: string;
  _type?: string;
  title?: string;
  slug?: { current?: string } | string;
  excerpt?: string;
  /** Plain-text body excerpt projected by the webhook */
  bodyExcerpt?: string;
  publishedAt?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
  const rawBody = await request.text();

  // ── 1. Verify Sanity webhook signature ─────────────────────────────────
  const webhookSecret = env.NEWSLETTER_WEBHOOK_SECRET;
  if (webhookSecret) {
    const sigHeader = request.headers.get('sanity-webhook-signature') ?? '';
    const valid = await verifySanitySignature(rawBody, sigHeader, webhookSecret);
    if (!valid) {
      console.warn('[newsletter-notify] Invalid webhook signature — request rejected.');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    console.warn('[newsletter-notify] NEWSLETTER_WEBHOOK_SECRET not set — skipping signature check.');
  }

  // ── 2. Parse + validate payload ─────────────────────────────────────────
  let payload: SanityPostPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Only handle published post documents
  if (payload._type !== 'post') {
    return new Response(JSON.stringify({ ok: true, skipped: 'not a post' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const postId = payload._id;
  const postTitle = payload.title;
  const slugValue = typeof payload.slug === 'string'
    ? payload.slug
    : payload.slug?.current;

  if (!postId || !postTitle || !slugValue) {
    console.warn('[newsletter-notify] Missing required fields (_id, title, slug):', payload);
    return new Response(JSON.stringify({ error: 'Missing required post fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 3. Idempotency check ────────────────────────────────────────────────
  const alreadySent = await wasPostNotified(env, postId);
  if (alreadySent) {
    console.log(`[newsletter-notify] Notification already sent for post ${postId} — skipping.`);
    return new Response(JSON.stringify({ ok: true, skipped: 'already_notified' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 4. Get subscribers ──────────────────────────────────────────────────
  const subscribers = await getActiveSubscribers(env);
  if (subscribers.length === 0) {
    console.log('[newsletter-notify] No active subscribers — nothing to send.');
    await markPostNotified(env, postId, 0);
    return new Response(JSON.stringify({ ok: true, sent: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 5. Build email list ─────────────────────────────────────────────────
  const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? 'https://engage-youth-web.pages.dev').replace(/\/$/, '');
  const postUrl = `${siteUrl}/news-and-social-media/${slugValue}`;
  const excerpt = payload.excerpt ?? payload.bodyExcerpt ?? '';
  const unsubSecret = env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? 'fallback-secret';

  const emails = await Promise.all(
    subscribers.map(async (recipientEmail) => {
      const token = await generateUnsubscribeToken(recipientEmail, unsubSecret);
      const unsubUrl = `${siteUrl}/api/newsletter-unsubscribe?email=${encodeURIComponent(recipientEmail)}&token=${token}`;
      return {
        to: recipientEmail,
        subject: `New post: ${postTitle}`,
        html: postNotificationEmail(postTitle, postUrl, excerpt, unsubUrl),
      };
    })
  );

  // ── 6. Send in batches ──────────────────────────────────────────────────
  const { sent, failed } = await sendManyEmails(emails, env.RESEND_API_KEY);
  console.log(`[newsletter-notify] post=${postId} sent=${sent} failed=${failed} total=${subscribers.length}`);

  // ── 7. Mark as notified (idempotency guard) ─────────────────────────────
  await markPostNotified(env, postId, sent);

  return new Response(
    JSON.stringify({ ok: true, sent, failed, total: subscribers.length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
  } catch (error) {
    console.error('[newsletter-notify] Unhandled error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, sanity-webhook-signature',
    },
  });
