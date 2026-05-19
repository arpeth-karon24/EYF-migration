import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InternalPageShell } from "@/components/layout/InternalPageShell";
import { HeroSection } from "@/components/sections";
import { getUpcomingEvents, getPastEvents } from "@/sanity/queries";
import { urlFor } from "@/sanity/client";
import type { SanityEvent } from "@/sanity/types";

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

function formatEventDate(start: string, end?: string): string {
  const s = new Date(start).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  if (!end) return s;
  const e = new Date(end).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
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
          <svg className="h-14 w-14 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="p-6">
        {event.category && (
          <p className="mb-2 font-poppins text-[10px] font-bold uppercase tracking-widest text-eyf-gold">
            {event.category}
          </p>
        )}
        <h3 className="mb-2 font-montserrat text-lg font-bold leading-snug text-white transition-colors group-hover:text-eyf-gold">
          {event.title}
        </h3>
        <p className="mb-1 flex items-center gap-1.5 font-opensans text-xs text-white/50">
          <span>📅</span> {formatEventDate(event.startDate, event.endDate)}
        </p>
        <p className="mb-4 flex items-center gap-1.5 font-opensans text-xs text-white/50">
          <span>📍</span> {event.location}
        </p>
        {event.description && (
          <p className="mb-4 line-clamp-2 font-opensans text-[13px] leading-relaxed text-white/65">
            {event.description}
          </p>
        )}
        {event.registrationUrl && event.status === "upcoming" && (
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

export default async function StaticSitePage({ params }: Props) {
  const { slug } = await params;
  const meta = SLUG_META[slug];

  const events = slug === "activities"
    ? await getUpcomingEvents()
    : await getPastEvents();

  return (
    <InternalPageShell>
      <HeroSection title={meta?.heading ?? slug} variant="internal" className="bg-transparent" />

      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-container px-4">
          {events.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/5 bg-[#1c1c1c]/40 px-10 py-20 text-center shadow-2xl backdrop-blur-md">
              <h3 className="mb-4 font-poppins text-xl font-bold uppercase tracking-[0.2em] text-white">
                {slug === "activities" ? "No upcoming events at this time." : "No past events yet."}
              </h3>
              <p className="mx-auto max-w-md font-opensans leading-relaxed text-gray-500">
                Check back soon or{" "}
                <Link href="/events" className="text-eyf-gold underline-offset-2 hover:underline">
                  visit the Events page
                </Link>{" "}
                for more details.
              </p>
            </div>
          )}
        </div>
      </section>
    </InternalPageShell>
  );
}
