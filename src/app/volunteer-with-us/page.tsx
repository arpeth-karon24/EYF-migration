import VolunteerPageClient from './VolunteerPageClient';
import { getUpcomingEvents } from '@/sanity/queries';

/**
 * Server component — fetches upcoming events from Sanity at build time
 * and hands them to the interactive client wrapper. The event title
 * dropdown inside the registration modal/form is populated from this data.
 */
export default async function VolunteerPage() {
  const upcomingEvents = await getUpcomingEvents();
  return <VolunteerPageClient upcomingEvents={upcomingEvents} />;
}
