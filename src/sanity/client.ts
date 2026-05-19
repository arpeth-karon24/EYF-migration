import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImage } from './types';

export function getSanityClient(): SanityClient | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    perspective: 'published',
  });
}

export function urlFor(source: SanityImage): string | null {
  const client = getSanityClient();
  if (!client || !source) return null;
  return imageUrlBuilder(client).image(source).auto('format').url();
}

export function urlForSize(source: SanityImage, width: number, height?: number): string | null {
  const client = getSanityClient();
  if (!client || !source) return null;
  let builder = imageUrlBuilder(client).image(source).auto('format').width(width);
  if (height) builder = builder.height(height);
  return builder.url();
}
