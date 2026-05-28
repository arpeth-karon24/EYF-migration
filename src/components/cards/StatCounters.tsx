"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Stat = { title: string; to: number; duration: number };

export function StatCounters({ stats }: { stats: readonly Stat[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const numbers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-counter-value]"));

    const ctx = gsap.context(() => {
      numbers.forEach((el) => {
        const to = Number(el.dataset.counterValue ?? "0");
        const dur = Number(el.dataset.counterDuration ?? "2");
        const obj = { val: 0 };
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: to,
            duration: dur,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.val));
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="mx-auto max-w-[1440px] px-4">
      <div ref={rootRef} className="grid gap-16 py-10 sm:grid-cols-3 lg:py-14">
        {stats.map((s) => (
          <div key={s.title} className="flex flex-col items-center justify-center text-center">
            <div
              className="font-montserrat text-5xl font-bold text-white tabular-nums sm:text-6xl lg:text-[72px]"
              data-counter-value={s.to}
              data-counter-duration={s.duration}
            >
              0
            </div>
            <div className="mt-4 font-opensans text-[16px] font-semibold tracking-widest text-white/90 lg:text-[18px]">
              {s.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
