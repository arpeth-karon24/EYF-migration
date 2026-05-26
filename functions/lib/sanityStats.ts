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
const SITE_STATS_DOC_ID = 'siteStats';

interface StatsEnv {
  SANITY_WRITE_TOKEN?: string;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
}

/**
 * Bump the volunteer count by 1 in the Sanity siteStats singleton.
 * Resolves true on success, false otherwise (never throws).
 */
export async function incrementVolunteerCount(env: StatsEnv): Promise<boolean> {
  const token = env.SANITY_WRITE_TOKEN;
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

  if (!token || !projectId) {
    // Not configured — no-op so dev / preview environments don't break.
    console.warn('[sanityStats] Skipping increment — SANITY_WRITE_TOKEN or PROJECT_ID missing.');
    return false;
  }

  const url = `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${dataset}`;

  // Combined mutation:
  //   1. createIfNotExists — guarantees the singleton exists before patching.
  //   2. patch.setIfMissing — ensures volunteerCount is a number (not undefined)
  //      so .inc works on first run.
  //   3. patch.inc — atomic increment.
  //   4. patch.set lastUpdated — audit trail.
  const body = {
    mutations: [
      {
        createIfNotExists: {
          _id: SITE_STATS_DOC_ID,
          _type: 'siteStats',
          volunteerCount: 0,
          volunteerHours: 0,
        },
      },
      {
        patch: {
          id: SITE_STATS_DOC_ID,
          setIfMissing: { volunteerCount: 0 },
          inc: { volunteerCount: 1 },
          set: { lastUpdated: new Date().toISOString() },
        },
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '<no body>');
      console.error(`[sanityStats] HTTP ${res.status} from Sanity:`, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[sanityStats] Failed to increment volunteer count:', err);
    return false;
  }
}
