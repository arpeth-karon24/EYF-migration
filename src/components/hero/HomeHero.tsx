"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { HERO_SLIDES } from "@/constants/homeContent";

/**
 * Home hero banner.
 *
 * Performance notes:
 * - First slide uses `priority` so it's the LCP (Largest Contentful Paint).
 *   Browser preloads it and we get the green Lighthouse score.
 * - Remaining slides lazy-load to keep initial bundle small.
 * - `<Image>` (not background-image) lets Next.js serve responsive
 *   srcset + modern formats (AVIF/WebP) automatically.
 */
export function HomeHero() {
  return (
    <section className="home-hero relative w-full overflow-hidden bg-black" aria-label="Homepage banner">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, Keyboard]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1500}
        keyboard
        navigation
        pagination={{ clickable: true }}
        slidesPerView={1}
        className="w-full"
      >
        {HERO_SLIDES.map((slide, idx) => (
          <SwiperSlide key={`${idx}-${slide.title}`}>
            {/* h-full = fill the .swiper-slide (which is pinned to a fixed height
                in globals.css). This guarantees the image covers the entire slide
                area regardless of body-copy length, so no slide leaves a dark gap
                above the home stats. */}
            <div className="relative flex h-full w-full items-center">
              {/* Background image — Next.js Image with priority on first slide
                  for fast LCP. Fills the container, covers like background-size:cover. */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "auto"}
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Overlay stack:
                  1. Left-to-right gradient — strong on the left for text contrast,
                     fading away on the right so the image stays alive instead of
                     being uniformly darkened.
                  2. Soft bottom vignette — gives the hero a clean edge into the
                     home-stats section below without harshly cutting the image. */}
              <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="relative z-[2] w-full">
                <div className="mx-auto max-w-container px-4 py-16 lg:py-24">
                  <div className="max-w-3xl animate-fadeInDown">
                    {/* Gold accent — small horizontal rule + uppercase label.
                        Anchors the headline visually and signals "this is a
                        designed page" rather than a stock template. */}
                    <div className="mb-6 flex items-center gap-3">
                      <span className="block h-[2px] w-12 bg-eyf-gold" />
                      <span className="font-poppins text-[11px] font-bold uppercase tracking-[0.28em] text-eyf-gold">
                        501(c)(3) Nonprofit · Pacific Northwest
                      </span>
                    </div>

                    {/* Title — bolder, tighter tracking, slightly larger range. */}
                    <h1 className="mb-5 font-poppins text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight text-white">
                      {slide.title}
                    </h1>

                    {/* Body — slightly larger and tighter leading for readability. */}
                    <p className="mb-8 max-w-2xl font-opensans text-[15px] font-normal leading-[1.7] text-white/90 lg:text-base">
                      {slide.body}
                    </p>

                    {/* CTA group — primary gold pill + ghost link. Gives visitors
                        a clear next step instead of a passive image-and-text wall. */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                      <Link
                        href="/volunteer-with-us/"
                        className="inline-flex items-center justify-center rounded-full bg-eyf-gold px-7 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-black shadow-lg shadow-eyf-gold/10 transition-all duration-200 hover:bg-white hover:shadow-xl"
                      >
                        Volunteer with us
                      </Link>
                      <Link
                        href="/about-us/"
                        className="inline-flex items-center gap-2 px-2 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:text-eyf-gold"
                      >
                        Learn more
                        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
