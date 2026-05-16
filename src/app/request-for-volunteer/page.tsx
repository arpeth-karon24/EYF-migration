'use client';

import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection, VolunteerSupportRequestForm } from '@/components/sections';

export default function RequestVolunteerPage() {
  return (
    <InternalPageShell>
      <HeroSection title="Request Volunteer Support" variant="internal" className="bg-transparent" />

      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-container px-4">
          <div className="mx-auto mb-14 max-w-3xl space-y-6 text-left font-opensans leading-relaxed text-gray-200 md:text-center">
            <p>
              In addition to our volunteer opportunities, we also welcome requests for volunteer support for
              specific activities and events organized by individuals or groups. If you have an event or activity that
              aligns with our mission of empowering and inspiring young people, we encourage you to submit a request for
              volunteer assistance.
            </p>
            <p>
              Please provide a description of your event or activity, including the date, time, location, and number of
              volunteers needed. We will carefully review your request and, if we have volunteers available, we will
              connect you with individuals who are interested and qualified to assist you.
            </p>
          </div>

          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="mb-4 font-poppins text-2xl font-bold text-white md:text-3xl">
              Does your organization need support?
            </h2>
            <p className="mx-auto max-w-2xl font-opensans leading-relaxed text-gray-300">
              Fill out the form below to request volunteer support from Engage Youth Foundation. We&apos;ll review your
              request and get back to you as soon as possible.
            </p>
          </div>

          <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-[#1e1e1e] p-8 shadow-xl md:p-10">
            <h3 className="mb-8 font-poppins text-xl font-semibold text-white md:text-2xl">
              Volunteer Request Form
            </h3>
            <VolunteerSupportRequestForm />
          </div>
        </div>
      </section>
    </InternalPageShell>
  );
}
