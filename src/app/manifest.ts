import type { MetadataRoute } from "next";

// Static generation — required for `output: "export"`. Next.js emits this as
// /manifest.webmanifest at build time and auto-injects the <link rel="manifest">.
export const dynamic = "force-static";

/**
 * Web App Manifest — enables "Add to Home Screen" on mobile and gives the
 * site an app-like identity (name, icons, theme colour) when installed or
 * pinned. Icons reuse the existing logo assets in /public/images/logo.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Engage Youth Foundation",
    short_name: "EYF",
    description:
      "Non-profit engaging, empowering, and mobilizing the next generation through programs, mentorship, and community impact.",
    start_url: "/",
    display: "standalone",
    background_color: "#1c1c1c",
    theme_color: "#1c1c1c",
    icons: [
      {
        src: "/images/logo/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logo/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
