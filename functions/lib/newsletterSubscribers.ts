/**
 * Sanity helpers for newsletter subscribers.
 *
 * Storage model:
 *   • Each subscriber = one Sanity document of type "newsletterSubscriber"
 *     with a deterministic _id derived from the normalised email
 *     (e.g. "subscriber.john_doe_example_com").
 *   • createIfNotExists keeps subscriptions idempotent.
 *   • Unsubscribing sets active=false (soft-delete so history is kept).
 *
 * Notification dedup:
 *   • When a post notification is dispatched, a "notificationLog" document
 *     is created with _id = "notiflog.<safe-post-id>".
 *   • Before sending, we check for that document — if it exists we skip,
 *     so Sanity webhook retries never result in duplicate emails.
 *
 * All functions fail gracefully and never throw.
 */

const API_VERSION = '2024-01-01';

interface NLEnv {
  SANITY_WRITE_TOKEN?: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
}

function cfg(env: NLEnv) {
  const { SANITY_WRITE_TOKEN: token, NEXT_PUBLIC_SANITY_PROJECT_ID: project } = env;
  if (!token || !project) return null;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
  const base = `https://${project}.api.sanity.io/v${API_VERSION}/data`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  return { base, dataset, headers };
}

function subscriberDocId(email: string): string {
  const safe = email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  return `subscriber.${safe}`;
}

function notifLogDocId(postId: string): string {
  const safe = postId.replace(/[^a-z0-9]/g, '_');
  return `notiflog.${safe}`;
}

// ─── Subscribe ────────────────────────────────────────────────────────────────

export type SubscribeResult = 'subscribed' | 'already_subscribed' | 'resubscribed' | 'error';

export async function subscribeEmail(env: NLEnv, rawEmail: string): Promise<SubscribeResult> {
  const c = cfg(env);
  if (!c) return 'error';

  const email = rawEmail.toLowerCase().trim();
  const docId = subscriberDocId(email);

  // Check if document already exists
  try {
    const checkUrl = `${c.base}/query/${c.dataset}?query=${encodeURIComponent(
      `*[_id == "${docId}"][0]{ active }`
    )}`;
    const checkRes = await fetch(checkUrl, { headers: c.headers });
    if (checkRes.ok) {
      const data = (await checkRes.json()) as { result?: { active?: boolean } | null };
      if (data.result !== null && data.result !== undefined) {
        if (data.result.active === false) {
          // Previously unsubscribed — reactivate
          await fetch(`${c.base}/mutate/${c.dataset}`, {
            method: 'POST',
            headers: c.headers,
            body: JSON.stringify({
              mutations: [{
                patch: {
                  id: docId,
                  set: { active: true, resubscribedAt: new Date().toISOString() },
                  unset: ['unsubscribedAt'],
                },
              }],
            }),
          });
          return 'resubscribed';
        }
        // Already active subscriber
        return 'already_subscribed';
      }
    }
  } catch (err) {
    console.error('[newsletter] subscribe dedup check failed:', err);
  }

  // Create new subscriber
  try {
    const res = await fetch(`${c.base}/mutate/${c.dataset}`, {
      method: 'POST',
      headers: c.headers,
      body: JSON.stringify({
        mutations: [{
          createIfNotExists: {
            _id: docId,
            _type: 'newsletterSubscriber',
            email,
            subscribedAt: new Date().toISOString(),
            active: true,
          },
        }],
      }),
    });
    if (!res.ok) {
      console.error('[newsletter] subscribe create HTTP', res.status);
      return 'error';
    }
    return 'subscribed';
  } catch (err) {
    console.error('[newsletter] subscribe create failed:', err);
    return 'error';
  }
}

// ─── Get active subscribers ───────────────────────────────────────────────────

export async function getActiveSubscribers(env: NLEnv): Promise<string[]> {
  const c = cfg(env);
  if (!c) return [];
  try {
    const query = `*[_type == "newsletterSubscriber" && active == true].email`;
    const url = `${c.base}/query/${c.dataset}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: c.headers });
    if (!res.ok) return [];
    const data = (await res.json()) as { result?: string[] };
    return Array.isArray(data.result) ? data.result.filter(Boolean) : [];
  } catch (err) {
    console.error('[newsletter] getActiveSubscribers failed:', err);
    return [];
  }
}

// ─── Unsubscribe ──────────────────────────────────────────────────────────────

export async function unsubscribeEmail(env: NLEnv, rawEmail: string): Promise<boolean> {
  const c = cfg(env);
  if (!c) return false;
  const docId = subscriberDocId(rawEmail.toLowerCase().trim());
  try {
    const res = await fetch(`${c.base}/mutate/${c.dataset}`, {
      method: 'POST',
      headers: c.headers,
      body: JSON.stringify({
        mutations: [{
          patch: {
            id: docId,
            set: { active: false, unsubscribedAt: new Date().toISOString() },
          },
        }],
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[newsletter] unsubscribe failed:', err);
    return false;
  }
}

// ─── Notification dedup ───────────────────────────────────────────────────────

/** Returns true if we already dispatched a notification for this post. */
export async function wasPostNotified(env: NLEnv, postId: string): Promise<boolean> {
  const c = cfg(env);
  if (!c) return false;
  const docId = notifLogDocId(postId);
  try {
    const query = `defined(*[_id == "${docId}"][0]._id)`;
    const url = `${c.base}/query/${c.dataset}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: c.headers });
    if (!res.ok) return false;
    const data = (await res.json()) as { result?: boolean };
    return data.result === true;
  } catch {
    return false;
  }
}

/** Create the idempotency log entry so retries don't resend. */
export async function markPostNotified(
  env: NLEnv,
  postId: string,
  recipientCount: number,
): Promise<void> {
  const c = cfg(env);
  if (!c) return;
  try {
    await fetch(`${c.base}/mutate/${c.dataset}`, {
      method: 'POST',
      headers: c.headers,
      body: JSON.stringify({
        mutations: [{
          createIfNotExists: {
            _id: notifLogDocId(postId),
            _type: 'notificationLog',
            postId,
            sentAt: new Date().toISOString(),
            recipientCount,
          },
        }],
      }),
    });
  } catch (err) {
    console.error('[newsletter] markPostNotified failed:', err);
  }
}

// ─── HMAC helpers (Web Crypto — Cloudflare Workers runtime) ──────────────────

/**
 * Generate a URL-safe HMAC-SHA256 token for an email address.
 * Used as the unsubscribe link token so only the server can produce valid links.
 */
export async function generateUnsubscribeToken(email: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const buf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(email.toLowerCase().trim()));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify the HMAC-SHA256 signature from Sanity's webhook.
 * Header format: "t=TIMESTAMP,v1=HEXSIG"
 */
export async function verifySanitySignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  try {
    const parts = signatureHeader.split(',').map((p) => p.trim());
    const t = parts.find((p) => p.startsWith('t='))?.slice(2);
    const v1 = parts.find((p) => p.startsWith('v1='))?.slice(3);
    if (!t || !v1) return false;

    const payload = `${t}.${rawBody}`;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const buf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    const computed = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison
    return computed.length === v1.length && computed === v1;
  } catch {
    return false;
  }
}
