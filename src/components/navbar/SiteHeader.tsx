"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { cn } from "@/lib/cn";
import { PRIMARY_NAV, VOLUNTEER_CTA } from "@/constants/navigation";
import { SITE } from "@/constants/homeContent";
import { SearchTrigger } from "@/components/search/SearchTrigger";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  return (
    <header
      id="masthead"
      className="sticky top-0 z-50 bg-[var(--theme-nav)] shadow-sm transition-colors duration-300"
      style={{ borderBottom: '1px solid var(--theme-border)' }}
      role="banner"
    >
      <nav className="navbar relative bg-[var(--theme-nav)]" aria-label="Primary">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-10 px-5 py-4 sm:px-8 sm:py-5 navlg:gap-16 navlg:px-12 navlg:py-5 xl:px-20">
          {/* Brand — full WP logo lockup (icon + Channelizing Freshness), left-aligned */}
          <Link href="/" className="logo shrink-0" aria-label={SITE.name}>
            <Image
              src={SITE.logo}
              alt={SITE.name}
              width={900}
              height={320}
              className="h-auto w-auto max-h-[64px] sm:max-h-[80px] navlg:max-h-[120px] xl:max-h-[140px]"
              sizes="(max-width: 1024px) 280px, 420px"
              quality={95}
              priority
            />
          </Link>

          {/* Nav — right-aligned, matches engage-youth.org */}
          <div className="flex shrink-0 items-center justify-end">
            <ul
              id="responsive-menu"
              className="hidden items-center justify-end navlg:flex"
            >
              {PRIMARY_NAV.map((item) => (
                <li key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className="flex items-center whitespace-nowrap px-5 py-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--theme-text-2)] transition-colors hover:bg-[var(--theme-card)] hover:text-[var(--theme-text)]"
                  >
                    {item.label}
                    {item.children && item.children.length > 0 && (
                      <svg
                        className="ml-1 h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                  {item.children && item.children.length > 0 && (
                    <ul
                      className="invisible absolute right-0 top-full z-50 min-w-[280px] translate-y-2 rounded-xl border bg-[var(--theme-nav)] p-2 opacity-0 shadow-2xl transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                      style={{ borderColor: 'var(--theme-border)' }}
                    >
                      {item.children.map((c) => (
                        <li key={c.href + c.label}>
                          <Link
                            href={c.href}
                            className="block rounded-lg px-4 py-3 text-xs uppercase tracking-wider text-[var(--theme-text-2)] transition-colors duration-200 hover:bg-[var(--theme-card)] hover:text-[var(--theme-text)]"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {/* Search trigger — opens search dialog. Sits between nav and CTA on desktop. */}
              <li className="ml-3">
                <SearchTrigger />
              </li>
              <li className="ml-2">
                <Link
                  href={VOLUNTEER_CTA.href}
                  className={cn(
                    "menu_custom_btn inline-flex items-center whitespace-nowrap rounded-[10px] border-0 bg-[#444444] px-4 py-[7px]",
                    "text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1c1c1c]",
                  )}
                >
                  {VOLUNTEER_CTA.label}
                </Link>
              </li>
            </ul>

            {/* Mobile: search button next to hamburger */}
            <div className="flex items-center gap-2 navlg:hidden">
              <SearchTrigger />
              <button
              type="button"
              className="rounded border border-white/20 px-3 py-2 text-white"
              aria-expanded={open}
              aria-controls="mobile-primary-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Toggle menu</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
            </div>
          </div>
        </div>

        <div
          id="mobile-primary-nav"
          className={cn(
            "absolute left-0 right-0 top-full z-50 overflow-hidden border-t transition-all duration-300 navlg:hidden",
            open ? "max-h-[100vh] opacity-100" : "pointer-events-none max-h-0 opacity-0",
          )}
          style={{ backgroundColor: 'var(--theme-bg-mobile-nav)', borderColor: 'var(--theme-border)' }}
        >
          <div className="px-4 pb-10 pt-4">
            {PRIMARY_NAV.map((item) => (
              <div key={item.label} className="py-1">
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-3.5 text-sm font-semibold uppercase tracking-widest text-[var(--theme-text-2)] transition-colors duration-200 hover:bg-[var(--theme-card)] hover:text-[var(--theme-text)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block rounded-lg py-3 pl-8 pr-3 text-xs uppercase tracking-widest text-[var(--theme-text-2)] transition-colors duration-200 hover:bg-[var(--theme-card)] hover:text-[var(--theme-text)]"
                    onClick={() => setOpen(false)}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="pt-6">
              <Link
                href={VOLUNTEER_CTA.href}
                className="block rounded-[10px] bg-[#444444] py-4 text-center text-xs font-bold uppercase tracking-[0.15em] text-white hover:bg-[#1c1c1c]"
                onClick={() => setOpen(false)}
              >
                {VOLUNTEER_CTA.label}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
