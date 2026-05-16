'use client';

import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection, TeamGrid, ContentSection } from '@/components/sections';
import { BOARD_MEMBERS, ADVISORY_BOARD } from '@/constants/aboutContent';

export default function TeamPage() {
  return (
    <InternalPageShell>
      <HeroSection title="Our Team" variant="internal" className="bg-transparent" />

      <ContentSection centered className="bg-transparent">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 font-poppins text-3xl font-bold uppercase tracking-[0.2em] text-white">
            Who We Are
          </h2>
          <div className="mx-auto mb-10 h-1 w-20 bg-eyf-gold" />
          <p className="mx-auto max-w-3xl font-opensans text-lg leading-[2] text-gray-300">
            Our team is comprised of passionate individuals dedicated to empowering youth and creating
            positive community impact. With diverse backgrounds and expertise, our board members and
            advisors bring a wealth of knowledge and commitment to our mission.
          </p>
        </div>
      </ContentSection>

      <TeamGrid
        title="Board of Directors"
        members={BOARD_MEMBERS}
        backgroundColor="dark"
        showRoleOnHover={false}
      />

      <TeamGrid title="Advisory Board" members={ADVISORY_BOARD} backgroundColor="dark" />
    </InternalPageShell>
  );
}
