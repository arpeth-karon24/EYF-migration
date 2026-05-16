import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Redirects are in public/_redirects (Netlify/Cloudflare). next.config redirects do not apply to static export.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "engage-youth.org", pathname: "/wp-content/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
