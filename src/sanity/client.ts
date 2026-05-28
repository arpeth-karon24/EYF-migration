import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImage } from './types';

export function getSanityClient(): SanityClient | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;

  // Optional build-time read token. When present, the client can read
  // documents that aren't returned to anonymous requests (notably
  // volunteerRegistration). Without the token, the client falls back to
  // unauthenticated reads — events, posts, siteStats, etc. still work.
  // Set SANITY_API_READ_TOKEN in GitHub Actions secrets to enable.
  const token = process.env.SANITY_API_READ_TOKEN;

  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    perspective: 'published',
    ...(token ? { token } : {}),
  });
}

export function urlFor(source: SanityImage): string | null {
  const client = getSanityClient();
  // Reject images stuck in upload state (no asset reference yet)
  if (!client || !source || !source.asset) return null;
  return imageUrlBuilder(client).image(source).auto('format').url();
}

export function urlForSize(source: SanityImage, width: number, height?: number): string | null {
  const client = getSanityClient();
  // Reject images stuck in upload state (no asset reference yet)
  if (!client || !source || !source.asset) return null;
  let builder = imageUrlBuilder(client).image(source).auto('format').width(width);
  if (height) builder = builder.height(height);
  return builder.url();
}
