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
    <footer id="colophon" className="relative z-10 text-[var(--theme-text)] transition-colors duration-300" style={{ backgroundColor: 'var(--theme-footer)' }} role="contentinfo">
      {/* Main footer grid */}
      <div className="mx-auto max-w-container px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <p className="mb-1 font-poppins text-[11px] font-bold uppercase tracking-[0.25em] text-eyf-gold">
              Engage Youth Foundation
            </p>
            <p className="mt-3 max-w-sm font-opensans text-[13px] leading-relaxed text-white/65">
              A 501(c)(3) nonprofit dedicated to engaging, empowering, and mobilizing the next
              generation. We foster inclusive communities where young minds are heard and actively
              shape a better tomorrow.
            </p>
            <p className="mt-4 font-opensans text-[11px] text-white/40">
              EIN: <span className="text-white/60">47-4212670</span>
            </p>
            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-eyf-gold hover:text-black"
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

          {/* Quick links */}
          <div>
            <p className="mb-4 font-poppins text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
              Quick links
            </p>
            <ul className="space-y-2.5 font-opensans text-[13px] text-white/60">
              {[
                { label: "About us", href: "/about-us" },
                { label: "Events", href: "/events" },
                { label: "Volunteer with us", href: "/volunteer-with-us" },
                { label: "Donation", href: "/donation" },
                { label: "Contact us", href: "/contact-us" },
                { label: "FAQ", href: "/faq" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get involved */}
          <div>
            <p className="mb-4 font-poppins text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
              Get involved
            </p>
            <ul className="space-y-2.5 font-opensans text-[13px] text-white/60">
              {[
                { label: "Make a donation", href: "/donation" },
                { label: "In-kind donations", href: "/donation#in-kind" },
                { label: "Request volunteer support", href: "/request-for-volunteer" },
                { label: "Privacy policy", href: "/privacy-policy" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="mx-auto max-w-container px-4 py-5">
          <div className="flex flex-col items-center justify-between gap-3 text-[12px] text-white/40 sm:flex-row">
            <span>© {new Date().getFullYear()} Engage Youth Foundation. All rights reserved.</span>
            <span>501(c)(3) Nonprofit · EIN 47-4212670</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
