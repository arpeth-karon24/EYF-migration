/**
 * Cloudflare Pages Function: POST /api/newsletter-notify
 *
 * Called by a Sanity webhook whenever a "post" document is published.
 * Sends a notification email to every active subscriber who was subscribed
 * at or before the article's publishedAt date (no historical article sends).
 *
 * Delivery guarantees:
 *   • Post-level idempotency via "notificationLog" Sanity doc.
 *   • Subscriber-level idempotency via "deliveryLog" Sanity docs — already-sent
 *     addresses are skipped on webhook retries and partial-failure recoveries.
 *   • Per-subscriber status (pending → sent | failed) is written to Sanity
 *     so the newsletter-retry endpoint can pick up failures.
 *
 * Security:
 *   • Verifies the Sanity HMAC-SHA256 webhook signature
 *     (header: "sanity-webhook-signature: t=...,v1=...").
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
  getActiveSubscribersWithDate,
  wasPostNotified,
  markPostNotified,
  generateUnsubscribeToken,
  verifySanitySignature,
  createPendingDeliveryLogs,
  updateDeliveryLogs,
  getSentDeliveryEmails,
} from '../lib/newsletterSubscribers';

interface Env {
  NEWSLETTER_WEBHOOK_SECRET?: string;
  NEWSLETTER_UNSUBSCRIBE_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
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

  // ── 3. Post-level idempotency check ─────────────────────────────────────
  const alreadySent = await wasPostNotified(env, postId);
  if (alreadySent) {
    console.log(`[newsletter-notify] Notification already sent for post ${postId} — skipping.`);
    return new Response(JSON.stringify({ ok: true, skipped: 'already_notified' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 4. Get subscribers and filter by eligibility ────────────────────────
  // Only subscribers who existed at or before the article's publish date
  // receive this notification — no retroactive sends to new subscribers.
  const publishedAt = payload.publishedAt ?? null;
  const allSubscribers = await getActiveSubscribersWithDate(env);

  const eligible = allSubscribers.filter((sub) => {
    if (!sub.subscribedAt || !publishedAt) return true;
    return new Date(sub.subscribedAt) <= new Date(publishedAt);
  });

  if (eligible.length === 0) {
    console.log('[newsletter-notify] No eligible subscribers — nothing to send.');
    await markPostNotified(env, postId, 0, 0);
    return new Response(JSON.stringify({ ok: true, sent: 0, eligible: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 5. Subscriber-level idempotency — skip already delivered ────────────
  // Handles webhook retries after a partial failure or mid-send crash.
  const alreadySentEmails = await getSentDeliveryEmails(env, postId);
  const pending = eligible.filter((sub) => !alreadySentEmails.has(sub.email));

  if (pending.length === 0) {
    console.log(`[newsletter-notify] All ${eligible.length} eligible subscribers already received post ${postId}.`);
    await markPostNotified(env, postId, eligible.length, 0);
    return new Response(JSON.stringify({ ok: true, skipped: 'all_delivered', sent: eligible.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 6. Create pending delivery log entries ──────────────────────────────
  const pendingEmails = pending.map((s) => s.email);
  await createPendingDeliveryLogs(env, postId, pendingEmails);

  // ── 7. Build email list ─────────────────────────────────────────────────
  const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? 'https://engage-youth-web.pages.dev').replace(/\/$/, '');
  const postUrl = `${siteUrl}/news-and-social-media/${slugValue}`;
  const excerpt = payload.excerpt ?? payload.bodyExcerpt ?? '';
  const unsubSecret = env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? 'fallback-secret';
  const fromEmail = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const emails = await Promise.all(
    pendingEmails.map(async (recipientEmail) => {
      const token = await generateUnsubscribeToken(recipientEmail, unsubSecret);
      const unsubUrl = `${siteUrl}/api/newsletter-unsubscribe?email=${encodeURIComponent(recipientEmail)}&token=${token}`;
      return {
        from: fromEmail,
        to: recipientEmail,
        subject: `New post: ${postTitle}`,
        html: postNotificationEmail(postTitle, postUrl, excerpt, unsubUrl),
      };
    })
  );

  // ── 8. Send in batches, tracking per-subscriber results ─────────────────
  const { sent, failed, results } = await sendManyEmails(emails, env.RESEND_API_KEY);
  console.log(`[newsletter-notify] post=${postId} eligible=${eligible.length} pending=${pending.length} sent=${sent} failed=${failed}`);

  // ── 9. Write per-subscriber delivery status ─────────────────────────────
  await updateDeliveryLogs(env, postId, results, false);

  // ── 10. Mark post as notified (idempotency guard for future webhook fires) ─
  const totalSent = sent + alreadySentEmails.size;
  await markPostNotified(env, postId, totalSent, failed);

  return new Response(
    JSON.stringify({ ok: true, sent, failed, eligible: eligible.length, total: allSubscribers.length }),
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
