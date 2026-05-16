"use client";

import Image from "next/image";
import { MISSION_VISION_GRAPHIC } from "@/constants/aboutContent";

interface MissionVisionSectionProps {
  imageSrc?: string;
  className?: string;
}

export default function MissionVisionSection({
  imageSrc = MISSION_VISION_GRAPHIC,
  className = "",
}: MissionVisionSectionProps) {
  return (
    <section
      id="vision"
      className={`w-full scroll-mt-28 navlg:scroll-mt-40 ${className}`}
      aria-labelledby="mission-vision-heading"
    >
      <div className="w-full bg-black py-4 mb-10 text-center">
        <h2
          id="mission-vision-heading"
          className="text-xl font-poppins font-bold text-white tracking-widest md:text-2xl"
        >
          Mission & Vision
        </h2>
      </div>

      <div className="container max-w-container mx-auto px-4 pb-16">
        <div className="mx-auto max-w-5xl rounded-xl border border-white/10 bg-[#1c1c1c]/90 p-4 md:p-8">
          <Image
            src={imageSrc}
            alt="Engage Youth Foundation mission and vision"
            width={1600}
            height={900}
            className="h-auto w-full object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
          />
        </div>
      </div>
    </section>
  );
}
