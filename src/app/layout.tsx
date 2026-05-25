import type { Metadata, Viewport } from "next";
import { Open_Sans, Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/navbar/SiteHeader";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { GoogleAnalytics } from "@/services/GoogleAnalytics";
import { JsonLd } from "@/lib/schema/JsonLd";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/schema/builders";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
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
    <html lang="en-US" className={`${poppins.variable} ${montserrat.variable} ${openSans.variable}`} suppressHydrationWarning>
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
