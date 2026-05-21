'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import type { FAQItem } from '@/constants/faqContent';

/**
 * Client-side accordion that takes plain-text FAQ entries and renders
 * the open/close behavior. Plain-text data comes from a constants file
 * so server components (page metadata, Schema.org FAQPage) can read it.
 *
 * For richer answer content (links, lists), the renderer below detects
 * patterns like email addresses and auto-links them.
 */

interface Props {
  faqs: FAQItem[];
  /** Index of the FAQ that's open by default. -1 to start all collapsed. */
  defaultOpenIndex?: number;
}

/** Auto-link bare email addresses and the literal phrase "Contact us page". */
function renderAnswer(answer: string): React.ReactNode {
  // Linkify emails
  const emailRegex = /([A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  const parts = answer.split(emailRegex);
  return (
    <>
      {parts.map((part, i) =>
        emailRegex.test(part) ? (
          <a
            key={i}
            href={`mailto:${part}`}
            className="text-eyf-gold underline-offset-2 hover:underline"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function FAQAccordion({ faqs, defaultOpenIndex = 0 }: Props) {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpenIndex);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <div
          key={faq.question}
          className="overflow-hidden rounded-2xl border border-white/10 shadow-xl backdrop-blur-md transition-all duration-300"
        >
          <button
            type="button"
            onClick={() => toggleFAQ(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
            className="group flex w-full items-center justify-between bg-[#1c1c1c]/60 px-8 py-6 text-left transition-all hover:bg-[#2c2c2c]/80"
          >
            <span
              className={cn(
                'font-montserrat text-base font-bold transition-colors md:text-lg',
                openIndex === index ? 'text-eyf-gold' : 'text-gray-200 group-hover:text-white',
              )}
            >
              {faq.question}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'ml-4 flex-shrink-0 transition-transform duration-500',
                openIndex === index ? 'rotate-180 text-eyf-gold' : 'text-gray-500',
              )}
            >
              <svg width="16" height="10" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 1L7 7L13 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            className={cn(
              'overflow-hidden transition-all duration-500 ease-in-out',
              openIndex === index ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="bg-[#1c1c1c]/40 p-8 pt-0">
              <p className="font-opensans text-base leading-relaxed text-gray-400">
                {renderAnswer(faq.answer)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
