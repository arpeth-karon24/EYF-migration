import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// .trim() guards against a stray space in the NEXT_PUBLIC_SITE_URL env var,
// which would otherwise produce an invalid Sitemap URL ("...pages.dev /sitemap.xml").
const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://engage-youth.org").trim().replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all crawlers by default
      { userAgent: "*", allow: "/" },
      // Explicitly allow AI crawlers to index for search summaries
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
