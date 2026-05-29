'use client';

/**
 * EventsClientWrapper
 *
 * Splits ALL events into upcoming / past using the visitor's actual current
 * date — not the build-time snapshot. This means an event added with a
 * tomorrow's date will automatically move to "Past Events" when that date
 * passes, without requiring a redeploy.
 *
 * Sorting:
 *   • Upcoming → ascending by startDate  (soonest first)
 *   • Past     → descending by startDate (most recent first)
 *
 * Cancelled events follow the same date rule:
 *   • Cancelled + future startDate → Upcoming  (with "CANCELLED" badge)
 *   • Cancelled + past startDate   → Past      (historical record)
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SanityEvent } from '@/sanity/types';
import { FilterableEventsGrid } from './FilterableEventsGrid';
import { BlackTitleBar } from '@/components/layout/BlackTitleBar';
import { ContentSection } from '@/components/sections';

interface Props {
  /** Every event from Sanity — no pre-filtering. */
  allEvents: SanityEvent[];
  /**
   * Build-time split passed from the server component so the pre-rendered
   * HTML contains real event data (good for SEO / no blank flash).
   * The client re-computes this immediately on mount.
   */
  initialUpcoming: SanityEvent[];
  initialPast: SanityEvent[];
}

function splitByDate(events: SanityEvent[], now: Date) {
  const upcoming = events
    .filter((e) => new Date(e.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const past = events
    .filter((e) => new Date(e.startDate) <= now)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return { upcoming, past };
}

export function EventsClientWrapper({ allEvents, initialUpcoming, initialPast }: Props) {
  const [upcoming, setUpcoming] = useState<SanityEvent[]>(initialUpcoming);
  const [past, setPast] = useState<SanityEvent[]>(initialPast);

  useEffect(() => {
    // Re-split using the browser's actual current time.
    // Runs immediately after hydration — visitor always sees the correct split.
    const { upcoming: u, past: p } = splitByDate(allEvents, new Date());
    setUpcoming(u);
    setPast(p);
  }, [allEvents]);

  return (
    <>
      {/* ── Upcoming ──────────────────────────────────────────────────────── */}
      <ContentSection centered={false} className="bg-transparent">
        <div className="mx-auto max-w-5xl">
          <FilterableEventsGrid
            events={upcoming}
            title="Choose Events"
            emptyStateTitle="There are currently no upcoming events."
            emptyStateBody="Check back soon for upcoming workshops, community projects, and gatherings."
          />
        </div>
      </ContentSection>

      {/* ── Past — anchor #past for nav deep-links ────────────────────────── */}
      <BlackTitleBar id="past">Past Events</BlackTitleBar>

      <ContentSection centered={past.length === 0} className="bg-transparent pb-20">
        <div className="mx-auto max-w-5xl">
          <FilterableEventsGrid
            events={past}
            emptyStateTitle="No past events yet"
            emptyStateBody={
              <>
                Past event recaps will appear here when available. For the latest updates, visit{' '}
                <Link
                  href="/news-and-social-media"
                  className="text-eyf-gold underline-offset-2 hover:underline"
                >
                  News and Social Media
                </Link>{' '}
                or subscribe to our newsletter.
              </>
            }
          />
        </div>
      </ContentSection>
    </>
  );
}
