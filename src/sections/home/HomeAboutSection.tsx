import Link from "next/link";
import Image from "next/image";
import { HOME_ABOUT } from "@/constants/homeContent";

export function HomeAboutSection() {
  return (
    <section className="bg-eyf-page py-0" aria-labelledby="home-about-heading">
      <div className="relative min-h-[400px] w-full overflow-hidden lg:min-h-[500px]">
        <Image
          src={HOME_ABOUT.image}
          alt="About Engage Youth"
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 py-12 text-center lg:px-24 lg:py-16">
          <h2
            id="home-about-heading"
            className="font-poppins text-3xl font-bold text-white sm:text-4xl lg:text-[38px]"
          >
            {HOME_ABOUT.heading}
          </h2>
          <div className="mt-8 max-w-5xl font-opensans text-xs font-normal leading-relaxed text-white/90 sm:text-sm lg:text-[14px] lg:leading-[1.8]">
            <p>{HOME_ABOUT.text}</p>
          </div>
          <div className="mt-8">
            <Link
              href={HOME_ABOUT.readMoreHref}
              aria-label="Read more about Engage Youth Foundation"
              className="inline-flex items-center justify-center rounded-full bg-[#1c1c1c] px-8 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white ring-1 ring-white/10 transition-all hover:bg-[#222]"
            >
              Read more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
