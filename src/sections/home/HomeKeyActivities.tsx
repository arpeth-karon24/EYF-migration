import Image from "next/image";
import { KEY_ACTIVITIES_INTRO, KEY_ACTIVITY_BLOCKS } from "@/constants/homeContent";

export function HomeKeyActivities() {
  return (
    <section className="bg-eyf-page py-16 lg:py-20" aria-labelledby="key-activities-heading">
      <div className="mx-auto max-w-container px-4">
        <div className="text-center">
          <h2 id="key-activities-heading" className="font-poppins text-3xl font-bold text-white lg:text-[28px]">
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
              className={`flex flex-col items-center gap-8 lg:flex-row lg:gap-16 ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[30px] shadow-2xl lg:w-[45%]">
                <Image
                  src={block.image}
                  alt={block.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
              <div className="w-full lg:w-[55%]">
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
