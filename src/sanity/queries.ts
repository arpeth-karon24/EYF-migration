import type { SanityPost, SanityEvent, SanityTeamMember } from './types';
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

export async function getUpcomingEvents(): Promise<SanityEvent[]> {
  const client = getSanityClient();
  if (!client) return [];
  return client.fetch<SanityEvent[]>(
    `*[_type == "event" && status == "upcoming"] | order(startDate asc) { ${EVENT_FIELDS} }`
  );
}

export async function getPastEvents(): Promise<SanityEvent[]> {
  const client = getSanityClient();
  if (!client) return [];
  return client.fetch<SanityEvent[]>(
    `*[_type == "event" && status == "past"] | order(startDate desc) { ${EVENT_FIELDS} }`
  );
}

export async function getAllEventsCount(): Promise<number | null> {
  const client = getSanityClient();
  if (!client) return null; // null = Sanity not configured, use fallback
  return client.fetch<number>(`count(*[_type == "event"])`);
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
