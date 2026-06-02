import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { InternalPageShell } from "@/components/layout/InternalPageShell";
import { HeroSection } from "@/components/sections";
import { BLOG_POSTS, getBlogPostBySlug } from "@/constants/blogContent";
import { getPostBySlug, getAllPostSlugs } from "@/sanity/queries";
import { urlFor } from "@/sanity/client";
import { JsonLd } from "@/lib/schema/JsonLd";
import {
  buildBlogPostSchema,
  buildBreadcrumbSchema,
} from "@/lib/schema/builders";
import { absUrl } from "@/lib/schema/siteConfig";

type Props = { params: Promise<{ slug: string }> };

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const sanitySlugs = await getAllPostSlugs();
  const staticSlugs = BLOG_POSTS.map((p) => p.slug);
  // Merge and deduplicate
  const all = new Set<string>([...staticSlugs, ...sanitySlugs]);
  return Array.from(all).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sanityPost = await getPostBySlug(slug);
  if (sanityPost) {
    // Use the post's own image as the social-share preview when available.
    const ogImage = sanityPost.mainImage ? urlFor(sanityPost.mainImage) : null;
    return {
      title: `${sanityPost.title} | Engage Youth Foundation`,
      description: sanityPost.excerpt,
      alternates: { canonical: `/news-and-social-media/${sanityPost.slug}` },
      openGraph: {
        title: sanityPost.title,
        description: sanityPost.excerpt,
        type: "article",
        ...(ogImage ? { images: [{ url: ogImage, alt: sanityPost.title }] } : {}),
      },
      ...(ogImage ? { twitter: { card: "summary_large_image", images: [ogImage] } } : {}),
    };
  }
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "News" };
  return {
    title: `${post.title} | Engage Youth Foundation`,
    description: post.excerpt,
    alternates: { canonical: `/news-and-social-media/${post.slug}` },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;

  // ── Sanity content ──────────────────────────────────────────────────────────
  const sanityPost = await getPostBySlug(slug);

  if (sanityPost) {
    const imageUrl = sanityPost.mainImage ? urlFor(sanityPost.mainImage) : null;
    const canonicalPath = `/news-and-social-media/${sanityPost.slug}/`;

    return (
      <InternalPageShell>
        <JsonLd
          id="schema-blogposting"
          data={buildBlogPostSchema(sanityPost, imageUrl, canonicalPath)}
        />
        <JsonLd
          id="schema-blogposting-breadcrumb"
          data={buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "News and Social Media", path: "/news-and-social-media/" },
            { name: sanityPost.title },
          ])}
        />

        <HeroSection title={sanityPost.title} variant="internal" className="bg-transparent" />

        <article className="pb-16 pt-4 md:pb-24">
          <div className="mx-auto max-w-container px-4">
            <Link
              href="/news-and-social-media"
              className="mb-8 inline-block font-opensans text-sm text-eyf-gold underline-offset-4 hover:underline"
            >
              ← Back to News and Social Media
            </Link>

            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1c]/80 shadow-xl backdrop-blur-md">
              {imageUrl && (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={imageUrl}
                    alt={sanityPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 896px"
                    priority
                  />
                </div>
              )}

              <div className="p-8 md:p-10">
                <div className="mb-6 flex flex-wrap items-center gap-3 font-poppins text-[11px] font-bold uppercase tracking-widest text-eyf-gold">
                  <span>{sanityPost.category}</span>
                  <span className="text-white/20">|</span>
                  <span className="text-white/60">{formatDate(sanityPost.publishedAt)}</span>
                </div>

                {sanityPost.location && (
                  <p className="mb-8 flex items-center font-opensans text-sm text-white/50">
                    <span className="mr-2">📍</span> {sanityPost.location}
                  </p>
                )}

                {sanityPost.body ? (
                  <div className="prose prose-invert max-w-none prose-p:font-opensans prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-white/85 prose-headings:font-montserrat prose-headings:text-white prose-a:text-eyf-gold prose-strong:text-white">
                    <PortableText value={sanityPost.body} />
                  </div>
                ) : (
                  <p className="font-opensans text-[15px] leading-relaxed text-white/85">
                    {sanityPost.excerpt}
                  </p>
                )}

                {sanityPost.sourceUrl && (
                  <p className="mt-10 border-t border-white/10 pt-8 font-opensans text-sm text-white/50">
                    First published on the Engage Youth Foundation website.{" "}
                    <a
                      href={sanityPost.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-eyf-gold underline-offset-2 hover:underline"
                    >
                      View original post
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </article>
      </InternalPageShell>
    );
  }

  // ── Static fallback ─────────────────────────────────────────────────────────
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();
  const canonicalPath = `/news-and-social-media/${post.slug}/`;

  // Build a Schema.org-compatible BlogPosting from the legacy static post.
  // Shape matches SanityPost loosely (just the fields the schema reads).
  const staticPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: [absUrl(post.image)],
    articleSection: post.category,
    mainEntityOfPage: { "@type": "WebPage", "@id": absUrl(canonicalPath) },
  } as Record<string, unknown>;

  return (
    <InternalPageShell>
      <JsonLd id="schema-blogposting-static" data={staticPostSchema} />
      <JsonLd
        id="schema-blogposting-static-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "News and Social Media", path: "/news-and-social-media/" },
          { name: post.title },
        ])}
      />

      <HeroSection title={post.title} variant="internal" className="bg-transparent" />

      <article className="pb-16 pt-4 md:pb-24">
        <div className="mx-auto max-w-container px-4">
          <Link
            href="/news-and-social-media"
            className="mb-8 inline-block font-opensans text-sm text-eyf-gold underline-offset-4 hover:underline"
          >
            ← Back to News and Social Media
          </Link>

          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1c]/80 shadow-xl backdrop-blur-md">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
            <div className="p-8 md:p-10">
              <div className="mb-6 flex flex-wrap items-center gap-3 font-poppins text-[11px] font-bold uppercase tracking-widest text-eyf-gold">
                <span>{post.category}</span>
                <span className="text-white/20">|</span>
                <span className="text-white/60">{post.date}</span>
              </div>
              <p className="mb-8 flex items-center font-opensans text-sm text-white/50">
                <span className="mr-2">📍</span> {post.location}
              </p>
              <div className="space-y-5 font-opensans text-[15px] leading-relaxed text-white/85">
                {post.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <p className="mt-10 border-t border-white/10 pt-8 font-opensans text-sm text-white/50">
                First published on the Engage Youth Foundation website.{" "}
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-eyf-gold underline-offset-2 hover:underline"
                >
                  View original post
                </a>
              </p>
            </div>
          </div>
        </div>
      </article>
    </InternalPageShell>
  );
}
