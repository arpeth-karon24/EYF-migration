'use client';

import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection, ContentSection } from '@/components/sections';

export default function PrivacyPolicyPage() {
  return (
    <InternalPageShell>
      <HeroSection title="Privacy Policy" variant="internal" className="bg-transparent" />

      <ContentSection centered={false} className="bg-transparent pb-20">
        <div className="mx-auto max-w-4xl space-y-12">
          <p className="text-lg font-semibold text-white">
            Engage Youth Foundation (EYF) is committed to protecting your privacy and ensuring the security of your
            personal information. This Privacy Policy explains how we collect, use, and protect your data when you
            visit our website or interact with our services.
          </p>

          <section>
            <h2 className="mb-8 border-b border-white/10 pb-4 font-poppins text-2xl font-bold text-white">
              What personal data do we collect and why?
            </h2>

            <div className="space-y-10">
              <div>
                <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">Forms</h3>
                <div className="space-y-4 text-gray-400">
                  <p>
                    When you submit a form on our website, such as for volunteer registration or contacting us, we
                    collect the data shown in the form, including your name, email address, and any message or file you
                    provide.
                  </p>
                  <p>
                    We use this information to respond to your inquiries, process your registrations, and provide you
                    with relevant updates about our initiatives. Your email address may be shared with our staff for
                    the purpose of communicating with you.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">
                  Embedded content from other websites
                </h3>
                <div className="space-y-4 text-gray-400">
                  <p>
                    Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded
                    content from other websites behaves in the exact same way as if the visitor has visited the other
                    website.
                  </p>
                  <p>
                    These websites may collect data about you, use cookies, embed additional third-party tracking, and
                    monitor your interaction with that embedded content, including tracking your interaction with the
                    embedded content if you have an account and are logged in to that website.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">Analytics</h3>
                <p className="text-gray-400">
                  We use Google Analytics to analyze website traffic and user behavior. Google Analytics collects
                  information about your device, browser, and browsing activity. This helps us improve our website and
                  services to better serve our community.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-8 border-b border-white/10 pb-4 font-poppins text-2xl font-bold text-white">
              How do we protect your data?
            </h2>

            <div className="space-y-10">
              <div>
                <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">
                  How do we use and retain your data?
                </h3>
                <p className="text-gray-400">
                  We use your personal data to fulfill the purpose for which it was collected, such as processing your
                  donation or volunteer registration. We retain your data for as long as necessary to fulfill these
                  purposes and comply with legal obligations.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">
                  How do you opt-out or change your contact information?
                </h3>
                <p className="text-gray-400">
                  If you wish to opt-out of our communications or change your contact information, please contact us at{' '}
                  <span className="font-semibold text-eyf-gold underline">engageyouthfoundation@gmail.com</span>.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">
                  What rights do you have over your data?
                </h3>
                <p className="text-gray-400">
                  If you have provided personal data to us, you can request to receive an exported file of the personal
                  data we hold about you. You can also request that we erase any personal data we hold about you. This
                  does not include any data we are obliged to keep for administrative, legal, or security purposes.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">
                  A note on email communication
                </h3>
                <p className="text-gray-400">
                  Please be aware that email is not a completely secure method of communication. Avoid sending
                  sensitive information, such as passwords or credit card details, via email.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-12 rounded-lg border border-white/5 bg-[#252525] p-8 text-center">
            <p className="text-sm font-medium text-gray-500">Last Updated: May 14, 2024</p>
          </div>
        </div>
      </ContentSection>
    </InternalPageShell>
  );
}
