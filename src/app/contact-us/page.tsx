'use client';

import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection, ContactForm } from '@/components/sections';

export default function ContactPage() {
  return (
    <InternalPageShell>
      <HeroSection title="Contact us" variant="internal" className="bg-transparent" />

      <section className="bg-transparent py-12 md:py-20">
        <div className="mx-auto max-w-container px-4">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/5 bg-[#1c1c1c]/60 p-8 shadow-2xl backdrop-blur-md md:p-12">
            <div className="mb-10 text-center">
              <h2 className="mb-4 font-poppins text-3xl font-bold uppercase tracking-widest text-white">
                Get in Touch
              </h2>
              <div className="mx-auto mb-6 h-1 w-16 bg-eyf-gold" />
              <p className="font-opensans text-gray-400">
                Send us a message and we will get back to you as soon as we can.
              </p>
            </div>
            <ContactForm submitButtonText="Send Message" />
          </div>
        </div>
      </section>
    </InternalPageShell>
  );
}
