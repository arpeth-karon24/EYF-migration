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
 * Resolve a Sanity event _id to its human-readable title.
 * Returns the title on success, null if the id doesn't match an event.
 *
 * The volunteer form dropdown uses event._id as the value, so the API
 * receives an opaque ID (e.g. "1cbe06ab-8fd9-..."). We resolve it to the
 * actual title so the email confirmation and the saved Sanity record both
 * show "Beach Cleanliness Drive" instead of a UUID.
 */
export async function getEventTitleById(
  env: VolunteerEnv,
  rawId: string,
): Promise<string | null> {
  if (!rawId) return null;
  // The form sends "general" for the "General volunteering" option — not an event ID.
  if (rawId === 'general') return null;
  const cfg = sanityConfig(env);
  if (!cfg) return null;
  // Sanitize the id to safely embed in GROQ (only allow [-_.a-zA-Z0-9]).
  const safeId = rawId.replace(/[^-_.a-zA-Z0-9]/g, '');
  if (!safeId) return null;
  try {
    const query = `*[_id == "${safeId}"][0].title`;
    const url = `${cfg.base}/query/${cfg.dataset}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: cfg.headers });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: string | null };
    return typeof data.result === 'string' && data.result.length > 0 ? data.result : null;
  } catch (err) {
    console.error('[stats] getEventTitleById failed:', err);
    return null;
  }
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
 * Bump the homepage volunteer counter by 1 in the siteStats singleton.
 *
 * Why a separate counter instead of counting volunteerRegistration docs:
 * the public (unauthenticated) Sanity API — which the static homepage build
 * uses — does NOT return volunteerRegistration documents, but it DOES return
 * the siteStats document. So the homepage can only read the count from
 * siteStats. We increment it here, on each NEW (deduped) registration, so the
 * homepage reflects unique volunteers. The volunteerRegistration records still
 * exist for dedup + the admin CRM (read by this Function with the token).
 *
 * Finds the existing siteStats doc (oldest by type) and patches it; creates
 * one only if none exists. Returns true on success. Never throws.
 */
export async function incrementSiteStatsVolunteerCount(env: VolunteerEnv): Promise<boolean> {
  const cfg = sanityConfig(env);
  if (!cfg) {
    console.warn('[stats] Skipping volunteerCount bump — SANITY_WRITE_TOKEN or PROJECT_ID missing.');
    return false;
  }

  try {
    // Find the siteStats doc the homepage reads (oldest by type).
    const findQuery = `*[_type == "siteStats"] | order(_createdAt asc) [0] { _id }`;
    const findUrl = `${cfg.base}/query/${cfg.dataset}?query=${encodeURIComponent(findQuery)}`;
    const findRes = await fetch(findUrl, { headers: cfg.headers });
    if (!findRes.ok) {
      console.error(`[stats] siteStats lookup HTTP ${findRes.status}`);
      return false;
    }
    const findData = (await findRes.json()) as { result?: { _id?: string } | null };
    const targetId = findData.result?._id ?? 'siteStats';

    const body = {
      mutations: [
        {
          createIfNotExists: {
            _id: targetId,
            _type: 'siteStats',
            volunteerCount: 0,
            volunteerHours: 0,
          },
        },
        {
          patch: {
            id: targetId,
            setIfMissing: { volunteerCount: 0 },
            inc: { volunteerCount: 1 },
            set: { lastUpdated: new Date().toISOString() },
          },
        },
      ],
    };

    const res = await fetch(`${cfg.base}/mutate/${cfg.dataset}`, {
      method: 'POST',
      headers: cfg.headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '<no body>');
      console.error(`[stats] volunteerCount bump HTTP ${res.status}:`, errText);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[stats] volunteerCount bump failed:', err);
    return false;
  }
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
