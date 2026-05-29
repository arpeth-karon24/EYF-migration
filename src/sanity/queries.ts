import type { SanityPost, SanityEvent, SanityTeamMember, SanitySiteStats } from './types';
import { getSanityClient } from './client';

// ─── GROQ Queries ────────────────────────────────────────────────────────────

const POST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  category,
  location,
  excerpt,
  mainImage,
  body,
  sourceUrl
`;

const EVENT_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  startDate,
  endDate,
  location,
  category,
  eventType,
  status,
  description,
  mainImage,
  registrationUrl
`;

const TEAM_FIELDS = `
  _id,
  name,
  role,
  memberType,
  photo,
  bio,
  order
`;

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<SanityPost[]> {
  const client = getSanityClient();
  if (!client) return [];
  return client.fetch<SanityPost[]>(
    `*[_type == "post"] | order(publishedAt desc) { ${POST_FIELDS} }`
  );
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  const client = getSanityClient();
  if (!client) return null;
  const result = await client.fetch<SanityPost | null>(
    `*[_type == "post" && slug.current == $slug][0] { ${POST_FIELDS} }`,
    { slug }
  );
  return result ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const client = getSanityClient();
  if (!client) return [];
  const result = await client.fetch<{ slug: string }[]>(
    `*[_type == "post"] { "slug": slug.current }`
  );
  return result.map((r) => r.slug);
}

// ─── Events ──────────────────────────────────────────────────────────────────

/**
 * "Upcoming" includes both genuinely upcoming events AND cancelled events
 * whose start date is still in the future. The cancelled ones surface in
 * the same section so visitors who saw the original promotion learn the
 * event is off — preventing the "showed up at the venue" failure mode.
 * EventCard renders them with a clear "CANCELLED" badge.
 */
export async function getUpcomingEvents(): Promise<SanityEvent[]> {
  const client = getSanityClient();
  if (!client) {
    console.log('[Sanity] No client — NEXT_PUBLIC_SANITY_PROJECT_ID missing');
    return [];
  }
  const results = await client.fetch<SanityEvent[]>(
    `*[_type == "event" && (status == "upcoming" || (status == "cancelled" && startDate >= now()))] | order(startDate asc) { ${EVENT_FIELDS} }`
  );
  console.log(`[Sanity] getUpcomingEvents → ${results.length} events found`);
  return results;
}

/**
 * "Past" includes events explicitly marked `past` AND cancelled events
 * whose start date is already in the past — preserving the historical
 * record that the event was planned (and then cancelled).
 */
export async function getPastEvents(): Promise<SanityEvent[]> {
  const client = getSanityClient();
  if (!client) return [];
  return client.fetch<SanityEvent[]>(
    `*[_type == "event" && (status == "past" || (status == "cancelled" && startDate < now()))] | order(startDate desc) { ${EVENT_FIELDS} }`
  );
}

/**
 * Fetch ALL events with no date/status filter — used by the events page to
 * split upcoming vs past client-side based on the visitor's actual current
 * time (not the build-time snapshot). Sorted ascending so the client-side
 * split inherits a sensible base order.
 */
export async function getAllEvents(): Promise<SanityEvent[]> {
  const client = getSanityClient();
  if (!client) return [];
  return client.fetch<SanityEvent[]>(
    `*[_type == "event"] | order(startDate asc) { ${EVENT_FIELDS} }`
  );
}

export async function getAllEventsCount(): Promise<number | null> {
  const client = getSanityClient();
  if (!client) return null; // null = Sanity not configured, use fallback
  return client.fetch<number>(`count(*[_type == "event"])`);
}

/**
 * Fetch a single event by slug — used by the /events/[slug]/ detail page.
 * Returns null if not found or Sanity isn't configured.
 */
export async function getEventBySlug(slug: string): Promise<SanityEvent | null> {
  const client = getSanityClient();
  if (!client) return null;
  const result = await client.fetch<SanityEvent | null>(
    `*[_type == "event" && slug.current == $slug][0] { ${EVENT_FIELDS} }`,
    { slug }
  );
  return result ?? null;
}

/**
 * List every event slug — used by generateStaticParams for the
 * /events/[slug]/ route under static export.
 */
export async function getAllEventSlugs(): Promise<string[]> {
  const client = getSanityClient();
  if (!client) return [];
  const result = await client.fetch<{ slug: string }[]>(
    `*[_type == "event" && defined(slug.current)] { "slug": slug.current }`
  );
  return result.map((r) => r.slug);
}

// ─── Team Members ─────────────────────────────────────────────────────────────

export async function getBoardMembers(): Promise<SanityTeamMember[]> {
  const client = getSanityClient();
  if (!client) return [];
  return client.fetch<SanityTeamMember[]>(
    `*[_type == "teamMember" && memberType == "board"] | order(order asc) { ${TEAM_FIELDS} }`
  );
}

export async function getAdvisoryBoard(): Promise<SanityTeamMember[]> {
  const client = getSanityClient();
  if (!client) return [];
  return client.fetch<SanityTeamMember[]>(
    `*[_type == "teamMember" && memberType == "advisory"] | order(order asc) { ${TEAM_FIELDS} }`
  );
}

// ─── Site Stats (homepage counters) ───────────────────────────────────────────

/**
 * Fetch the "Site Stats" document used by the homepage counters.
 * Treated as a singleton by convention — if multiple ever exist we take
 * the oldest, so a duplicate created by accident doesn't make the homepage
 * stats flip-flop.
 *
 * Returns null if Sanity isn't configured OR no document exists yet —
 * the homepage falls back to HOME_STATS (which is 0/0/0) in that case.
 */
export async function getSiteStats(): Promise<SanitySiteStats | null> {
  const client = getSanityClient();
  if (!client) return null;
  const result = await client.fetch<SanitySiteStats | null>(
    `*[_type == "siteStats"] | order(_createdAt asc) [0] {
      _id,
      volunteerCount,
      volunteerHours,
      lastUpdated
    }`
  );
  return result ?? null;
}

/**
 * Count of unique volunteer registrations (one doc per unique email).
 * This is the auto-tracked, deduplicated portion of the homepage
 * "Volunteer Number".
 *
 * Returns:
 *   • number — the actual count (0 means "0 records exist", a real answer)
 *   • null   — couldn't determine (Sanity not configured, no read token,
 *              or query errored). The caller should fall back.
 *
 * Why the null vs 0 distinction matters:
 *   The unauthenticated public Sanity API does NOT return
 *   volunteerRegistration documents — it would always answer 0. So if no
 *   read token is set, returning 0 would be a lie. We return null instead,
 *   so HomePage can fall back to siteStats.volunteerCount. Once
 *   SANITY_API_READ_TOKEN is configured, this returns the true count
 *   (including 0 when records have been deleted), and the fallback does
 *   NOT kick in — so deletes correctly reduce the homepage number.
 */
export async function getVolunteerCount(): Promise<number | null> {
  // Without a read token, the public API returns 0 regardless of reality —
  // explicitly bail so the caller falls back to siteStats.
  if (!process.env.SANITY_API_READ_TOKEN) return null;
  const client = getSanityClient();
  if (!client) return null;
  try {
    const count = await client.fetch<number>(
      `count(*[_type == "volunteerRegistration"])`
    );
    return count ?? 0;
  } catch (err) {
    console.error('[queries] getVolunteerCount failed:', err);
    return null;
  }
}
