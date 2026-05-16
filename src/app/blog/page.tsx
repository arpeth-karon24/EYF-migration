import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: true },
};

/** Fallback page; hosting redirect in public/_redirects sends /blog → /news-and-social-media/ */
export default function BlogPage() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center bg-[#111] px-4 text-center">
      <p className="mb-4 font-opensans text-white/80">This page has moved.</p>
      <Link href="/news-and-social-media/" className="text-eyf-gold underline-offset-2 hover:underline">
        Go to News and Social Media
      </Link>
    </div>
  );
}
