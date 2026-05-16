'use client';

import { useState } from 'react';
import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection } from '@/components/sections';
import { cn } from '@/lib/cn';

const FAQS = [
  {
    question: 'What is Engage Youth Foundation (EYF)?',
    answer:
      'Engage Youth Foundation is a non-profit organization dedicated to inspiring, engaging, and empowering youth to become self-motivated contributors to their communities. We provide platforms, resources, and opportunities to nurture positive change.',
  },
  {
    question: 'How can I get involved with EYF?',
    answer: (
      <>
        <p className="mb-3">There are many ways to get involved with EYF:</p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="text-gray-200">Volunteer:</strong> We offer a variety of volunteer
            opportunities for youth with diverse interests and skills.
          </li>
          <li>
            <strong className="text-gray-200">Donate:</strong> Your contribution directly supports our
            programs and initiatives.
          </li>
          <li>
            <strong className="text-gray-200">Attend events:</strong> We host educational workshops,
            community projects, and social gatherings for young people.
          </li>
          <li>
            <strong className="text-gray-200">Spread the word:</strong> Share our mission and work with
            your friends and family.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: 'What age group does EYF focus on?',
    answer:
      'EYF is inclusive and welcomes individuals from 10+ years age groups. While our primary focus is youth, our initiatives often involve people of all ages who share our commitment to community engagement.',
  },
  {
    question: 'Does EYF offer any programs for skill development?',
    answer:
      'No, we do not offer any programs aimed at skill development. Explore our Key Activities on the homepage to know more about our programs.',
  },
  {
    question: 'How can I support EYF financially?',
    answer:
      'Your financial support is greatly appreciated. Visit our Donation page to find information on making donations, sponsorships, and supporting our initiatives.',
  },
  {
    question: 'Is EYF involved in environmental initiatives?',
    answer:
      'Yes, we are committed to environmental sustainability. Check our Projects and events to learn about our environmental projects and how you can contribute.',
  },
  {
    question: 'Can I suggest a community project for EYF to consider?',
    answer: (
      <>
        Absolutely! We value community input. If you have a project idea aligned with our mission, feel free to
        contact us through the Contact us page with your proposal, or email your proposal at{' '}
        <a href="mailto:engageyouthfoundation@gmail.com" className="text-eyf-gold underline-offset-2 hover:underline">
          engageyouthfoundation@gmail.com
        </a>
        .
      </>
    ),
  },
  {
    question: 'How does EYF ensure data privacy and security?',
    answer:
      'EYF takes data privacy seriously. Our privacy policy outlines how we collect, use, and protect user information. You can find more details in our Privacy Policy section.',
  },
  {
    question: 'Are there internship opportunities at EYF?',
    answer: 'No, we do not offer internship opportunities.',
  },
  {
    question: 'How can I stay updated on EYF’s activities?',
    answer: (
      <>
        Stay connected by subscribing to our newsletter and following us on social media. We regularly share
        updates, event information, and success stories. If you have additional questions, reach out through our
        Contact us page or write to us at{' '}
        <a href="mailto:engageyouthfoundation@gmail.com" className="text-eyf-gold underline-offset-2 hover:underline">
          engageyouthfoundation@gmail.com
        </a>
        .
      </>
    ),
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <InternalPageShell>
      <HeroSection title="Frequently Asked Questions" variant="internal" className="bg-transparent" />

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-container px-4">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-6">
              {FAQS.map((faq, index) => (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-white/10 shadow-xl backdrop-blur-md transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
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
                    className={cn(
                      'overflow-hidden transition-all duration-500 ease-in-out',
                      openIndex === index ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0',
                    )}
                  >
                    <div className="bg-[#1c1c1c]/40 p-8 pt-0">
                      <div className="font-opensans text-base leading-relaxed text-gray-400">
                        {typeof faq.answer === 'string' ? <p>{faq.answer}</p> : faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </InternalPageShell>
  );
}
