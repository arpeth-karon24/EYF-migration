/**
 * Site-wide search index builder.
 *
 * Aggregates every searchable surface on the site into a single JSON
 * document. Generated at build time and served at `/search-index.json`.
 *
 * The client-side search dialog downloads this once, caches it in
 * memory, and runs substring matching on every keystroke — no server
 * round-trips, no external dependencies, works offline.
 *
 * Adding a new searchable content type? Add a section to `buildIndex()`
 * that maps it to `SearchEntry`.
 */

import { getAllPosts, getUpcomingEvents, getPastEvents } from "@/sanity/queries";
import { BLOG_POSTS } from "@/constants/blogContent";
import { FAQ_ITEMS } from "@/constants/faqContent";

/**
 * One row in the search index. Kept tiny on purpose — fewer bytes per
 * entry means the whole index loads faster on slow connections.
 */
export interface SearchEntry {
  /** Stable unique id, used as React `key` */
  id: string;
  /** Display heading in results */
  title: string;
  /** Short snippet shown under the title */
  description: string;
  /** Site-relative path to navigate to */
  path: string;
  /** Category tag — colors the result chip and groups visually */
  type: "Page" | "Event" | "News" | "FAQ" | "Team";
}

/** ── Static pages (everything in src/app/*) ───────────────────────────── */
const STATIC_PAGES: SearchEntry[] = [
  {
    id: "page-home",
    title: "Home",
    description:
      "Engage Youth Foundation — empowering youth through programs, mentorship, and community impact.",
    path: "/",
    type: "Page",
  },
  {
    id: "page-about",
    title: "About us",
    description:
      "Learn about our mission, vision, evolution, and the board of directors driving our community work.",
    path: "/about-us/",
    type: "Page",
  },
  {
    id: "page-team",
    title: "Our Team",
    description:
      "Meet the Board of Directors and Advisory Board of Engage Youth Foundation.",
    path: "/team/",
    type: "Page",
  },
  {
    id: "page-events",
    title: "Events",
    description:
      "Upcoming and past community events, workshops, and gatherings.",
    path: "/events/",
    type: "Page",
  },
  {
    id: "page-activities",
    title: "Activities",
    description:
      "Upcoming activities and community programs organized by EYF.",
    path: "/activities/",
    type: "Page",
  },
  {
    id: "page-past-events",
    title: "Past Events",
    description: "Recap of past events and community gatherings.",
    path: "/past-events/",
    type: "Page",
  },
  {
    id: "page-news",
    title: "News and Social Media",
    description:
      "Latest stories, blog posts, and community updates from EYF.",
    path: "/news-and-social-media/",
    type: "Page",
  },
  {
    id: "page-donation",
    title: "Donation",
    description:
      "Support EYF through monetary or in-kind donations. Help fund programs, mentorship, and community impact.",
    path: "/donation/",
    type: "Page",
  },
  {
    id: "page-volunteer",
    title: "Volunteer with us",
    description:
      "Join the EYF volunteer community. Help with programs, mentorship, events, and community projects.",
    path: "/volunteer-with-us/",
    type: "Page",
  },
  {
    id: "page-request-volunteer",
    title: "Request Volunteer Support",
    description:
      "Request volunteer support from EYF for your event or community initiative.",
    path: "/request-for-volunteer/",
    type: "Page",
  },
  {
    id: "page-faq",
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about EYF, getting involved, donations, and more.",
    path: "/faq/",
    type: "Page",
  },
  {
    id: "page-contact",
    title: "Contact us",
    description:
      "Get in touch with EYF. We respond within 1–2 business days.",
    path: "/contact-us/",
    type: "Page",
  },
  {
    id: "page-privacy",
    title: "Privacy Policy",
    description:
      "How EYF collects, uses, and protects your personal information.",
    path: "/privacy-policy/",
    type: "Page",
  },
  {
    id: "page-terms",
    title: "Terms of Service",
    description:
      "Terms and conditions governing use of the EYF website.",
    path: "/terms/",
    type: "Page",
  },
];

/** ── Aggregate everything into one index ──────────────────────────────── */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
  // Sanity-driven content (events, posts) — fall back to static constants
  // if Sanity returns nothing so the index is always usable.
  const [sanityPosts, upcomingEvents, pastEvents] = await Promise.all([
    getAllPosts(),
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  const posts: SearchEntry[] =
    sanityPosts.length > 0
      ? sanityPosts.map((p) => ({
          id: `post-${p._id}`,
          title: p.title,
          description: p.excerpt,
          path: `/news-and-social-media/${p.slug}/`,
          type: "News",
        }))
      : BLOG_POSTS.map((p) => ({
          id: `post-${p.id}`,
          title: p.title,
          description: p.excerpt,
          path: `/news-and-social-media/${p.slug}/`,
          type: "News",
        }));

  const events: SearchEntry[] = [...upcomingEvents, ...pastEvents].map((e) => ({
    id: `event-${e._id}`,
    title: e.title,
    description: `${e.location}${e.description ? ` — ${e.description.slice(0, 120)}` : ""}`,
    // All events surface on /events/ — we could deep-link to anchor IDs later
    path: "/events/",
    type: "Event",
  }));

  const faqs: SearchEntry[] = FAQ_ITEMS.map((item, i) => ({
    id: `faq-${i}`,
    title: item.question,
    description:
      item.answer.length > 140 ? `${item.answer.slice(0, 140)}…` : item.answer,
    path: "/faq/",
    type: "FAQ",
  }));

  return [...STATIC_PAGES, ...posts, ...events, ...faqs];
}
