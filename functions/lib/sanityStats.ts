/**
 * Sanity write helper for the homepage stats singleton.
 *
 * Used by Cloudflare Pages Functions to bump live counters (e.g.,
 * volunteer count) when a form submission succeeds. We talk directly to
 * Sanity's HTTP mutation API rather than importing @sanity/client so this
 * stays compatible with the Workers runtime without bundling extra deps.
 *
 * Authentication:
 *   • Reads SANITY_WRITE_TOKEN (server-only env var, set in Cloudflare
 *     Pages → Settings → Environment Variables).
 *   • Reads NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET
 *     for the API URL.
 *
 * Behavior:
 *   • Fire-and-forget — caller awaits the promise but failures are
 *     swallowed (logged to console.error). Never blocks the user response.
 *   • If any env var is missing, the function is a no-op — useful for
 *     local dev where you don't want stat writes against production.
 *   • Uses .setIfMissing + .inc so the very first volunteer increments
 *     a missing/0 field to 1 instead of crashing.
 */

const SANITY_API_VERSION = '2024-01-01';
const FALLBACK_DOC_ID = 'siteStats'; // Used only when no doc exists yet.

interface StatsEnv {
  SANITY_WRITE_TOKEN?: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
}

/**
 * Bump the volunteer count by 1 in the Sanity siteStats document.
 * Resolves true on success, false otherwise (never throws).
 *
 * Strategy:
 *   1. Query Sanity for an existing siteStats document (by type, not ID).
 *      This is intentionally flexible — admins can create the document in
 *      Studio without worrying about specifying a custom ID.
 *   2. If one exists → patch that exact document.
 *   3. If none exists → create one with a stable fallback ID. The next
 *      signup will find it via the query above.
 */
export async function incrementVolunteerCount(env: StatsEnv): Promise<boolean> {
  const token = env.SANITY_WRITE_TOKEN;
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

  if (!token || !projectId) {
    console.warn('[sanityStats] Skipping increment — SANITY_WRITE_TOKEN or PROJECT_ID missing.');
    return false;
  }

  const apiBase = `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    // ── Step 1: find the existing siteStats document (oldest if multiple). ──
    const findQuery = `*[_type == "siteStats"] | order(_createdAt asc) [0] { _id }`;
    const findUrl = `${apiBase}/query/${dataset}?query=${encodeURIComponent(findQuery)}`;
    const findRes = await fetch(findUrl, { headers });

    if (!findRes.ok) {
      const errText = await findRes.text().catch(() => '<no body>');
      console.error(`[sanityStats] Failed to query existing siteStats: HTTP ${findRes.status}`, errText);
      return false;
    }

    const findData = (await findRes.json()) as { result?: { _id?: string } | null };
    const existingId = findData.result?._id;

    // ── Step 2: build the mutation. ─────────────────────────────────────────
    const targetId = existingId ?? FALLBACK_DOC_ID;
    const body = {
      mutations: [
        // Ensure the doc exists. If `existingId` is set, this is a no-op.
        // Otherwise we seed it with sane defaults so .inc() works on the
        // very first signup.
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

    const mutateUrl = `${apiBase}/mutate/${dataset}`;
    const res = await fetch(mutateUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '<no body>');
      console.error(`[sanityStats] HTTP ${res.status} from Sanity mutate:`, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[sanityStats] Failed to increment volunteer count:', err);
    return false;
  }
}
