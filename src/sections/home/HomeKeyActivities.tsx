"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KEY_ACTIVITIES_INTRO, KEY_ACTIVITY_BLOCKS } from "@/constants/homeContent";

gsap.registerPlugin(ScrollTrigger);

/**
 * Home — Key Activities section.
 *
 * Animation design: each row's image and copy slide in from OPPOSITE sides
 * (image from its own side, text from the other), echoing the alternating
 * left-right visual rhythm of the layout. A numbered gold badge pops in
 * on the image corner with a back-ease scale to anchor each block.
 *
 * Triggered on scroll into view, plays once. Cleaned up with gsap.context().
 */
export function HomeKeyActivities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header — gentle fade + rise
      gsap.from(".ka-heading", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".ka-heading",
          start: "top 88%",
          once: true,
        },
      });

      // Each row: image slides in from its side, copy from the opposite,
      // numbered badge pops in with a soft overshoot.
      gsap.utils.toArray<HTMLElement>(".ka-row").forEach((row, idx) => {
        const fromLeft = idx % 2 === 0;
        const image = row.querySelector(".ka-image");
        const text = row.querySelector(".ka-text");
        const badge = row.querySelector(".ka-badge");

        const trigger = {
          trigger: row,
          start: "top 78%",
          once: true,
        } as const;

        gsap.from(image, {
          x: fromLeft ? -70 : 70,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: trigger,
        });

        gsap.from(text, {
          x: fromLeft ? 70 : -70,
          opacity: 0,
          duration: 1,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: trigger,
        });

        if (badge) {
          gsap.from(badge, {
            scale: 0,
            opacity: 0,
            duration: 0.7,
            delay: 0.45,
            ease: "back.out(1.7)",
            scrollTrigger: trigger,
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-eyf-page py-16 lg:py-20"
      aria-labelledby="key-activities-heading"
    >
      <div className="mx-auto max-w-container px-4">
        <div className="ka-heading text-center">
          <h2
            id="key-activities-heading"
            className="font-poppins text-3xl font-bold text-white lg:text-[28px]"
          >
            {KEY_ACTIVITIES_INTRO.title}
          </h2>
          <div className="mx-auto mt-8 max-w-5xl font-opensans text-[13px] font-normal leading-relaxed text-white/90">
            {KEY_ACTIVITIES_INTRO.subtitle}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-16 lg:gap-24">
          {KEY_ACTIVITY_BLOCKS.map((block, idx) => (
            <div
              key={block.title}
              className={`ka-row flex flex-col items-center gap-8 lg:flex-row lg:gap-16 ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="ka-image group relative aspect-[16/10] w-full overflow-hidden rounded-[30px] shadow-2xl lg:w-[45%]">
                <Image
                  src={block.image}
                  alt={block.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />

                {/* Subtle gradient overlay — depth, hides at corners */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />

                {/* Numbered badge — gold pill in the top-right corner.
                    Pops in with a soft overshoot via GSAP scrollTrigger. */}
                <div className="ka-badge absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-eyf-gold font-poppins text-base font-bold text-black shadow-lg shadow-eyf-gold/20 ring-2 ring-white/20 backdrop-blur md:h-14 md:w-14 md:text-lg">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="ka-text w-full lg:w-[55%]">
                <h3 className="font-poppins text-lg font-bold text-white sm:text-[18px]">
                  {block.title}
                </h3>
                <p className="mt-4 font-opensans text-[13px] font-normal leading-[1.8] text-white/90">
                  {block.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
