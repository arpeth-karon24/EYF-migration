import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InternalPageShell } from "@/components/layout/InternalPageShell";
import { HeroSection } from "@/components/sections";
import { getEventBySlug, getAllEventSlugs } from "@/sanity/queries";
import { urlFor } from "@/sanity/client";
import { JsonLd } from "@/lib/schema/JsonLd";
import {
  buildEventSchema,
  buildBreadcrumbSchema,
} from "@/lib/schema/builders";

type Props = { params: Promise<{ slug: string }> };

function formatEventDate(start: string, end?: string): string {
  const s = new Date(start).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (!end) return s;
  const e = new Date(end).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return s === e ? s : `${s} – ${e}`;
}

function formatEventTime(start: string, end?: string): string {
  const s = new Date(start).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  });
  if (!end) return s;
  const e = new Date(end).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  });
  return `${s} – ${e}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static export support — Next.js needs every slug at build time so it can
// pre-render each event's HTML. Sanity is queried during the build via the
// GitHub Actions workflow (and re-built on Sanity publish via webhook).
// ─────────────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  // `output: export` requires a dynamic route to produce at least one path,
  // or the ENTIRE build fails. When the CMS has zero events (e.g. all were
  // deleted), emit a single reserved placeholder slug that the page below
  // resolves to notFound(). This keeps the build green so the homepage,
  // API functions, and everything else still deploy — instead of one empty
  // collection taking down the whole site.
  if (slugs.length === 0) {
    return [{ slug: "no-events" }];
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event" };

  const baseDesc = event.description?.slice(0, 160) ??
    `${event.title} — an event organized by Engage Youth Foundation.`;

  // Use the event's own image as the social-share preview when available,
  // so a shared event link shows that event's photo instead of the default.
  const ogImage = event.mainImage ? urlFor(event.mainImage) : null;

  return {
    title: event.title,
    description: baseDesc,
    alternates: { canonical: `/events/${event.slug}/` },
    openGraph: {
      title: event.title,
      description: baseDesc,
      type: "article",
      ...(ogImage ? { images: [{ url: ogImage, alt: event.title }] } : {}),
    },
    ...(ogImage ? { twitter: { card: "summary_large_image", images: [ogImage] } } : {}),
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const imageUrl = event.mainImage ? urlFor(event.mainImage) : null;
  const isCancelled = event.status === "cancelled";
  const isUpcoming = !isCancelled && new Date(event.startDate) > new Date();

  return (
    <InternalPageShell>
      {/* ── Schema.org — Event + Breadcrumb ─────────────────────────────── */}
      <JsonLd
        id="schema-event"
        data={buildEventSchema(event, imageUrl)}
      />
      <JsonLd
        id="schema-event-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events/" },
          { name: event.title },
        ])}
      />

      <HeroSection title={event.title} variant="internal" className="bg-transparent" />

      <article className="pb-16 pt-4 md:pb-24">
        <div className="mx-auto max-w-container px-4">
          {/* Back link */}
          <Link
            href="/events/"
            className="mb-8 inline-block font-opensans text-sm text-eyf-gold underline-offset-4 hover:underline"
          >
            ← Back to Events
          </Link>

          <div
            className={`mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1c]/80 shadow-xl backdrop-blur-md ${
              isCancelled ? "opacity-90" : ""
            }`}
          >
            {/* ── Image (with CANCELLED badge if applicable) ───────────── */}
            {imageUrl && (
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={imageUrl}
                  alt={event.title}
                  fill
                  priority
                  className={`object-cover ${isCancelled ? "grayscale" : ""}`}
                  sizes="(max-width: 768px) 100vw, 896px"
                />
                {isCancelled && (
                  <span className="absolute right-4 top-4 z-10 rounded-md bg-red-600/95 px-4 py-1.5 font-poppins text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                    Cancelled
                  </span>
                )}
              </div>
            )}

            <div className="p-8 md:p-10">
              {/* Category + Type chips */}
              {(event.category || event.eventType) && (
                <div className="mb-6 flex flex-wrap items-center gap-3 font-poppins text-[11px] font-bold uppercase tracking-widest text-eyf-gold">
                  {event.category && <span>{event.category}</span>}
                  {event.eventType && (
                    <>
                      <span className="text-white/20">|</span>
                      <span className="text-white/60">{event.eventType}</span>
                    </>
                  )}
                </div>
              )}

              {/* Cancellation notice — high up, before any other content */}
              {isCancelled && (
                <div className="mb-8 rounded-lg border border-red-500/40 bg-red-950/30 px-5 py-4 font-opensans text-sm leading-relaxed text-red-200/95">
                  <strong className="block mb-1 font-poppins font-bold uppercase tracking-widest text-red-300">
                    This event has been cancelled.
                  </strong>
                  We&apos;ll share rescheduling information here as soon as it&apos;s available.
                  In the meantime, you can{" "}
                  <Link href="/events/" className="text-eyf-gold underline-offset-2 hover:underline">
                    browse our other events
                  </Link>{" "}
                  or{" "}
                  <Link href="/contact-us/" className="text-eyf-gold underline-offset-2 hover:underline">
                    contact us
                  </Link>
                  {" "}for more details.
                </div>
              )}

              {/* When */}
              <div className="mb-3 flex items-start gap-3 font-opensans text-[15px] text-white/85">
                <span className="mt-0.5">📅</span>
                <div>
                  <div className={isCancelled ? "line-through decoration-white/40" : ""}>
                    {formatEventDate(event.startDate, event.endDate)}
                  </div>
                  <div className={`text-sm text-white/55 ${isCancelled ? "line-through decoration-white/30" : ""}`}>
                    {formatEventTime(event.startDate, event.endDate)}
                  </div>
                </div>
              </div>

              {/* Where */}
              <div className="mb-8 flex items-start gap-3 font-opensans text-[15px] text-white/85">
                <span className="mt-0.5">📍</span>
                <div>{event.location}</div>
              </div>

              {/* Description */}
              {event.description ? (
                <div className="space-y-5 font-opensans text-[15px] leading-relaxed text-white/85">
                  {event.description.split(/\n+/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p className="font-opensans text-[15px] leading-relaxed italic text-white/55">
                  Full event details coming soon. Reach out via the{" "}
                  <Link href="/contact-us/" className="text-eyf-gold underline-offset-2 hover:underline">
                    contact page
                  </Link>{" "}
                  for more information.
                </p>
              )}

              {/* CTA — internal volunteer registration prefilled with this event.
                  Only shown for upcoming, non-cancelled events. The eventId is
                  passed via the ?event= query param so VolunteerPageClient can
                  auto-open the modal and pre-select this event in the dropdown. */}
              {isUpcoming && (
                <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
                  <Link
                    href={`/volunteer-with-us/?event=${encodeURIComponent(event._id)}`}
                    className="inline-block rounded-lg bg-eyf-gold px-6 py-3 font-poppins text-sm font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-80"
                  >
                    Register as volunteer
                  </Link>
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block border-b border-white/30 pb-0.5 font-poppins text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:border-eyf-gold hover:text-eyf-gold"
                    >
                      External registration page →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </InternalPageShell>
  );
}
