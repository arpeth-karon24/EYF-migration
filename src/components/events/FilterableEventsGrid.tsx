"use client";

import { useState, useMemo } from "react";
import { EVENT_CATEGORIES, EVENT_TYPES } from "@/constants/eventFilters";
import type { SanityEvent } from "@/sanity/types";
import { EventCard, formatEventDate } from "./EventCard";

interface Props {
  /** Events to display (already filtered by status upstream — upcoming/past). */
  events: SanityEvent[];
  /** Optional: title to render above filters (e.g. "Choose Events"). Hidden if not set. */
  title?: string;
  /** Optional: empty state when zero events exist at all (before filtering). */
  emptyStateTitle?: string;
  /** Optional: empty state body text. */
  emptyStateBody?: React.ReactNode;
  /** Optional: show the gold underline below the title. Defaults to true. */
  showAccent?: boolean;
}

/**
 * Filterable events grid.
 *
 * Same five-field filter UX as the home page Choose Events section, applied
 * to a full grid layout. Used on /events (upcoming + past sections),
 * /activities, and /past-events.
 *
 * Filters work live as the user types/selects — no submit button. Use the
 * "Clear filters" button to reset.
 */
export function FilterableEventsGrid({
  events,
  title,
  emptyStateTitle = "No events to display.",
  emptyStateBody,
  showAccent = true,
}: Props) {
  // ─── Filter state ──────────────────────────────────────────────────────
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [category, setCategory] = useState("");
  const [eventType, setEventType] = useState("");

  // ─── Apply all filters reactively ──────────────────────────────────────
  const filtered = useMemo(() => {
    const kw = keywords.trim().toLowerCase();
    const loc = location.trim().toLowerCase();
    const dr = dateRange.trim().toLowerCase();

    return events.filter((event) => {
      // Keywords — match title or description
      if (kw) {
        const haystack = `${event.title} ${event.description ?? ""}`.toLowerCase();
        if (!haystack.includes(kw)) return false;
      }
      // Location — substring match
      if (loc) {
        if (!event.location.toLowerCase().includes(loc)) return false;
      }
      // Category — exact match against slug OR original label
      if (category) {
        const slug = event.category?.toLowerCase().replace(/\s+/g, "-") ?? "";
        if (slug !== category && event.category?.toLowerCase() !== category) return false;
      }
      // Event type — exact match
      if (eventType) {
        const slug = event.eventType?.toLowerCase() ?? "";
        if (slug !== eventType) return false;
      }
      // Date — textual substring on formatted date
      if (dr) {
        const formatted = formatEventDate(event.startDate, event.endDate).toLowerCase();
        if (!formatted.includes(dr)) return false;
      }
      return true;
    });
  }, [events, keywords, location, dateRange, category, eventType]);

  const hasActiveFilters =
    !!(keywords || location || dateRange || category || eventType);

  const resetFilters = () => {
    setKeywords("");
    setLocation("");
    setDateRange("");
    setCategory("");
    setEventType("");
  };

  // ─── If there are no events at all (before filtering), show empty state ─
  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#1c1c1c]/40 px-10 py-20 text-center shadow-2xl backdrop-blur-md">
        <div className="mb-6 flex justify-center">
          <svg className="h-20 w-20 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mb-4 font-poppins text-xl font-bold uppercase tracking-[0.2em] text-white">
          {emptyStateTitle}
        </h3>
        {emptyStateBody && (
          <div className="mx-auto max-w-md font-opensans leading-relaxed text-gray-500">
            {emptyStateBody}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Title — optional */}
      {title && (
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-poppins text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">
            {title}
          </h2>
          {showAccent && <div className="mx-auto h-1 w-20 bg-eyf-gold" />}
        </div>
      )}

      {/* Filter form — fully wired up, filters live as you type/select */}
      <form
        className="mb-6 grid gap-6 rounded-3xl border border-white/5 bg-[#1c1c1c]/40 p-8 shadow-2xl backdrop-blur-md sm:grid-cols-2 lg:grid-cols-3"
        onSubmit={(e) => e.preventDefault()}
        role="search"
      >
        <div>
          <input
            type="text"
            placeholder="Keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-eyf-gold focus:bg-white/10"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-eyf-gold focus:bg-white/10"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Date (e.g. 2026 or May)"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-eyf-gold focus:bg-white/10"
          />
        </div>
        <div className="lg:col-span-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter events by category"
            className="w-full appearance-none rounded-xl border border-white/10 bg-black px-6 py-4 pr-10 text-sm text-white outline-none transition-all focus:border-eyf-gold"
          >
            <option value="">Choose an Event Category</option>
            {EVENT_CATEGORIES.filter((o) => o.value).map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            aria-label="Filter events by type"
            className="w-full appearance-none rounded-xl border border-white/10 bg-black px-6 py-4 pr-10 text-sm text-white outline-none transition-all focus:border-eyf-gold"
          >
            <option value="">Choose an Event Type</option>
            {EVENT_TYPES.filter((o) => o.value).map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </form>

      {/* Filter status row — only when a filter is active */}
      {hasActiveFilters && (
        <div className="mb-8 flex items-center justify-between gap-4 text-[13px] text-white/70">
          <span>
            Showing <strong className="text-eyf-gold">{filtered.length}</strong> of{" "}
            <strong className="text-white">{events.length}</strong> events
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

      {/* Filtered grid OR "no matches" state */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/5 bg-[#1c1c1c]/40 px-10 py-16 text-center shadow-xl backdrop-blur-md">
          <h3 className="mb-3 font-poppins text-lg font-bold uppercase tracking-[0.15em] text-white">
            No events match your filters
          </h3>
          <p className="mx-auto max-w-md font-opensans text-sm leading-relaxed text-gray-400">
            Try adjusting your criteria or{" "}
            <button
              type="button"
              onClick={resetFilters}
              className="text-eyf-gold underline-offset-2 hover:underline"
            >
              clear all filters
            </button>
            .
          </p>
        </div>
      )}
    </>
  );
}

// Re-export helpers from EventCard for convenience
export { EventCard, formatEventDate };
