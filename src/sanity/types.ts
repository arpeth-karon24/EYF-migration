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
  /** Only set when the event is cancelled. Upcoming/past is derived from startDate. */
  status?: 'cancelled';
  description?: string;
  mainImage?: SanityImage;
  registrationUrl?: string;
  /** Hours each volunteer is expected to contribute — drives auto hours tracking. */
  estimatedHoursPerVolunteer?: number;
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
  /** Manual baseline — historical/offline volunteers not tracked via the site. */
  volunteerCount: number;
  volunteerHours: number;
  lastUpdated?: string;
}

/** One document per unique volunteer (deduped by email at write time). */
export interface SanityVolunteerRegistration {
  _id: string;
  name: string;
  email: string;
  contactNumber?: string;
  city?: string;
  eventTitle?: string;
  availability?: string;
  skillsAndInterests?: string;
  registeredAt?: string;
}
