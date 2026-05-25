import type { Metadata } from 'next';
import { HeroSection, ContentSection, GuidelinesList, TeamGrid, MissionVisionSection } from '@/components/sections';
import { EVOLUTION_SECTIONS, BOARD_MEMBERS } from '@/constants/aboutContent';
import Image from 'next/image';
import { JsonLd } from '@/lib/schema/JsonLd';
import {
  buildAboutPageSchema,
  buildBreadcrumbSchema,
} from '@/lib/schema/builders';

export const metadata: Metadata = {
  title: 'About us',
  description:
    "Learn about Engage Youth Foundation — our mission to empower youth, vision for community change, our evolution, and the board of directors leading the work.",
  alternates: { canonical: '/about-us/' },
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#111]">
      <JsonLd id="schema-about" data={buildAboutPageSchema()} />
      <JsonLd
        id="schema-about-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About us' },
        ])}
      />
      {/* Full Page Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2098&auto=format&fit=crop"
          alt="Background"
          fill
          className="object-cover opacity-20 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-transparent to-[#111]" />
      </div>

      <div className="relative z-10">
        <HeroSection 
          title="About us" 
          variant="internal"
          className="bg-transparent"
        />

        {/* Main Content Section */}
        <ContentSection backgroundColor="dark" centered={false} className="bg-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-8 text-gray-300 font-opensans leading-[1.8] text-[16px]">
              <p>
                Welcome to Engage Youth Foundation, a dynamic foundation devoted to empowering and
                mobilizing the youth to drive positive change. For the last few years, our founders have
                been actively engaged and volunteering for societal causes. During their volunteering
                experience, they met a lot of young passionate people who needed guidance, self-realization
                and more crucially a safe, inclusive and diverse platform to explore and experiment their
                ideas. EYF was established with keeping them in mind and with a clear vision; to actively
                engage young individuals, ignite transformative shifts within communities, and contribute
                to the creation of a promising and vibrant future.
              </p>

              <p>
                We firmly believe in harnessing the boundless energy, creativity, and the potential of the youth to make a real impact in the
                world. EYF connects the needs of the community to the youth pool and at the same time
                channelizes ideas and actionable projects from young to benefit the society. Many current global and regional strategic projects running at full stream ahead are
                multi-generational. Climate change initiatives, carbon footprint reduction, space
                exploration, poverty elimination, universal healthcare access, sustainability,
                environmental conservation etc. fall under this category. 
              </p>
              
              <p>
                We have to play an active role in bringing youth to these initiatives, as they will be the beneficiaries and
                torchbearers of these projects. Along with these projects, EYF also believes in giving
                enough knowledge, education and ammunition while they are getting ready to fight for
                greater causes. This could come in the form of access to technology, mentorship, guidance,
                soft-skills development, financial literacy, leadership development, adopting a healthy
                lifestyle, survivorship skills, entrepreneurship etc.
              </p>
            </div>
          </div>
        </ContentSection>

        <MissionVisionSection className="bg-transparent" />

        {/* Our Evolution Section */}
        <GuidelinesList 
          title="Our Evolution" 
          items={EVOLUTION_SECTIONS} 
          numbered={false}
          backgroundColor="dark"
          className="bg-transparent"
        />

        {/* Board section — anchor #board lets older links/nav deep-link here.
            Note: the dedicated /team page is the canonical home for the full
            team listing (Board of Directors + Advisory Board with empty state). */}
        <div id="board" className="py-0 space-y-12 mb-20">
          <TeamGrid
            title="Board of Directors"
            members={BOARD_MEMBERS}
            backgroundColor="dark"
          />
          {/* Advisory Board intentionally omitted on About — see /team page
              for the full advisory board listing (or its empty state). */}
        </div>
      </div>
    </div>
  );
}
