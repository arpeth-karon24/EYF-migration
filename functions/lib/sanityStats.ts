/**
 * Sanity write helpers for volunteer registrations.
 *
 * We talk directly to Sanity's HTTP API (query + mutate) rather than
 * importing @sanity/client, so this stays compatible with the Cloudflare
 * Workers runtime without bundling extra deps.
 *
 * Deduplication model:
 *   • Each unique volunteer becomes ONE document whose _id is derived
 *     deterministically from the normalized email
 *     (e.g. "volunteer.john_example_com").
 *   • createIfNotExists with that ID means a repeat submission from the
 *     same email is a no-op — no duplicate doc, no double-count.
 *   • The homepage volunteer count = manual baseline + count of these docs.
 *
 * Authentication:
 *   • SANITY_WRITE_TOKEN — server-only, set in Cloudflare Pages env vars
 *     (use an ENCRYPTED secret so it survives `wrangler pages deploy`).
 *   • NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET for the URL.
 *
 * All functions degrade gracefully: if env is missing or Sanity errors,
 * they log and return a safe value so the volunteer form never breaks.
 */

const SANITY_API_VERSION = '2024-01-01';

interface VolunteerEnv {
  SANITY_WRITE_TOKEN?: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
}

export interface VolunteerRecordInput {
  name: string;
  email: string;
  contactNumber?: string;
  city?: string;
  eventTitle?: string;
  availability?: string;
  skillsAndInterests?: string;
}

/** Normalize an email for dedup: lowercase + trim. */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Deterministic Sanity document ID for a volunteer, derived from the email.
 * Same email → same ID → dedup-safe. Sanity IDs allow [a-zA-Z0-9._-] only.
 */
function volunteerDocId(normalizedEmail: string): string {
  const safe = normalizedEmail.replace(/[^a-z0-9]/g, '_');
  return `volunteer.${safe}`;
}

function sanityConfig(env: VolunteerEnv) {
  const token = env.SANITY_WRITE_TOKEN;
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
  if (!token || !projectId) return null;
  return {
    token,
    base: `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data`,
    dataset,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}

/**
 * Check whether a volunteer with this email already exists.
 * Returns:
 *   • true  — a registration with this email exists (duplicate)
 *   • false — no existing registration (new volunteer)
 *   • null  — could not determine (Sanity not configured / errored) →
 *             caller should treat as "proceed" so real users aren't blocked.
 */
export async function getVolunteerByEmail(
  env: VolunteerEnv,
  rawEmail: string,
): Promise<boolean | null> {
  const cfg = sanityConfig(env);
  if (!cfg) {
    console.warn('[volunteers] Skipping dedup check — SANITY_WRITE_TOKEN or PROJECT_ID missing.');
    return null;
  }

  const docId = volunteerDocId(normalizeEmail(rawEmail));
  const query = `defined(*[_id == "${docId}"][0]._id)`;
  const url = `${cfg.base}/query/${cfg.dataset}?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, { headers: cfg.headers });
    if (!res.ok) {
      console.error(`[volunteers] dedup query HTTP ${res.status}`);
      return null;
    }
    const data = (await res.json()) as { result?: boolean };
    return data.result === true;
  } catch (err) {
    console.error('[volunteers] dedup query failed:', err);
    return null;
  }
}

/**
 * Create a volunteer registration document (idempotent via deterministic ID).
 * Returns true on success, false otherwise. Never throws.
 *
 * Uses createIfNotExists, so even under a race (two simultaneous submissions
 * with the same email) only one document is ever created.
 */
export async function createVolunteerRecord(
  env: VolunteerEnv,
  input: VolunteerRecordInput,
): Promise<boolean> {
  const cfg = sanityConfig(env);
  if (!cfg) {
    console.warn('[volunteers] Skipping record creation — SANITY_WRITE_TOKEN or PROJECT_ID missing.');
    return false;
  }

  const normalized = normalizeEmail(input.email);
  const docId = volunteerDocId(normalized);

  const body = {
    mutations: [
      {
        createIfNotExists: {
          _id: docId,
          _type: 'volunteerRegistration',
          name: input.name,
          email: input.email,
          ...(input.contactNumber ? { contactNumber: input.contactNumber } : {}),
          ...(input.city ? { city: input.city } : {}),
          ...(input.eventTitle ? { eventTitle: input.eventTitle } : {}),
          ...(input.availability ? { availability: input.availability } : {}),
          ...(input.skillsAndInterests ? { skillsAndInterests: input.skillsAndInterests } : {}),
          registeredAt: new Date().toISOString(),
        },
      },
    ],
  };

  try {
    const res = await fetch(`${cfg.base}/mutate/${cfg.dataset}`, {
      method: 'POST',
      headers: cfg.headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '<no body>');
      console.error(`[volunteers] create HTTP ${res.status}:`, errText);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[volunteers] create failed:', err);
    return false;
  }
}
