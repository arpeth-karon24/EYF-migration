import Image from 'next/image';
import Link from 'next/link';
import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { BlackTitleBar } from '@/components/layout/BlackTitleBar';
import { HeroSection, ContentSection } from '@/components/sections';
import { EVENT_CATEGORIES, EVENT_TYPES } from '@/constants/eventFilters';
import { getUpcomingEvents, getPastEvents } from '@/sanity/queries';
import { urlFor } from '@/sanity/client';
import type { SanityEvent } from '@/sanity/types';

function formatEventDate(start: string, end?: string): string {
  const s = new Date(start).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
  if (!end) return s;
  const e = new Date(end).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
  return s === e ? s : `${s} – ${e}`;
}

function EventCard({ event }: { event: SanityEvent }) {
  const imageUrl = event.mainImage ? urlFor(event.mainImage) : null;
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/5 bg-[#1c1c1c]/80 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
      {imageUrl ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]">
          <svg className="h-16 w-16 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <div className="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 font-poppins text-[10px] font-bold uppercase tracking-widest text-eyf-gold">
          {event.category && <span>{event.category}</span>}
          {event.eventType && (
            <>
              <span className="text-white/20">|</span>
              <span className="text-white/50">{event.eventType}</span>
            </>
          )}
        </div>

        <h3 className="mb-2 font-montserrat text-lg font-bold leading-snug text-white transition-colors group-hover:text-eyf-gold">
          {event.title}
        </h3>

        <p className="mb-2 flex items-center gap-1.5 font-opensans text-xs text-white/50">
          <span>📅</span>
          <span>{formatEventDate(event.startDate, event.endDate)}</span>
        </p>

        <p className="mb-4 flex items-center gap-1.5 font-opensans text-xs text-white/50">
          <span>📍</span>
          <span>{event.location}</span>
        </p>

        {event.description && (
          <p className="mb-5 line-clamp-3 font-opensans text-[13px] leading-relaxed text-white/65">
            {event.description}
          </p>
        )}

        {event.registrationUrl && event.status === 'upcoming' && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-eyf-gold px-4 py-2 font-poppins text-xs font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-80"
          >
            Register
          </a>
        )}
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <InternalPageShell>
      <HeroSection title="Events" variant="internal" className="bg-transparent" />

      <ContentSection centered={false} className="bg-transparent">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-poppins text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">
              Choose Events
            </h2>
            <div className="mx-auto h-1 w-20 bg-eyf-gold" />
          </div>

          {/* Filter form — visual placeholders, filtering not yet wired */}
          <form className="mb-16 grid gap-6 rounded-3xl border border-white/5 bg-[#1c1c1c]/40 p-8 shadow-2xl backdrop-blur-md sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <input
                type="text"
                placeholder="Keywords"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-eyf-gold focus:bg-white/10"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Location"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-eyf-gold focus:bg-white/10"
              />
            </div>
            <div>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-left text-sm text-gray-400 transition-all hover:bg-white/10"
              >
                <span>Any dates</span>
                <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="lg:col-span-2">
              <select className="w-full appearance-none rounded-xl border border-white/10 bg-black px-6 py-4 pr-10 text-sm text-white outline-none transition-all focus:border-eyf-gold">
                <option value="">Choose an Event Category</option>
                {EVENT_CATEGORIES.map((o) => (
                  <option key={o.label} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <select className="w-full appearance-none rounded-xl border border-white/10 bg-black px-6 py-4 pr-10 text-sm text-white outline-none transition-all focus:border-eyf-gold">
                <option value="">Choose an Event Type</option>
                {EVENT_TYPES.map((o) => (
                  <option key={o.label} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </form>

          {/* Upcoming events */}
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/5 bg-[#1c1c1c]/40 px-10 py-20 text-center shadow-2xl backdrop-blur-md">
              <div className="mb-6 flex justify-center">
                <svg className="h-20 w-20 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-4 font-poppins text-xl font-bold uppercase tracking-[0.2em] text-white">
                There are currently no events.
              </h3>
              <p className="mx-auto max-w-md font-opensans leading-relaxed text-gray-500">
                Check back soon for upcoming workshops, community projects, and gatherings.
              </p>
            </div>
          )}
        </div>
      </ContentSection>

      <BlackTitleBar id="past">Past Events</BlackTitleBar>

      <ContentSection centered={pastEvents.length === 0} className="bg-transparent pb-20">
        {pastEvents.length > 0 ? (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <p className="mx-auto max-w-2xl font-opensans text-gray-400">
            Past event recaps will appear here when available. For the latest updates, visit{' '}
            <Link href="/news-and-social-media" className="text-eyf-gold underline-offset-2 hover:underline">
              News and Social Media
            </Link>{' '}
            or subscribe to our newsletter.
          </p>
        )}
      </ContentSection>
    </InternalPageShell>
  );
}
