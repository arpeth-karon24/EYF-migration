import type { Metadata } from "next";
import { HomePage } from "@/sections/home/HomePage";

/**
 * Root page — Schema.org Organization + WebSite are injected globally
 * via the root layout, so no per-page JSON-LD is required here.
 * Any future home-only schemas (e.g., featured Event lists) can be added
 * via <JsonLd /> alongside <HomePage />.
 *
 * Metadata is explicit here (rather than inheriting layout default)
 * so we can use a homepage-tailored description that mentions our
 * primary calls-to-action (donate / volunteer / events).
 */
export const metadata: Metadata = {
  // The layout's title template adds "| Engage Youth Foundation" to every
  // page. For the homepage we want JUST the org name with no suffix, so
  // override the template by providing `absolute`.
  title: { absolute: "Engage Youth Foundation — Empowering Youth, Building Futures" },
  description:
    "Engage Youth Foundation (EYF) is a 501(c)(3) non-profit empowering the next generation through programs, mentorship, events, and community projects. Volunteer, donate, or join an upcoming event.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
