import { HomeHero } from "@/components/hero/HomeHero";
import { StatCounters } from "@/components/cards/StatCounters";
import { HOME_STATS } from "@/constants/homeContent";
import { HomeAboutSection } from "@/sections/home/HomeAboutSection";
import { HomeEventsSection } from "@/sections/home/HomeEventsSection";
import { HomeKeyActivities } from "@/sections/home/HomeKeyActivities";
import { NewsletterSection } from "@/components/footer/NewsletterSection";
import {
  getAllEventsCount,
  getUpcomingEvents,
  getSiteStats,
  getVolunteerCount,
} from "@/sanity/queries";

export async function HomePage() {
  // Fetch all stat sources in parallel.
  //   • eventsCount      — live count of every event in Sanity
  //   • siteStats        — singleton: volunteerCount (baseline) + volunteerHours
  //   • volunteerRecords — count of unique volunteerRegistration docs (deduped)
  //   • upcoming         — for the events carousel further down the page
  // Each source is independent — if any fails we fall back to HOME_STATS.
  const [eventsCount, siteStats, volunteerRecords, upcomingEvents] = await Promise.all([
    getAllEventsCount(),
    getSiteStats(),
    getVolunteerCount(),
    getUpcomingEvents(),
  ]);

  // Volunteer Number = manual baseline (historical/offline) + unique website
  // registrations (deduped by email). Either source can be 0.
  const volunteerTotal = (siteStats?.volunteerCount ?? 0) + volunteerRecords;

  const stats = [
    {
      title: HOME_STATS[0].title,
      to: eventsCount !== null ? eventsCount : HOME_STATS[0].to,
      duration: 2,
    },
    {
      title: HOME_STATS[1].title,
      to: volunteerTotal,
      duration: 2,
    },
    {
      title: HOME_STATS[2].title,
      to: siteStats?.volunteerHours ?? HOME_STATS[2].to,
      duration: 2,
    },
  ];

  return (
    <div className="bg-eyf-page">
      <HomeHero />
      <div className="bg-eyf-page py-4">
        <div className="mx-auto max-w-container px-4">
          <StatCounters stats={stats} />
        </div>
      </div>
      <HomeAboutSection />
      <HomeEventsSection upcomingEvents={upcomingEvents} />
      <HomeKeyActivities />
      <NewsletterSection />
    </div>
  );
}
