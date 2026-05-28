import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroSection, ContentSection } from "@/components/sections";
import { InternalPageShell } from "@/components/layout/InternalPageShell";
import { BlackTitleBar } from "@/components/layout/BlackTitleBar";
import {
  AMAZON_WISHLIST_ITEMS,
  AMAZON_WISHLIST_URL,
  DONATION_GUIDELINES,
  DONATION_GUIDELINES_NOTE,
  DONATION_HERO,
  DONATION_MEDIA,
  IN_KIND_ITEMS,
} from "@/constants/donationContent";
import { JsonLd } from "@/lib/schema/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema/builders";

export const metadata: Metadata = {
  title: "Donation",
  description:
    "Support Engage Youth Foundation through monetary or in-kind donations. Your contribution funds programs, mentorship, and community impact for the next generation.",
  alternates: { canonical: "/donation/" },
};

export default function DonationPage() {
  return (
    <InternalPageShell>
      <JsonLd
        id="schema-donation-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Donation" },
        ])}
      />

      <HeroSection title={DONATION_HERO.title} variant="internal" className="bg-transparent" />

      <ContentSection centered className="bg-transparent">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="mb-4 font-montserrat text-xl font-bold text-white md:text-2xl">Your Donations</h3>
          <p className="font-opensans text-lg leading-relaxed text-gray-200">{DONATION_HERO.intro}</p>
        </div>
      </ContentSection>

      <BlackTitleBar id="in-kind">In-Kind Donations</BlackTitleBar>

      <section className="pb-16 pt-10 md:pb-20 md:pt-12">
        <div className="container mx-auto max-w-container px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
            <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#252525]/95 shadow-2xl ring-1 ring-white/5">
              <h4 className="border-b border-white/10 bg-[#1a1a1a]/80 px-4 py-5 text-center font-montserrat text-lg font-bold tracking-wide text-white md:text-xl">
                Gently Used &amp; New Items
              </h4>
              <div className="relative aspect-[4/3] w-full shrink-0 bg-black/50">
                <Image
                  src={DONATION_MEDIA.inKindHero}
                  alt="Examples of in-kind donations we accept"
                  fill
                  priority
                  fetchPriority="high"
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-1 flex-col px-5 py-6 md:px-6 md:py-7">
                <p className="mb-5 text-center font-opensans text-sm leading-relaxed text-gray-400 md:text-[15px]">
                  To donate items like these, please contact us.
                </p>
                <ul className="list-disc space-y-3 pl-5 font-opensans text-sm leading-relaxed text-gray-200 marker:text-eyf-gold md:text-[15px]">
                  {IN_KIND_ITEMS.map((line) => (
                    <li key={line} className="pl-1">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#252525]/95 shadow-2xl ring-1 ring-white/5">
              <h4 className="border-b border-white/10 bg-[#1a1a1a]/80 px-4 py-5 text-center font-montserrat text-lg font-bold tracking-wide text-white md:text-xl">
                Amazon Wishlist
              </h4>
              <div className="relative flex min-h-[220px] w-full shrink-0 items-center justify-center bg-[#2a2a2a] px-4 py-6 md:min-h-[260px]">
                <div className="relative h-40 w-full max-w-sm md:h-44">
                  <Image
                    src={DONATION_MEDIA.amazonWishlist}
                    alt="Amazon wishlist"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col px-5 py-6 md:px-6 md:py-7">
                <p className="mb-5 text-center font-opensans text-sm leading-relaxed text-gray-300 md:text-[15px]">
                  We also partner with ROOTS Young Adult Shelter (
                  <a
                    href="https://www.rootsinfo.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-eyf-gold underline-offset-2 hover:underline"
                  >
                    www.rootsinfo.org
                  </a>
                  )
                </p>
                <ul className="mb-2 list-disc space-y-3 pl-5 font-opensans text-sm leading-relaxed text-gray-200 marker:text-eyf-gold md:text-[15px]">
                  {AMAZON_WISHLIST_ITEMS.map((line) => (
                    <li key={line} className="pl-1">
                      {line}
                    </li>
                  ))}
                  <li className="pl-1 text-gray-200">
                    Link to{" "}
                    <Link
                      href={AMAZON_WISHLIST_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-eyf-gold underline-offset-2 hover:underline"
                    >
                      Amazon Wishlist
                    </Link>
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <BlackTitleBar>Donation Guidelines</BlackTitleBar>

      <ContentSection centered={false} className="bg-transparent pb-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 font-opensans text-gray-300">
            In order to ensure safety of our recipients, we have the following guidelines. Appreciate your
            understanding.
          </p>
          <ol className="mb-10 list-decimal space-y-4 pl-5 font-opensans text-gray-300">
            {DONATION_GUIDELINES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
          <div className="rounded-2xl border border-eyf-gold/30 bg-[#1c1c1c]/60 p-6 md:p-8">
            <p className="font-opensans text-sm leading-relaxed text-gray-300">
              <span className="font-montserrat font-bold text-eyf-gold">Note: </span>
              {DONATION_GUIDELINES_NOTE}
            </p>
          </div>
        </div>
      </ContentSection>
    </InternalPageShell>
  );
}
