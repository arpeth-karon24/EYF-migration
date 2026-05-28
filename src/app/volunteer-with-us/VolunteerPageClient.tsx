'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection, ContentSection, GuidelinesList } from '@/components/sections';
import VolunteerRegistrationModal from '@/components/sections/VolunteerRegistrationModal';
import {
  VOLUNTEER_GUIDELINES,
  VOLUNTEER_HERO_STRIP,
  VOLUNTEER_INTRO,
  VOLUNTEER_SPOTLIGHTS,
} from '@/constants/volunteerContent';
import type { SanityEvent } from '@/sanity/types';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  /**
   * Upcoming events fetched server-side from Sanity at build time.
   * Forwarded to the registration form so the "Event title" dropdown
   * reflects current upcoming events instead of hard-coded options.
   */
  upcomingEvents: SanityEvent[];
}

/**
 * Reads the ?event=<id> query param so the event detail page can deep-link
 * straight into the volunteer form with the right event preselected.
 * Wrapped in a Suspense boundary because useSearchParams() requires it
 * under Next.js static export.
 */
function EventDeepLinkReader({
  upcomingEvents,
  onMatchFound,
}: {
  upcomingEvents: SanityEvent[];
  onMatchFound: (eventId: string) => void;
}) {
  const searchParams = useSearchParams();
  const eventIdFromUrl = searchParams.get('event');

  // Guard so the deep-link only auto-opens the modal ONCE per page load.
  // Without this, the effect re-runs on every parent re-render (e.g. after
  // the user closes the modal) and — because ?event= is still in the URL —
  // immediately re-opens it, making the modal impossible to close.
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    if (hasAutoOpened.current) return;
    if (!eventIdFromUrl) return;
    // Only auto-open if the event ID actually matches a known upcoming event.
    // Stale or invalid IDs are silently ignored so the page still renders normally.
    const match = upcomingEvents.find((evt) => evt._id === eventIdFromUrl);
    if (match) {
      hasAutoOpened.current = true;
      onMatchFound(match._id);
    }
  }, [eventIdFromUrl, upcomingEvents, onMatchFound]);

  return null;
}

