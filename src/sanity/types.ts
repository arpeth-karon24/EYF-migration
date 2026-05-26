import type { PortableTextBlock } from '@portabletext/react';

export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  category: string;
  location?: string;
  excerpt: string;
  mainImage?: SanityImage;
  body?: PortableTextBlock[];
  sourceUrl?: string;
}

export interface SanityEvent {
  _id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate?: string;
  location: string;
  category?: string;
  eventType?: string;
  status: 'upcoming' | 'past' | 'cancelled';
  description?: string;
  mainImage?: SanityImage;
  registrationUrl?: string;
}

export interface SanityTeamMember {
  _id: string;
  name: string;
  role: string;
  memberType: 'board' | 'advisory' | 'staff';
  photo?: SanityImage;
  bio?: string;
  order: number;
}

/** Singleton document for live homepage counters. */
export interface SanitySiteStats {
  _id: string;
  volunteerCount: number;
  volunteerHours: number;
  lastUpdated?: string;
}
