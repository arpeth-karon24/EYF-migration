import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Redirects are in public/_redirects (Netlify/Cloudflare). next.config redirects do not apply to static export.
  images: {
    // Required for `output: "export"` — Next image optimizer can't run statically.
    unoptimized: true,
    // Allowlist of remote hosts that <Image src="..."> can load from.
    // Local assets from /public are always allowed (no entry needed here).
    remotePatterns: [
      // Sanity CMS image CDN — events, news posts, team photos
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
    ],
  },
};

export default nextConfig;
