'use client';

import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection, ContentSection } from '@/components/sections';

export default function TermsOfServicePage() {
  return (
    <InternalPageShell>
      <HeroSection title="Terms" variant="internal" className="bg-transparent" />

      <ContentSection centered={false} className="bg-transparent pb-20">
        <div className="mx-auto max-w-4xl space-y-12">
          <section>
            <h2 className="mb-6 border-b border-white/10 pb-4 font-poppins text-2xl font-bold text-white">
              Acceptance of Terms
            </h2>
            <p className="text-gray-400">
              By accessing and using the Engage Youth Foundation (EYF) website, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you do not agree with any of these
              terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="mb-6 border-b border-white/10 pb-4 font-poppins text-2xl font-bold text-white">
              Changes to Terms
            </h2>
            <p className="text-gray-400">
              EYF reserves the right to revise these Terms of Service at any time without notice. By using this
              website, you are agreeing to be bound by the then-current version of these Terms of Service.
            </p>
          </section>

          <section className="space-y-10">
            <div>
              <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">Use License</h3>
              <p className="mb-4 text-gray-400">
                Permission is granted to temporarily download one copy of the materials (information or software)
                on EYF&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="ml-4 list-inside list-disc space-y-3 text-gray-400">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>Attempt to decompile or reverse engineer any software contained on EYF&apos;s website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">Disclaimer</h3>
              <p className="text-gray-400">
                The materials on EYF&apos;s website are provided on an &apos;as is&apos; basis. EYF makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including, without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">Limitations</h3>
              <p className="text-gray-400">
                In no event shall EYF or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or
                inability to use the materials on EYF&apos;s website, even if EYF or an EYF authorized representative
                has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">Accuracy of Materials</h3>
              <p className="text-gray-400">
                The materials appearing on EYF&apos;s website could include technical, typographical, or photographic
                errors. EYF does not warrant that any of the materials on its website are accurate, complete or
                current. EYF may make changes to the materials contained on its website at any time without notice.
                However EYF does not make any commitment to update the materials.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">Links</h3>
              <p className="text-gray-400">
                EYF has not reviewed all of the sites linked to its website and is not responsible for the contents of
                any such linked site. The inclusion of any link does not imply endorsement by EYF of the site. Use
                of any such linked website is at the user&apos;s own risk.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">Governing Law</h3>
              <p className="text-gray-400">
                These terms and conditions are governed by and construed in accordance with the laws of Mumbai,
                Maharashtra, India and you irrevocably submit to the exclusive jurisdiction of the courts in that
                State or location.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-montserrat text-xl font-bold text-eyf-gold">User Conduct</h3>
              <p className="text-gray-400">When using our website and services, you agree not to:</p>
              <ul className="ml-4 mt-4 list-inside list-disc space-y-3 text-gray-400">
                <li>Violate any applicable laws or regulations;</li>
                <li>Infringe on any intellectual property rights;</li>
                <li>Harass, abuse, or threaten other users;</li>
                <li>Transmit viruses or malicious code;</li>
                <li>Collect or track personal information of others without consent.</li>
              </ul>
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
