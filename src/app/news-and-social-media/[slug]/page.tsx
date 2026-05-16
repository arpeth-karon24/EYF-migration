import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InternalPageShell } from "@/components/layout/InternalPageShell";
import { HeroSection } from "@/components/sections";
import { BLOG_POSTS, getBlogPostBySlug } from "@/constants/blogContent";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <InternalPageShell>
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
