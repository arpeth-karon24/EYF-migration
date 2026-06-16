'use client';

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { EVENT_CATEGORIES, EVENT_TYPES } from "@/constants/eventFilters";
import type { SanityEvent } from "@/sanity/types";
import { urlFor } from "@/sanity/client";

function formatEventDate(start: string, end?: string): string {
  const s = new Date(start).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  if (!end) return s;
  const e = new Date(end).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  return s === e ? s : `${s} – ${e}`;
}

interface Props {
  allEvents: SanityEvent[];
}

export function HomeEventsSection({ allEvents }: Props) {
  // ─── Filter state — bound to each form field ────────────────────────────
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [category, setCategory] = useState("");
  const [eventType, setEventType] = useState("");

  // ─── Apply filters reactively whenever a field or allEvents changes ─
  const filteredEvents = useMemo(() => {
    const kw = keywords.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    const dr = dateRange.trim().toLowerCase();
    const now = new Date();

    return allEvents.filter((event) => {
      // Only show upcoming events (not past or cancelled)
      if (event.status === "cancelled") return false;
      const eventStart = new Date(event.startDate);
      if (eventStart < now) return false;
      // Keywords — match title or description (case-insensitive substring)
      if (kw) {
        const haystack = `${event.title} ${event.description ?? ""}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      // Location — substring match (case-insensitive)
      if (loc) {
        if (!event.location.toLowerCase().includes(loc)) return false;
      }
      // Category — exact value match (matches against the select option value)
      if (category) {
        const eventCategorySlug = event.category?.toLowerCase().replace(/\s+/g, "-") ?? "";
        if (eventCategorySlug !== category && event.category?.toLowerCase() !== category)
          return false;
      }
      // Event type — exact value match
      if (eventType) {
        const eventTypeSlug = event.eventType?.toLowerCase() ?? "";
        if (eventTypeSlug !== eventType) return false;
      }
      // Date range — basic textual substring match against formatted date
      // (e.g. typing "2026" or "March" will narrow to those events)
      if (dr) {
        const formatted = formatEventDate(event.startDate, event.endDate).toLowerCase();
        if (!formatted.includes(dr)) return false;
      }
      return true;
    });
  }, [allEvents, keywords, location, dateRange, category, eventType]);

  const hasActiveFilters =
    keywords || location || dateRange || category || eventType;

  const resetFilters = () => {
    setKeywords("");
    setLocation("");
    setDateRange("");
    setCategory("");
    setEventType("");
  };

  return (
    <section className="bg-eyf-page py-16 lg:py-24" aria-labelledby="choose-events-heading">
      <div className="mx-auto max-w-container px-4">
        <div className="text-center">
          <h2 id="choose-events-heading" className="mb-12 font-poppins text-3xl font-bold text-white lg:text-[40px]">
            Choose Events
          </h2>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* Filter form — fully wired up, filters live as you type/select */}
          <form
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <div className="flex flex-col gap-1">
              <input
                id="search_keywords"
                name="search_keywords"
                type="text"
                placeholder="Keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full rounded border border-white/20 bg-white px-4 py-3 text-[13px] text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-eyf-gold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <input
                id="search_location"
                name="search_location"
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded border border-white/20 bg-white px-4 py-3 text-[13px] text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-eyf-gold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <input
                id="search_datetimes"
                name="search_datetimes"
                type="text"
                placeholder="Date (e.g. 2026 or March)"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full rounded border border-white/20 bg-white px-4 py-3 text-[13px] text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-eyf-gold"
              />
            </div>
            <div className="flex flex-col gap-1 lg:col-span-2">
              <select
                id="search_categories"
                name="search_categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded border border-white/20 bg-white px-4 py-3 text-[13px] text-gray-700 outline-none transition-all focus:border-eyf-gold"
              >
                <option value="">Choose an Event Category</option>
                {EVENT_CATEGORIES.filter((o) => o.value).map((o) => (
                  <option key={o.label} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <select
                id="search_event_types"
                name="search_event_types"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full appearance-none rounded border border-white/20 bg-white px-4 py-3 text-[13px] text-gray-700 outline-none transition-all focus:border-eyf-gold"
              >
                <option value="">Choose an Event Type</option>
                {EVENT_TYPES.filter((o) => o.value).map((o) => (
                  <option key={o.label} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </form>

          {/* Filter status row — visible only when filters are active */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between gap-4 text-[12px] text-white/70">
              <span>
                Showing <strong className="text-eyf-gold">{filteredEvents.length}</strong> of{" "}
                <strong className="text-white">{allEvents.filter((e) => e.status !== "cancelled" && new Date(e.startDate) >= new Date()).length}</strong> events
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="font-poppins text-[11px] font-bold uppercase tracking-widest text-eyf-gold transition-opacity hover:opacity-80"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Events slider or empty state */}
          {filteredEvents.length > 0 ? (
            <div className="mt-12">
              <Swiper
                // Re-mount the Swiper when the filtered set changes — otherwise Swiper's
                // internal slide cache shows stale slides after filtering.
                key={filteredEvents.map((e) => e._id).join("|")}
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={filteredEvents.length > 2}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640:  { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full pb-4"
              >
                {filteredEvents.map((event) => {
                  const imageUrl = event.mainImage ? urlFor(event.mainImage) : null;
                  return (
                    <SwiperSlide key={event._id}>
                      <article className="group overflow-hidden rounded-xl border border-white/10 bg-[#1c1c1c]/80 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-2xl h-full">
                        {imageUrl ? (
                          <div className="relative h-40 w-full overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a]">
                            <svg className="h-12 w-12 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="p-4">
                          {event.category && (
                            <p className="mb-1 font-poppins text-[10px] font-bold uppercase tracking-widest text-eyf-gold">
                              {event.category}
                            </p>
                          )}
                          <h3 className="mb-2 font-montserrat text-sm font-bold leading-snug text-white transition-colors group-hover:text-eyf-gold">
                            {event.title}
                          </h3>
                          <p className="mb-1 flex items-center gap-1 font-opensans text-[11px] text-white/50">
                            <span>📅</span>
                            <span>{formatEventDate(event.startDate, event.endDate)}</span>
                          </p>
                          <p className="mb-3 flex items-center gap-1 font-opensans text-[11px] text-white/50">
                            <span>📍</span>
                            <span>{event.location}</span>
                          </p>
                          {event.registrationUrl ? (
                            <a
                              href={event.registrationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block rounded bg-eyf-gold px-3 py-1.5 font-poppins text-[10px] font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-80"
                            >
                              Register
                            </a>
                          ) : (
                            <Link
                              href="/events"
                              className="font-poppins text-[10px] font-bold uppercase tracking-widest text-white/60 transition-colors hover:text-white"
                            >
                              View Details →
                            </Link>
                          )}
                        </div>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              <div className="mt-8 text-center">
                <Link
                  href="/events"
                  className="inline-block rounded-full border border-eyf-gold px-8 py-3 font-poppins text-xs font-bold uppercase tracking-widest text-eyf-gold transition-all hover:bg-eyf-gold hover:text-black"
                >
                  View All Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-12 rounded-lg border border-[#f5c6cb] bg-[#f8d7da] px-6 py-4 text-center text-[13px] font-normal text-[#721c24]">
              {hasActiveFilters
                ? "No events match your filters. Try clearing them or adjusting the criteria."
                : "There are currently no events."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
