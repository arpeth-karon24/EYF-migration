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
  //   • eventsCount    — live count of every event in Sanity
  //   • siteStats      — singleton holding volunteerCount (fallback) + volunteerHours
  //   • volunteerLive  — DERIVED count of volunteerRegistration docs (requires
  //                      SANITY_API_READ_TOKEN at build time, since these docs
  //                      are not returned to anonymous requests)
  //   • upcoming       — for the events carousel further down the page
  //
  // Derived count = single source of truth. When admins delete a record in
  // Sanity Studio, the next rebuild re-derives the count and the homepage
  // automatically drops — no separate decrement needed.
  //
  // Fallback rules:
  //   • volunteerLive === number (incl. 0) → derived count is trustworthy → use it
  //   • volunteerLive === null              → couldn't determine (no token /
  //     query error) → fall back to siteStats.volunteerCount so the homepage
  //     keeps showing a reasonable number until the token is configured
  // Crucially, a real 0 from the derived query is RESPECTED — so deletes
  // actually drop the homepage count instead of being hidden by the fallback.
  const [eventsCount, siteStats, volunteerLive, upcomingEvents] = await Promise.all([
    getAllEventsCount(),
    getSiteStats(),
    getVolunteerCount(),
    getUpcomingEvents(),
  ]);

  const volunteerTotal =
    volunteerLive ?? siteStats?.volunteerCount ?? 0;

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
