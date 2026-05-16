'use client';

import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { BlackTitleBar } from '@/components/layout/BlackTitleBar';
import { HeroSection, ContentSection } from '@/components/sections';
import { EVENT_CATEGORIES, EVENT_TYPES } from '@/constants/eventFilters';
import Link from 'next/link';

export default function EventsPage() {
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
              <select className="wpem-like-select w-full appearance-none rounded-xl border border-white/10 bg-black bg-[length:10px] bg-[right_1.5rem_center] bg-no-repeat px-6 py-4 pr-10 text-sm text-white outline-none transition-all focus:border-eyf-gold">
                <option value="">Choose an Event Category</option>
                {EVENT_CATEGORIES.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select className="wpem-like-select w-full appearance-none rounded-xl border border-white/10 bg-black bg-[length:10px] bg-[right_1.5rem_center] bg-no-repeat px-6 py-4 pr-10 text-sm text-white outline-none transition-all focus:border-eyf-gold">
                <option value="">Choose an Event Type</option>
                {EVENT_TYPES.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <div className="rounded-3xl border border-white/5 bg-[#1c1c1c]/40 px-10 py-20 text-center shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex justify-center text-gray-600">
              <svg className="h-20 w-20 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-4 font-poppins text-xl font-bold uppercase tracking-[0.2em] text-white">
              There are currently no events.
            </h3>
            <p className="mx-auto max-w-md font-opensans leading-relaxed text-gray-500">
              Check back soon for upcoming workshops, community projects, and gatherings.
            </p>
          </div>
        </div>
      </ContentSection>

      <BlackTitleBar id="past">Past Events</BlackTitleBar>

      <ContentSection centered className="bg-transparent pb-20">
        <p className="mx-auto max-w-2xl font-opensans text-gray-400">
          Past event recaps will appear here when available. For the latest updates, visit{' '}
          <Link href="/news-and-social-media" className="text-eyf-gold underline-offset-2 hover:underline">
            News and Social Media
          </Link>{' '}
          or subscribe to our newsletter.
        </p>
      </ContentSection>
    </InternalPageShell>
  );
}
