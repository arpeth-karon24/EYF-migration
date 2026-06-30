import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
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
// Distinctive professional pair:
//   • Bricolage Grotesque — modern display face with real character
//     (varied stroke widths, distinctive a / g / r letterforms). Reads as
//     "intentionally designed" rather than off-the-shelf. Drives headings.
//   • Inter — the de-facto modern body font; exceptional readability and a
//     wide weight range. Drives subtitles, UI, and body copy.
//
// CSS variable names (--font-poppins, --font-montserrat, --font-open-sans)
// are preserved so existing `font-poppins / font-montserrat / font-opensans`
// utility classes across the codebase keep working without a global rename.
// The CLASS names are legacy; the VALUES they point at are the new fonts.

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins", // legacy variable, now backed by Bricolage Grotesque
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
    "Non-profit engaging, empowering, and mobilizing the next generation through programs, mentorship, and community impact in the Pacific Northwest.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Engage Youth Foundation",
    title: "Engage Youth Foundation",
    description:
      "Non-profit engaging, empowering, and mobilizing the next generation through programs, mentorship, and community impact.",
    // Default social-share preview. Pages may override with their own image
    // (e.g. an event or news post uses its own photo). Relative URL is made
    // absolute automatically via metadataBase above.
    images: [
      {
        url: "/images/logo/eyf-logo-square.png",
        width: 512,
        height: 512,
        alt: "Engage Youth Foundation logo",
      },
      {
        url: "/images/home/hero-slide-1.jpeg",
        alt: "Engage Youth Foundation — empowering the next generation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engage Youth Foundation",
    description:
      "Non-profit engaging, empowering, and mobilizing the next generation.",
    images: ["/images/logo/eyf-logo-square.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/images/logo/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
