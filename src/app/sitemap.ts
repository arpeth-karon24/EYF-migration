import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/constants/blogContent";

export const dynamic = "force-static";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://engage-youth.org").trim().replace(/\/$/, "");

const routes = [
  "/",
  "/about-us/",
  "/team/",
  "/news-and-social-media/",
  "/donation/",
  "/request-for-volunteer/",
  "/faq/",
  "/events/",
  "/volunteer-with-us/",
  "/contact-us/",
  "/privacy-policy/",
  "/terms/",
  "/activities/",
  "/past-events/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : 0.7,
  }));

  const posts = BLOG_POSTS.map((post) => ({
    url: `${base}/news-and-social-media/${post.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...posts];
}
