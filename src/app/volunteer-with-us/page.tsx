import type { Metadata } from 'next';
import VolunteerPageClient from './VolunteerPageClient';
import { getUpcomingEvents } from '@/sanity/queries';
import { JsonLd } from '@/lib/schema/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema/builders';

export const metadata: Metadata = {
  title: 'Volunteer with us',
  description:
    'Join the Engage Youth Foundation volunteer community. Help with programs, mentorship, events, and community projects that empower youth.',
  alternates: { canonical: '/volunteer-with-us/' },
};

/**
 * Server component — fetches upcoming events from Sanity at build time
 * and hands them to the interactive client wrapper. The event title
 * dropdown inside the registration modal/form is populated from this data.
 */
export default async function VolunteerPage() {
  const upcomingEvents = await getUpcomingEvents();

  return (
    <>
      <JsonLd
        id="schema-volunteer-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Volunteer with us' },
        ])}
      />
      <VolunteerPageClient upcomingEvents={upcomingEvents} />
    </>
  );
}
