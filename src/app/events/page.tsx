import Link from 'next/link';
import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { BlackTitleBar } from '@/components/layout/BlackTitleBar';
import { HeroSection, ContentSection } from '@/components/sections';
import { FilterableEventsGrid } from '@/components/events/FilterableEventsGrid';
import { getUpcomingEvents, getPastEvents } from '@/sanity/queries';

/**
 * Events page — full Events index with two filterable sections:
 *   1. Upcoming events (with "Choose Events" heading)
 *   2. Past events (anchor #past for nav deep-links)
 *
 * Each section gets its own filter form (keywords / location / date /
 * category / event type) that filters that section's events live.
 */
export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <InternalPageShell>
      <HeroSection title="Events" variant="internal" className="bg-transparent" />

      {/* ── Upcoming ─────────────────────────────────────────────────── */}
      <ContentSection centered={false} className="bg-transparent">
        <div className="mx-auto max-w-5xl">
          <FilterableEventsGrid
            events={upcomingEvents}
            title="Choose Events"
            emptyStateTitle="There are currently no events."
            emptyStateBody="Check back soon for upcoming workshops, community projects, and gatherings."
          />
        </div>
      </ContentSection>

      {/* ── Past — anchor #past for nav links ────────────────────────── */}
      <BlackTitleBar id="past">Past Events</BlackTitleBar>

      <ContentSection centered={pastEvents.length === 0} className="bg-transparent pb-20">
        <div className="mx-auto max-w-5xl">
          <FilterableEventsGrid
            events={pastEvents}
            emptyStateTitle="No past events yet"
            emptyStateBody={
              <>
                Past event recaps will appear here when available. For the latest updates, visit{' '}
                <Link href="/news-and-social-media" className="text-eyf-gold underline-offset-2 hover:underline">
                  News and Social Media
                </Link>{' '}
                or subscribe to our newsletter.
              </>
            }
          />
        </div>
      </ContentSection>
    </InternalPageShell>
  );
}
