import type { Metadata } from 'next';
import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection } from '@/components/sections';
import { FAQ_ITEMS } from '@/constants/faqContent';
import FAQAccordion from './FAQAccordion';
import { JsonLd } from '@/lib/schema/JsonLd';
import { buildFAQSchema, buildBreadcrumbSchema } from '@/lib/schema/builders';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    "Answers to common questions about Engage Youth Foundation — who we are, how to get involved, age groups, programs, financial support, and how to stay updated.",
  alternates: { canonical: '/faq/' },
};

/**
 * Frequently Asked Questions page.
 *
 * Server component — injects FAQPage Schema.org data so Google can
 * render expandable Q&As directly in search results. The actual
 * accordion UI runs in a client child component.
 */
export default function FAQPage() {
  return (
    <InternalPageShell>
      <JsonLd id="schema-faq" data={buildFAQSchema(FAQ_ITEMS)} />
      <JsonLd
        id="schema-faq-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'FAQ' },
        ])}
      />

      <HeroSection
        title="Frequently Asked Questions"
        variant="internal"
        className="bg-transparent"
      />

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-container px-4">
          <div className="mx-auto max-w-4xl">
            <FAQAccordion faqs={FAQ_ITEMS} defaultOpenIndex={0} />
          </div>
        </div>
      </section>
    </InternalPageShell>
  );
}
