"use client";

import Link from "next/link";

const social = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" as const },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
  { label: "Youtube", href: "https://youtube.com", icon: "youtube" as const },
];

function FacebookIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 512 512" aria-hidden>
      <path
        fill="currentColor"
        d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 448 512" aria-hidden>
      <path
        fill="currentColor"
        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2h.1c.5-1 1.8-2.4 3.8-2.4 4.1 0 4.8 2.7 4.8 6.2V23h-4v-6.5c0-1.6 0-3.6-2.2-3.6-2.2 0-2.5 1.7-2.5 3.5V23h-4V8z"
      />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 576 512" aria-hidden>
      <path
        fill="currentColor"
        d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.203-142.739 81.203z"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer id="colophon" className="relative z-10 bg-[#111] text-white" role="contentinfo">
      <div className="mx-auto max-w-container px-4 py-8">
        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-0">
          <div className="text-[13px] font-normal text-white">
            Copyright © 2024 Engage Youth Foundation
          </div>

          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            <div className="flex gap-8 text-[13px] font-medium text-white">
              <Link href="/privacy-policy" className="transition-opacity hover:opacity-70">
                Privacy Policy
              </Link>
              <Link href="/contact-us" className="transition-opacity hover:opacity-70">
                Contact us
              </Link>
            </div>

            <div className="flex gap-4">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
                  aria-label={s.label}
                >
                  {s.icon === "facebook" && <FacebookIcon />}
                  {s.icon === "linkedin" && <LinkedInIcon />}
                  {s.icon === "instagram" && <InstagramIcon />}
                  {s.icon === "youtube" && <YoutubeIcon />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
