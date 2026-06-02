/**
 * Schema.org structured-data builders.
 *
 * Each function returns a plain object that's compatible with the
 * <JsonLd> component. Keep these pure — no React, no DOM — so they
 * can run in server components, route handlers, and tests.
 *
 * Reference: https://schema.org/
 * Google's rich-result tester: https://search.google.com/test/rich-results
 */

import type { SanityEvent, SanityPost, SanityTeamMember } from "@/sanity/types";
import { SITE, SITE_URL, absUrl } from "./siteConfig";

/* ────────────────────────────────────────────────────────────────────────
 * Organization — used in the root layout, recognized by Google for the
 * Knowledge Panel + "About this organization" sidebar.
 * ──────────────────────────────────────────────────────────────────────── */

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: SITE.alternateName,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: SITE.logo,
      width: 900,
      height: 320,
    },
    image: SITE.logo,
    description: SITE.description,
    foundingDate: SITE.foundingDate,
    areaServed: {
      "@type": "Place",
      name: "Pacific Northwest, USA",
    },
    sameAs: SITE.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      availableLanguage: ["English"],
    },
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * WebSite — enables Google's SearchAction (sitelinks search box).
 * ──────────────────────────────────────────────────────────────────────── */

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: SITE.url,
    description: SITE.description,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * BreadcrumbList — shows navigation path in search results.
 * Pass an ordered list of crumbs from root → current page.
 * ──────────────────────────────────────────────────────────────────────── */

export interface Crumb {
  name: string;
  /** Site-relative path. Leave undefined for the final (current) crumb. */
  path?: string;
}

export function buildBreadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      // Final crumb has no `item` per Google guidelines
      ...(crumb.path ? { item: absUrl(crumb.path) } : {}),
    })),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Event — qualifies for Google's event carousel.
 * Maps a Sanity event document.
 * ──────────────────────────────────────────────────────────────────────── */

export function buildEventSchema(event: SanityEvent, imageUrl?: string | null) {
  const isOnline =
    event.eventType === "virtual" || event.eventType === "online";

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : event.eventType === "hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    location: isOnline
      ? {
          "@type": "VirtualLocation",
          url: event.registrationUrl ?? SITE.url,
        }
      : {
          "@type": "Place",
          name: event.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: event.location,
          },
        },
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(event.description ? { description: event.description } : {}),
    organizer: { "@id": `${SITE_URL}/#organization` },
    ...(event.registrationUrl
      ? {
          offers: {
            "@type": "Offer",
            url: event.registrationUrl,
            availability: "https://schema.org/InStock",
            price: "0",
            priceCurrency: "USD",
            validFrom: event.startDate,
          },
        }
      : {}),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * BlogPosting / Article — for individual news posts.
 * ──────────────────────────────────────────────────────────────────────── */

export function buildBlogPostSchema(
  post: SanityPost,
  imageUrl?: string | null,
  canonicalPath?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalPath ? absUrl(canonicalPath) : SITE_URL,
    },
    ...(post.category ? { articleSection: post.category } : {}),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * FAQPage — Google renders these as expandable Q&A in search results.
 * ──────────────────────────────────────────────────────────────────────── */

export interface FAQEntry {
  question: string;
  /** Plain text — strip any HTML from the rendered answer. */
  answer: string;
}

export function buildFAQSchema(entries: FAQEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Person — board members and team. Helps "About this organization"
 * sidebar in Google.
 * ──────────────────────────────────────────────────────────────────────── */

export function buildPersonSchema(
  member: SanityTeamMember,
  imageUrl?: string | null,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    affiliation: { "@id": `${SITE_URL}/#organization` },
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(member.bio ? { description: member.bio } : {}),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * CollectionPage — for index pages (events list, news index, etc.)
 * ──────────────────────────────────────────────────────────────────────── */

export function buildCollectionPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  itemCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: absUrl(opts.path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(opts.itemCount !== undefined
      ? { numberOfItems: opts.itemCount }
      : {}),
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * ContactPage — for /contact-us
 * ──────────────────────────────────────────────────────────────────────── */

export function buildContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Engage Youth Foundation",
    url: absUrl("/contact-us"),
    description:
      "Get in touch with Engage Youth Foundation. We respond to every inquiry within 1–2 business days.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * AboutPage — for /about-us
 * ──────────────────────────────────────────────────────────────────────── */

export function buildAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Engage Youth Foundation",
    url: absUrl("/about-us"),
    description:
      "Learn about Engage Youth Foundation's mission, vision, evolution, and the board of directors driving our community work.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
  };
}
