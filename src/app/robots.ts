import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// .trim() guards against a stray space in the NEXT_PUBLIC_SITE_URL env var,
// which would otherwise produce an invalid Sitemap URL ("...pages.dev /sitemap.xml").
const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://engage-youth.org").trim().replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
