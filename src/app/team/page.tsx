import type { Metadata } from 'next';
import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection, TeamGrid, ContentSection } from '@/components/sections';
import { BOARD_MEMBERS } from '@/constants/aboutContent';
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
    image: m.photo ? (urlFor(m.photo) ?? undefined) : undefined,
    bio: m.bio,
  };
}

export default async function TeamPage() {
  const [sanityBoard, sanityAdvisory] = await Promise.all([
    getBoardMembers(),
    getAdvisoryBoard(),
  ]);

  // Board of Directors — prefer Sanity (live), fall back to BOARD_MEMBERS
  // constant (Jagan Nair + Janaki Nair are real, not placeholders).
  const boardMembers =
    sanityBoard.length > 0 ? sanityBoard.map(toTeamMember) : BOARD_MEMBERS;

  // Advisory Board — show ONLY real Sanity members. No dummy fallback —
  // when empty, TeamGrid renders a "coming soon" placeholder so visitors
  // don't see fake placeholder names like "Advisory Board Member".
  const advisoryBoard = sanityAdvisory.map(toTeamMember);

  // ── Schema.org — one Person per real Sanity-backed member.
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

      <HeroSection
        title="Our Team"
        variant="internal"
        className="bg-transparent"
      />

      <ContentSection centered className="bg-transparent">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 font-poppins text-2xl font-bold uppercase tracking-[0.2em] text-white sm:text-3xl">
            Who We Are
          </h2>
          <div className="mx-auto mb-8 h-1 w-20 bg-eyf-gold md:mb-10" />
          <p className="mx-auto max-w-3xl font-opensans text-base leading-[1.9] text-gray-300 md:text-lg md:leading-[2]">
            Our team is comprised of passionate individuals dedicated to
            empowering youth and creating positive community impact. With
            diverse backgrounds and expertise, our board members and advisors
            bring a wealth of knowledge and commitment to our mission.
          </p>
        </div>
      </ContentSection>

      {/* Board of Directors — always rendered (real members exist) */}
      <TeamGrid
        title="Board of Directors"
        members={boardMembers}
        backgroundColor="dark"
      />

      {/* Advisory Board — renders empty state if no Sanity members yet */}
      <TeamGrid
        title="Advisory Board"
        members={advisoryBoard}
        backgroundColor="dark"
        emptyStateMessage="Advisory Board members coming soon"
      />
    </InternalPageShell>
  );
}
