import Image from "next/image";
import type { SanityEvent } from "@/sanity/types";
import { urlFor } from "@/sanity/client";

/**
 * Format a date range from Sanity ISO strings.
 * Single date if no end, otherwise "Month D, YYYY – Month D, YYYY".
 */
export function formatEventDate(start: string, end?: string): string {
  const s = new Date(start).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  if (!end) return s;
  const e = new Date(end).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  return s === e ? s : `${s} – ${e}`;
}

interface Props {
  event: SanityEvent;
}

/**
 * Shared event card used on /events, /activities, /past-events.
 * Renders Sanity image (with placeholder fallback), category/type tags,
 * title, date, location, description, and a Register CTA for upcoming
 * events that have a registration URL.
 */
export function EventCard({ event }: Props) {
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
        {(event.category || event.eventType) && (
          <div className="mb-3 flex flex-wrap items-center gap-2 font-poppins text-[10px] font-bold uppercase tracking-widest text-eyf-gold">
            {event.category && <span>{event.category}</span>}
            {event.eventType && (
              <>
                <span className="text-white/20">|</span>
                <span className="text-white/50">{event.eventType}</span>
              </>
            )}
          </div>
        )}

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
