import type { Metadata } from 'next';
import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection, TeamGrid, ContentSection } from '@/components/sections';
import { BOARD_MEMBERS, ADVISORY_BOARD } from '@/constants/aboutContent';
import { getBoardMembers, getAdvisoryBoard } from '@/sanity/queries';
import { urlFor } from '@/sanity/client';
import type { SanityTeamMember } from '@/sanity/types';
import { JsonLd } from '@/lib/schema/JsonLd';
import {
  buildPersonSchema,
  buildBreadcrumbSchema,
} from '@/lib/schema/builders';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the Board of Directors and Advisory Board of Engage Youth Foundation — the people driving programs, mentorship, and community impact.',
  alternates: { canonical: '/team/' },
};

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

  // ── Schema.org — one Person per board/advisory member.
  // Only emit schemas for members that come from Sanity (those have stable
  // identifiers + real bios). The static fallback placeholders aren't worth
  // emitting as Person entities since they're not real individuals yet.
  const personSchemas = [
    ...sanityBoard.map((m) =>
      buildPersonSchema(m, m.photo ? urlFor(m.photo) : null),
    ),
    ...sanityAdvisory.map((m) =>
      buildPersonSchema(m, m.photo ? urlFor(m.photo) : null),
    ),
  ];

  return (
    <InternalPageShell>
      <JsonLd
        id="schema-team-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Our Team' },
        ])}
      />
      {personSchemas.map((schema, i) => (
        <JsonLd key={`schema-person-${i}`} data={schema} />
      ))}

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
