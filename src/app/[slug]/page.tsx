import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

/** WordPress URL parity — only slugs without a dedicated app route */
const SLUG_PAGES: Record<string, string> = {
  activities: "Upcoming/Ongoing Events",
  "past-events": "Past Events",
};

export function generateStaticParams() {
  return Object.keys(SLUG_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = SLUG_PAGES[slug] ?? slug;
  return { title, alternates: { canonical: `/${slug}` } };
}

export default async function StaticSitePage({ params }: Props) {
  const { slug } = await params;
  const title = SLUG_PAGES[slug] ?? slug;
  return (
    <section className="border-b border-white/10 bg-[#141414] py-16">
      <div className="mx-auto max-w-container px-4">
        <h1 className="font-montserrat text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/80">
          This route is scaffolded to preserve URL parity with the WordPress site during migration (Phase 2: import Elementor
          parity markup and connect Sanity fields).
        </p>
      </div>
    </section>
  );
}
