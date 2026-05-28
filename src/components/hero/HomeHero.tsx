"use client";

import Image from "next/image";
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
    <section className="home-hero relative w-full overflow-hidden bg-eyf-page" aria-label="Homepage banner">
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
              <div className="absolute inset-0 bg-black/60 z-[1]" />
              {/* Bottom fade — gradients the slide image into the page background
                  (#1c1c1c) so EVERY slide transitions into the stats section
                  seamlessly, regardless of how dark/bright that particular photo
                  is at the bottom. Eliminates the "chunky boundary" perception. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/70 to-transparent" />
              <div className="relative z-[2] w-full">
                <div className="mx-auto max-w-container px-4 py-20 lg:py-32">
                  <div className="max-w-4xl animate-fadeInDown">
                    <h1 className="font-poppins text-[clamp(1.75rem,4vw,3.5rem)] font-semibold leading-[1.2] text-white">
                      {slide.title}
                    </h1>
                    <p className="mt-6 max-w-2xl font-opensans text-sm font-normal leading-[1.8] text-white opacity-90 lg:text-base">
                      {slide.body}
                    </p>
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
