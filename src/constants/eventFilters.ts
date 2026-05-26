/**
 * Event filter dropdowns.
 *
 * IMPORTANT: These values must match the taxonomy defined in the Sanity
 * event schema (src/sanity/schemas/event.ts). The filter logic in
 * FilterableEventsGrid / HomeEventsSection normalises both sides to
 * lowercase before comparing, so each `value` here is the lowercase form
 * of the corresponding Sanity value.
 *
 * If you add/rename a category or type in Sanity, update this file too —
 * otherwise the dropdown will list options that no event can ever match.
 */

export const EVENT_CATEGORIES = [
  { value: "", label: "Choose an Event Category" },
  { value: "community", label: "Community" },
  { value: "workshop", label: "Workshop" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "social", label: "Social" },
  { value: "volunteer", label: "Volunteer" },
] as const;

export const EVENT_TYPES = [
  { value: "", label: "Choose an Event Type" },
  { value: "in-person", label: "In-Person" },
  { value: "virtual", label: "Virtual" },
  { value: "hybrid", label: "Hybrid" },
] as const;
