import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/navbar/SiteHeader";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { GoogleAnalytics } from "@/services/GoogleAnalytics";
import { JsonLd } from "@/lib/schema/JsonLd";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/schema/builders";

// ── Typography refresh ────────────────────────────────────────────────────
// Modern professional pair:
//   • Space Grotesk — geometric display, slightly playful, very current
//     (used by Vercel, Linear, GitHub Next, etc.). Drives headings + hero.
//   • Inter        — the de-facto modern body font; exceptional readability
//     and a wide weight range. Drives subtitles, UI, and body copy.
//
// CSS variable names (--font-poppins, --font-montserrat, --font-open-sans)
// are preserved so existing `font-poppins / font-montserrat / font-opensans`
// utility classes across the codebase keep working without a global rename.
// The CLASS names are legacy; the VALUES they point at are the new fonts.

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins", // legacy variable, now backed by Space Grotesk
  display: "swap",
});

const accentFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat", // legacy variable, now backed by Inter
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans", // legacy variable, now backed by Inter
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://engage-youth.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Engage Youth Foundation",
    template: "%s | Engage Youth Foundation",
  },
  description:
    "501(c)(3) non-profit engaging, empowering, and mobilizing the next generation through programs, mentorship, and community impact in the Pacific Northwest.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Engage Youth Foundation",
    title: "Engage Youth Foundation",
    description:
      "501(c)(3) non-profit engaging, empowering, and mobilizing the next generation through programs, mentorship, and community impact.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engage Youth Foundation",
    description:
      "501(c)(3) non-profit engaging, empowering, and mobilizing the next generation.",
  },
  icons: {
    icon: [
      { url: "/images/logo/favicon-32x32.png", sizes: "32x32" },
      { url: "/images/logo/favicon-192x192.png", sizes: "192x192" },
    ],
    apple: "/images/logo/apple-touch-icon.png",
  },
  // RSS feed auto-discovery — feed readers like Feedly, Inoreader, and Apple News
  // pick up this hint and offer one-click subscription.
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Engage Youth Foundation — News" },
      ],
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1c1c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={`${displayFont.variable} ${accentFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <head>
        {/* Sitewide Schema.org — Organization + WebSite. Other schemas
            (Event, FAQPage, BlogPosting, etc.) are injected per-page. */}
        <JsonLd id="schema-organization" data={buildOrganizationSchema()} />
        <JsonLd id="schema-website" data={buildWebSiteSchema()} />
      </head>
      <body className="min-h-dvh">
        {/* Accessibility — skip-to-content link for keyboard users */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[1000] focus:rounded focus:bg-eyf-gold focus:px-4 focus:py-2 focus:font-poppins focus:text-sm focus:font-bold focus:text-black"
        >
          Skip to main content
        </a>
        <GoogleAnalytics />
        <div id="page" className="flex min-h-dvh flex-col">
          <SiteHeader />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
