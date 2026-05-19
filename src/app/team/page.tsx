import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection, TeamGrid, ContentSection } from '@/components/sections';
import { BOARD_MEMBERS, ADVISORY_BOARD } from '@/constants/aboutContent';
import { getBoardMembers, getAdvisoryBoard } from '@/sanity/queries';
import { urlFor } from '@/sanity/client';
import type { SanityTeamMember } from '@/sanity/types';

function toTeamMember(m: SanityTeamMember) {
  return {
    id: m._id,
    name: m.name,
    role: m.role,
    image: m.photo ? urlFor(m.photo) ?? undefined : undefined,
    bio: m.bio,
  };
}

export default async function TeamPage() {
  const [sanityBoard, sanityAdvisory] = await Promise.all([
    getBoardMembers(),
    getAdvisoryBoard(),
  ]);

  const boardMembers = sanityBoard.length > 0
    ? sanityBoard.map(toTeamMember)
    : BOARD_MEMBERS;

  const advisoryBoard = sanityAdvisory.length > 0
    ? sanityAdvisory.map(toTeamMember)
    : ADVISORY_BOARD;

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
        members={boardMembers}
        backgroundColor="dark"
        showRoleOnHover={false}
      />

      <TeamGrid title="Advisory Board" members={advisoryBoard} backgroundColor="dark" />
    </InternalPageShell>
  );
}
