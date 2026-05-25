import { Suspense } from "react";
import type { Metadata } from "next";
import { InternalPageShell } from "@/components/layout/InternalPageShell";
import { HeroSection } from "@/components/sections";
import { JsonLd } from "@/lib/schema/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema/builders";
import { SearchPageClient } from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search across Engage Youth Foundation events, news, programs, and FAQs.",
  alternates: { canonical: "/search/" },
  // Don't index the search results page itself — it's a UI, not content
  robots: { index: false, follow: true },
};

/**
 * Dedicated search page.
 *
 * Two ways to search EYF:
 * 1. Ctrl/Cmd+K from anywhere — opens the SearchDialog (instant, modal)
 * 2. This /search page — deep-linkable URL like /search?q=donation
 *
 * The page reads the `q` query parameter so users can share or bookmark
 * specific search results. Same client component, different framing.
 */
export default function SearchPage() {
  return (
    <InternalPageShell>
      <JsonLd
        id="schema-search-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Search" },
        ])}
      />

      <HeroSection
        title="Search"
        variant="internal"
        className="bg-transparent"
      />

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          {/* Suspense boundary is required because SearchPageClient uses
              useSearchParams(), which forces client-side rendering under
              static export. */}
          <Suspense
            fallback={
              <p className="font-opensans text-sm text-white/50">
                Loading search…
              </p>
            }
          >
            <SearchPageClient />
          </Suspense>
        </div>
      </section>
    </InternalPageShell>
  );
}
