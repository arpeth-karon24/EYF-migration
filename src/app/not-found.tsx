import Link from 'next/link';
import { SiteHeader } from '@/components/navbar/SiteHeader';
import { SiteFooter } from '@/components/footer/SiteFooter';

export const metadata = {
  title: '404 — Page Not Found | Engage Youth Foundation',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#1c1c1c] px-4 py-24 text-center">
        {/* Large 404 */}
        <p className="font-poppins text-[120px] font-bold leading-none text-eyf-gold/20 sm:text-[160px] lg:text-[200px]">
          404
        </p>

        <h1 className="mt-4 font-poppins text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          Page not found
        </h1>

        <div className="mx-auto mt-3 h-1 w-16 bg-eyf-gold" />

        <p className="mt-6 max-w-md font-opensans text-base leading-relaxed text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s
          get you back on track.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-[10px] bg-eyf-gold px-8 py-3 font-poppins text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-amber-400"
          >
            Go home
          </Link>
          <Link
            href="/contact-us"
            className="rounded-[10px] border border-white/20 bg-white/5 px-8 py-3 font-poppins text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
          >
            Contact us
          </Link>
        </div>

        {/* Quick nav links */}
        <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 font-opensans text-sm text-white/50">
          {[
            { label: 'About us', href: '/about-us' },
            { label: 'Events', href: '/events' },
            { label: 'Volunteer', href: '/volunteer-with-us' },
            { label: 'Donation', href: '/donation' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-eyf-gold">
              {l.label}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
