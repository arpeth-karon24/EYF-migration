import { getAllPosts } from "@/sanity/queries";
import { BLOG_POSTS } from "@/constants/blogContent";
import { urlFor } from "@/sanity/client";
import { SITE, SITE_URL, absUrl } from "@/lib/schema/siteConfig";

/**
 * RSS 2.0 feed at /feed.xml
 *
 * RSS readers (Feedly, Inoreader, NetNewsWire, Apple News, etc.) discover
 * this URL via the <link rel="alternate" type="application/rss+xml">
 * tag we add in news pages. Subscribers get notified automatically when
 * new posts go up in Sanity — no extra work after the build pipeline runs.
 *
 * Static-export compatible: marked `force-static` so it's generated at
 * build time alongside the other pages and served as a plain XML file.
 */
export const dynamic = "force-static";

/** Escape user-provided text so it doesn't break the XML envelope. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Wrap free-form HTML/text in CDATA so the parser doesn't try to interpret it. */
function cdata(value: string): string {
  // Escape any closing CDATA sequences inside the value
  const safe = value.replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
}

interface FeedItem {
  title: string;
  link: string;
  guid: string;
  description: string;
  pubDate: string;
  category?: string;
  imageUrl?: string | null;
}

export async function GET() {
  // 1. Pull all posts from Sanity. Sanity is the source of truth for blog
  //    content; if it returns nothing (e.g., env var missing in CI),
  //    fall back to the static BLOG_POSTS constants so the feed still works.
  const sanityPosts = await getAllPosts();

  const items: FeedItem[] =
    sanityPosts.length > 0
      ? sanityPosts.map((post) => ({
          title: post.title,
          link: absUrl(`/news-and-social-media/${post.slug}/`),
          guid: absUrl(`/news-and-social-media/${post.slug}/`),
          description: post.excerpt,
          pubDate: new Date(post.publishedAt).toUTCString(),
          category: post.category,
          imageUrl: post.mainImage ? urlFor(post.mainImage) : null,
        }))
      : BLOG_POSTS.map((post) => ({
          title: post.title,
          link: absUrl(`/news-and-social-media/${post.slug}/`),
          guid: absUrl(`/news-and-social-media/${post.slug}/`),
          description: post.excerpt,
          pubDate: new Date(post.date).toUTCString(),
          category: post.category,
          imageUrl: post.image ? absUrl(post.image) : null,
        }));

  // 2. Build the RSS 2.0 envelope.
  // Channel-level metadata: site name, link, description, language, etc.
  // Item-level: each post becomes <item> with title, link, guid, pubDate.
  const lastBuildDate = new Date().toUTCString();
  const feedSelfUrl = `${SITE_URL}/feed.xml`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE.name)} — News and Social Media</title>
    <link>${SITE_URL}</link>
    <atom:link href="${feedSelfUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE.description)}</description>
    <language>en-us</language>
    <copyright>Copyright © ${new Date().getFullYear()} ${escapeXml(SITE.name)}. All rights reserved.</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Next.js + Sanity CMS</generator>
    <image>
      <url>${SITE.logo}</url>
      <title>${escapeXml(SITE.name)}</title>
      <link>${SITE_URL}</link>
    </image>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${cdata(item.description)}</description>
${item.category ? `      <category>${escapeXml(item.category)}</category>\n` : ""}${item.imageUrl ? `      <enclosure url="${escapeXml(item.imageUrl)}" type="image/jpeg" length="0" />\n` : ""}      <dc:creator>${escapeXml(SITE.name)}</dc:creator>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // Cache for 1 hour at the edge; new builds will replace it
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
