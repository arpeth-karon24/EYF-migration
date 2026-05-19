import { HomeHero } from "@/components/hero/HomeHero";
import { StatCounters } from "@/components/cards/StatCounters";
import { HOME_STATS } from "@/constants/homeContent";
import { HomeAboutSection } from "@/sections/home/HomeAboutSection";
import { HomeEventsSection } from "@/sections/home/HomeEventsSection";
import { HomeKeyActivities } from "@/sections/home/HomeKeyActivities";
import { NewsletterSection } from "@/components/footer/NewsletterSection";
import { getAllEventsCount, getUpcomingEvents } from "@/sanity/queries";

export async function HomePage() {
  const [eventsCount, upcomingEvents] = await Promise.all([
    getAllEventsCount(),
    getUpcomingEvents(),
  ]);

  const stats = [
    {
      title: HOME_STATS[0].title,
      to: eventsCount !== null ? eventsCount : HOME_STATS[0].to,
      duration: 2,
    },
    { title: HOME_STATS[1].title, to: HOME_STATS[1].to, duration: 2 },
    { title: HOME_STATS[2].title, to: HOME_STATS[2].to, duration: 2 },
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
