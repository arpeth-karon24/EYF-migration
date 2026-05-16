"use client";

import { Autoplay, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { HERO_SLIDES } from "@/constants/homeContent";

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
            <div
              className="relative flex min-h-[500px] md:min-h-[700px] lg:min-h-[820px] w-full items-center bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/60 z-[1]" />
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
