'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
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

  useEffect(() => {
    if (!eventIdFromUrl) return;
    // Only auto-open if the event ID actually matches a known upcoming event.
    // Stale or invalid IDs are silently ignored so the page still renders normally.
    const match = upcomingEvents.find((evt) => evt._id === eventIdFromUrl);
    if (match) onMatchFound(match._id);
  }, [eventIdFromUrl, upcomingEvents, onMatchFound]);

  return null;
}

export default function VolunteerPageClient({ upcomingEvents }: Props) {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [prefillEventId, setPrefillEventId] = useState<string | undefined>(undefined);

  const handleEventDeepLink = (eventId: string) => {
    setPrefillEventId(eventId);
    setRegistrationOpen(true);
  };

  // Clear the prefill when the modal closes so a fresh open doesn't reuse it.
  const handleClose = () => {
    setRegistrationOpen(false);
    setPrefillEventId(undefined);
  };

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

      <section className="border-t border-white/5 bg-black/20 py-14 md:py-20">
        <div className="mx-auto max-w-container px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            <h2 className="mb-4 font-poppins text-2xl font-bold text-white md:text-3xl">
              Where you&apos;ll make a difference
            </h2>
            <p className="font-opensans text-sm leading-relaxed text-gray-400 md:text-base">
              Explore a few of the ways volunteers show up for youth and families—and how your strengths can fit into
              the work we do together.
            </p>
          </div>

          <div className="mx-auto flex max-w-3xl flex-col gap-12 md:gap-14">
            {VOLUNTEER_SPOTLIGHTS.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1c]/80 shadow-xl"
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <div className="mb-4 h-1 w-12 bg-eyf-gold" />
                  <h3 className="mb-3 font-montserrat text-xl font-bold text-white md:text-2xl">{item.title}</h3>
                  <p className="font-opensans text-[15px] leading-relaxed text-gray-300 md:text-base">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
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
