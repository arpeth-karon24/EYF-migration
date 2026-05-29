import type { Metadata } from 'next';
import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection } from '@/components/sections';
import { EventsClientWrapper } from '@/components/events/EventsClientWrapper';
import { getAllEvents } from '@/sanity/queries';
import { urlFor } from '@/sanity/client';
import { JsonLd } from '@/lib/schema/JsonLd';
import {
  buildEventSchema,
  buildCollectionPageSchema,
  buildBreadcrumbSchema,
} from '@/lib/schema/builders';
import { SanityEvent } from '@/sanity/types';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Browse upcoming and past community events, workshops, mentorship programs, and gatherings organized by Engage Youth Foundation. Filter by location, category, or date.',
  alternates: { canonical: '/events/' },
};

/**
 * Events page — fetches ALL events once, then passes them to
 * EventsClientWrapper which splits upcoming / past using the visitor's
 * actual current date (not the build-time snapshot).
 *
 * This means an event added with tomorrow's date automatically moves to
 * "Past Events" once that date passes — no manual status change needed
 * and no redeploy required.
 */
export default async function EventsPage() {
  const allEvents = await getAllEvents();

  // ── Build-time split ──────────────────────────────────────────────────
  // Used only for:
  //   1. The pre-rendered HTML (SEO / no blank flash on first load)
  //   2. Schema.org JSON-LD event markup
  // The client component re-computes this with the visitor's real date.
  const buildNow = new Date();

  function splitAtBuildTime(events: SanityEvent[]) {
    const upcoming = events
      .filter((e) => new Date(e.startDate) > buildNow)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const past = events
      .filter((e) => new Date(e.startDate) <= buildNow)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    return { upcoming, past };
  }

  const { upcoming: initialUpcoming, past: initialPast } = splitAtBuildTime(allEvents);

  // ── Schema.org ─────────────────────────────────────────────────────────
  const eventSchemas = initialUpcoming.map((event) =>
    buildEventSchema(event, event.mainImage ? urlFor(event.mainImage) : null),
  );

  return (
    <InternalPageShell>
      <JsonLd
        id="schema-events-collection"
        data={buildCollectionPageSchema({
          name: 'Events — Engage Youth Foundation',
          description:
            'Upcoming and past community events, workshops, and gatherings organized by Engage Youth Foundation.',
          path: '/events/',
          itemCount: allEvents.length,
        })}
      />
      <JsonLd
        id="schema-events-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Events' },
        ])}
      />
      {eventSchemas.map((schema, i) => (
        <JsonLd key={`schema-event-${i}`} data={schema} />
      ))}

      <HeroSection title="Events" variant="internal" className="bg-transparent" />

      {/* Client wrapper handles date-based split on every visit */}
      <EventsClientWrapper
        allEvents={allEvents}
        initialUpcoming={initialUpcoming}
        initialPast={initialPast}
      />
    </InternalPageShell>
  );
}
