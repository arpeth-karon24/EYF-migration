/**
 * Centralized site identity values used across all Schema.org blocks.
 * Update these in one place and every schema block on the site reflects it.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ??
  "https://engage-youth.org";

export const SITE = {
  name: "Engage Youth Foundation",
  legalName: "Engage Youth Foundation",
  alternateName: "EYF",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo/eyf-logo.png`,
  email: "engageyouthfoundation@gmail.com",
  // Non-profit, based in Pacific Northwest
  foundingDate: "2024",
  description:
    "Non-profit engaging, empowering, and mobilizing the next generation through programs, mentorship, and community impact in the Pacific Northwest.",
  // TODO: replace with real social links once known
  sameAs: [
    "https://facebook.com",
    "https://linkedin.com",
    "https://instagram.com",
    "https://youtube.com",
  ],
} as const;

/** Build an absolute URL from a site-relative path. */
export function absUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
