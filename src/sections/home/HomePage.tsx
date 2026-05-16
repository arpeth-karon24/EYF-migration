import { HomeHero } from "@/components/hero/HomeHero";
import { StatCounters } from "@/components/cards/StatCounters";
import { HOME_STATS } from "@/constants/homeContent";
import { HomeAboutSection } from "@/sections/home/HomeAboutSection";
import { HomeEventsSection } from "@/sections/home/HomeEventsSection";
import { HomeKeyActivities } from "@/sections/home/HomeKeyActivities";
import { NewsletterSection } from "@/components/footer/NewsletterSection";

export function HomePage() {
  return (
    <div className="bg-eyf-page">
      <HomeHero />
      <div className="bg-eyf-page py-4">
        <div className="mx-auto max-w-container px-4">
          <StatCounters stats={HOME_STATS} />
        </div>
      </div>
      <HomeAboutSection />
      <HomeEventsSection />
      <HomeKeyActivities />
      <NewsletterSection />
    </div>
  );
}
