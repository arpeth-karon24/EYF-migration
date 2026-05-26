import Image from "next/image";
import Link from "next/link";
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
 *
 * Cancelled events render with a "CANCELLED" badge, dimmed opacity,
 * strikethrough title, and a cancellation notice in place of the CTA.
 * The Register button is suppressed regardless of registrationUrl.
 */
export function EventCard({ event }: Props) {
  const imageUrl = event.mainImage ? urlFor(event.mainImage) : null;
  const isCancelled = event.status === "cancelled";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-[#1c1c1c]/80 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl ${
        isCancelled ? "opacity-75" : ""
      }`}
      aria-label={isCancelled ? `${event.title} — cancelled` : event.title}
    >
      {imageUrl ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              isCancelled ? "grayscale" : ""
            }`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {isCancelled && (
            <span className="absolute right-3 top-3 z-10 rounded-md bg-red-600/95 px-3 py-1 font-poppins text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
              Cancelled
            </span>
          )}
        </div>
      ) : (
        <div className="relative flex h-48 w-full items-center justify-center bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]">
          <svg className="h-16 w-16 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isCancelled && (
            <span className="absolute right-3 top-3 z-10 rounded-md bg-red-600/95 px-3 py-1 font-poppins text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
              Cancelled
            </span>
          )}
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

        <h3
          className={`mb-2 font-montserrat text-lg font-bold leading-snug text-white transition-colors group-hover:text-eyf-gold ${
            isCancelled ? "line-through decoration-white/40" : ""
          }`}
        >
          {event.title}
        </h3>

        <p className="mb-2 flex items-center gap-1.5 font-opensans text-xs text-white/50">
          <span>📅</span>
          <span className={isCancelled ? "line-through decoration-white/30" : ""}>
            {formatEventDate(event.startDate, event.endDate)}
          </span>
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

        {isCancelled ? (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-3 font-opensans text-xs leading-relaxed text-red-200/90">
            <strong className="font-poppins font-bold uppercase tracking-widest text-red-300">
              This event has been cancelled.
            </strong>
            <span className="ml-1">Check back for rescheduling information.</span>
          </div>
        ) : (
          event.registrationUrl && event.status === "upcoming" && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-block rounded-lg bg-eyf-gold px-4 py-2 font-poppins text-xs font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-80"
            >
              Register
            </a>
          )
        )}

        {/* Read more link — always shown, opens the full event detail page */}
        {event.slug && (
          <div className={isCancelled || (event.registrationUrl && event.status === "upcoming") ? "pt-1" : ""}>
            <Link
              href={`/events/${event.slug}/`}
              className="inline-flex items-center gap-1 border-b border-white/20 pb-0.5 font-poppins text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:border-eyf-gold hover:text-eyf-gold"
              aria-label={`Read more about ${event.title}`}
            >
              Read more
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