export default function VolunteerPageClient({ upcomingEvents }: Props) {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [prefillEventId, setPrefillEventId] = useState<string | undefined>(undefined);
  const spotlightsRef = useRef<HTMLElement>(null);

  // Spotlight animations — distinct from the home Key Activities feel.
  // Whole row fades + slides up from below (vertical motion, not lateral),
  // the 01/02/03 number pops in with a back-ease overshoot, the gold accent
  // line "draws" from left to right. Subtle, professional, on-scroll-once.
  useEffect(() => {
    if (!spotlightsRef.current) return;
    const ctx = gsap.context(() => {
      // Section header — fade + rise
      gsap.from('.spot-header', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.spot-header', start: 'top 88%', once: true },
      });

      gsap.utils.toArray<HTMLElement>('.spot-row').forEach((row) => {
        const trigger = { trigger: row, start: 'top 80%', once: true } as const;

        // Row fades + slides up from below
        gsap.from(row, {
          y: 60,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: trigger,
        });

        // Number badge — scales in with a soft overshoot
        const num = row.querySelector('.spot-num');
        if (num) {
          gsap.from(num, {
            scale: 0,
            opacity: 0,
            duration: 0.7,
            delay: 0.35,
            ease: 'back.out(1.8)',
            scrollTrigger: trigger,
          });
        }

        // Accent line — draws from left
        const line = row.querySelector('.spot-line');
        if (line) {
          gsap.from(line, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.8,
            delay: 0.55,
            ease: 'power2.out',
            scrollTrigger: trigger,
          });
        }
      });
    }, spotlightsRef);
    return () => ctx.revert();
  }, []);

  // Stable identity so EventDeepLinkReader's effect deps don't churn.
  const handleEventDeepLink = useCallback((eventId: string) => {
    setPrefillEventId(eventId);
    setRegistrationOpen(true);
  }, []);

  // Close the modal, clear the prefill, AND strip ?event= from the URL so
  // neither a re-render nor a page refresh can re-open the modal.
  const handleClose = useCallback(() => {
    setRegistrationOpen(false);
    setPrefillEventId(undefined);
    if (typeof window !== 'undefined' && window.location.search.includes('event=')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <InternalPageShell>
      <HeroSection
        title="Volunteer with us"
        subtitle="Support our community"
        variant="internal"
        ctaText="Register here"
        onCtaClick={() => setRegistrationOpen(true)}
        className="bg-transparent"
      />

      <Suspense fallback={null}>
        <EventDeepLinkReader
          upcomingEvents={upcomingEvents}
          onMatchFound={handleEventDeepLink}
        />
      </Suspense>

      <VolunteerRegistrationModal
        open={registrationOpen}
        onClose={handleClose}
        upcomingEvents={upcomingEvents}
        initialEventId={prefillEventId}
      />

      <ContentSection centered className="bg-transparent">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center font-poppins text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">
            {VOLUNTEER_INTRO.title}
          </h2>
          <div className="mx-auto mb-10 h-1 w-20 bg-eyf-gold" />
          <p className="mx-auto max-w-3xl text-center font-opensans text-lg leading-relaxed text-gray-300">
            {VOLUNTEER_INTRO.text}
          </p>
        </div>
      </ContentSection>

      <section className="pb-12 md:pb-16">
        <div className="mx-auto max-w-container px-4">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <div className="relative aspect-[21/9] min-h-[220px] w-full md:aspect-[24/9] md:min-h-[280px]">
              <Image
                src={VOLUNTEER_HERO_STRIP.src}
                alt={VOLUNTEER_HERO_STRIP.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1200px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <p className="mb-2 font-poppins text-xs font-bold uppercase tracking-[0.2em] text-eyf-gold">
                  Engage Youth Foundation
                </p>
                <h3 className="mb-2 font-montserrat text-2xl font-bold text-white md:text-3xl">
                  {VOLUNTEER_HERO_STRIP.headline}
                </h3>
                <p className="max-w-xl font-opensans text-sm leading-relaxed text-white/85 md:text-base">
                  {VOLUNTEER_HERO_STRIP.subline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={spotlightsRef} className="border-t border-white/5 bg-black/20 py-16 md:py-24">
        <div className="mx-auto max-w-container px-4">
          {/* Section header */}
          <div className="spot-header mx-auto mb-16 max-w-3xl text-center md:mb-24">
            <p className="mb-3 font-poppins text-xs font-bold uppercase tracking-[0.25em] text-eyf-gold">
              Our work, your impact
            </p>
            <h2 className="mb-4 font-poppins text-3xl font-bold text-white md:text-4xl">
              Where you&apos;ll make a difference
            </h2>
            <p className="mx-auto max-w-2xl font-opensans text-base leading-relaxed text-gray-300/85">
              Explore a few of the ways volunteers show up for youth and families — and how your
              strengths can fit into the work we do together.
            </p>
          </div>

          {/* Alternating feature rows — image left/right with copy on the other side.
              Each row reveals on scroll: fade + slide up, number scales in, accent line
              draws from left. Image gets a diagonal gold "shine" sweep on hover. */}
          <div className="mx-auto max-w-6xl space-y-16 md:space-y-24">
            {VOLUNTEER_SPOTLIGHTS.map((item, idx) => {
              const reverse = idx % 2 === 1;
              return (
                <article
                  key={item.title}
                  className="spot-row grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14"
                >
                  {/* Image — flips to the right on alternating rows for desktop */}
                  <div className={`relative lg:col-span-7 ${reverse ? 'lg:order-2' : ''}`}>
                    <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        sizes="(max-width: 1024px) 100vw, 700px"
                      />
                      {/* Subtle base gradient — depth */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
                      {/* Diagonal gold "shine" — sweeps across on hover. Sits off-screen
                          to the left by default and slides past the image on :hover. */}
                      <div className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-eyf-gold/25 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-full" />
                    </div>
                  </div>

                  {/* Copy column */}
                  <div className={`lg:col-span-5 ${reverse ? 'lg:order-1' : ''}`}>
                    <div className="mb-5 inline-flex items-center gap-3">
                      <span className="spot-num inline-block font-poppins text-xs font-bold uppercase tracking-[0.25em] text-eyf-gold">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="spot-line block h-px w-10 bg-eyf-gold/60" />
                    </div>
                    <h3 className="mb-4 font-montserrat text-2xl font-bold leading-tight text-white md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="font-opensans text-[15.5px] leading-[1.7] text-gray-300 md:text-base">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <GuidelinesList
        title="Volunteer Guidelines"
        subtitle="As a volunteer with Engage Youth Foundation, we expect you to:"
        items={VOLUNTEER_GUIDELINES}
        numbered
        layout="stacked"
        backgroundColor="transparent"
        className="pb-20"
      />
    </InternalPageShell>
  );
}
