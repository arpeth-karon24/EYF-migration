import type { Metadata } from "next";
import Link from "next/link";
import { InternalPageShell } from "@/components/layout/InternalPageShell";
import { HeroSection } from "@/components/sections";
import { FilterableEventsGrid } from "@/components/events/FilterableEventsGrid";
import { getUpcomingEvents, getPastEvents } from "@/sanity/queries";
import { urlFor } from "@/sanity/client";
import { JsonLd } from "@/lib/schema/JsonLd";
import {
  buildEventSchema,
  buildCollectionPageSchema,
  buildBreadcrumbSchema,
} from "@/lib/schema/builders";

type Props = { params: Promise<{ slug: string }> };

const SLUG_META: Record<string, { title: string; heading: string }> = {
  activities:    { title: "Upcoming / Ongoing Events", heading: "Upcoming Events" },
  "past-events": { title: "Past Events",               heading: "Past Events"     },
};

export function generateStaticParams() {
  return Object.keys(SLUG_META).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = SLUG_META[slug];
  return {
    title: meta?.title ?? slug,
    alternates: { canonical: `/${slug}` },
  };
}

/**
 * Catch-all page for /activities and /past-events.
 * Each renders the same filterable events grid as the main /events page.
 */
export default async function StaticSitePage({ params }: Props) {
  const { slug } = await params;
  const meta = SLUG_META[slug];

  const events =
    slug === "activities" ? await getUpcomingEvents() : await getPastEvents();

  // ── Schema.org — Event schemas for each item + page-level metadata
  const eventSchemas = events.map((event) =>
    buildEventSchema(event, event.mainImage ? urlFor(event.mainImage) : null),
  );

  return (
    <InternalPageShell>
      <JsonLd
        id={`schema-${slug}-collection`}
        data={buildCollectionPageSchema({
          name: `${meta?.title ?? slug} — Engage Youth Foundation`,
          description:
            slug === "activities"
              ? "Upcoming community events, workshops, and gatherings organized by Engage Youth Foundation."
              : "Past community events and recaps from Engage Youth Foundation.",
          path: `/${slug}/`,
          itemCount: events.length,
        })}
      />
      <JsonLd
        id={`schema-${slug}-breadcrumb`}
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events/" },
          { name: meta?.heading ?? slug },
        ])}
      />
      {eventSchemas.map((schema, i) => (
        <JsonLd key={`schema-event-${i}`} data={schema} />
      ))}

      <HeroSection title={meta?.heading ?? slug} variant="internal" className="bg-transparent" />

      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-container px-4">
          <FilterableEventsGrid
            events={events}
            emptyStateTitle={
              slug === "activities"
                ? "No upcoming events at this time."
                : "No past events yet."
            }
            emptyStateBody={
              <>
                Check back soon or{" "}
                <Link href="/events" className="text-eyf-gold underline-offset-2 hover:underline">
                  visit the Events page
                </Link>{" "}
                for more details.
              </>
            }
          />
        </div>
      </section>
    </InternalPageShell>
  );
}
