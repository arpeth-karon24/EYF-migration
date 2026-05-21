import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { InternalPageShell } from '@/components/layout/InternalPageShell';
import { HeroSection } from '@/components/sections';
import { ARCHIVES, BLOG_POSTS, CATEGORIES, RECENT_POST_LINKS } from '@/constants/blogContent';
import { getAllPosts } from '@/sanity/queries';
import { urlFor } from '@/sanity/client';
import type { SanityPost } from '@/sanity/types';
import { JsonLd } from '@/lib/schema/JsonLd';
import {
  buildCollectionPageSchema,
  buildBreadcrumbSchema,
} from '@/lib/schema/builders';

export const metadata: Metadata = {
  title: 'News and Social Media',
  description:
    'Latest stories, blog posts, and community updates from Engage Youth Foundation. Read about partnerships, impact, and youth-led initiatives.',
  alternates: { canonical: '/news-and-social-media/' },
};

const sidebarTitle =
  'mb-6 border-l-4 border-eyf-gold pl-4 font-poppins text-xs font-bold uppercase tracking-wider text-white';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default async function NewsPage() {
  const sanityPosts = await getAllPosts();

  const itemCount =
    sanityPosts.length > 0 ? sanityPosts.length : BLOG_POSTS.length;
  const hasSanityContent = sanityPosts.length > 0;

  const recentLinks = hasSanityContent
    ? sanityPosts.map((p) => ({ title: p.title, href: `/news-and-social-media/${p.slug}` }))
    : RECENT_POST_LINKS;

  return (
    <InternalPageShell>
      <JsonLd
        id="schema-news-collection"
        data={buildCollectionPageSchema({
          name: 'News and Social Media — Engage Youth Foundation',
          description:
            'Latest stories, blog posts, and community updates from Engage Youth Foundation.',
          path: '/news-and-social-media/',
          itemCount,
        })}
      />
      <JsonLd
        id="schema-news-breadcrumb"
        data={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'News and Social Media' },
        ])}
      />

      <HeroSection title="News and Social Media" variant="internal" className="bg-transparent" />

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-container px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

            {/* Posts */}
            <div className="space-y-12 lg:col-span-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                {hasSanityContent
                  ? sanityPosts.map((post: SanityPost) => {
                      const imageUrl = post.mainImage ? urlFor(post.mainImage) : null;
                      return (
                        <article key={post._id}
                          className="group overflow-hidden rounded-2xl border border-white/5 bg-[#1c1c1c]/80 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
                          {imageUrl && (
                            <div className="relative h-56 w-full overflow-hidden">
                              <Image src={imageUrl} alt={post.title} fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw" />
                            </div>
                          )}
                          <div className="p-6">
                            <div className="mb-4 flex items-center gap-3 font-poppins text-[11px] font-bold uppercase tracking-widest text-eyf-gold">
                              <span>{post.category}</span>
                              <span className="text-white/20">|</span>
                              <span className="text-white/60">{formatDate(post.publishedAt)}</span>
                            </div>
                            <h2 className="mb-3 font-montserrat text-xl font-bold leading-tight text-white transition-colors group-hover:text-eyf-gold">
                              {post.title}
                            </h2>
                            {post.location && (
                              <p className="mb-3 flex items-center font-opensans text-xs text-white/40">
                                <span className="mr-2">📍</span> {post.location}
                              </p>
                            )}
                            <p className="mb-6 line-clamp-3 font-opensans text-[14px] leading-relaxed text-white/70">
                              {post.excerpt}
                            </p>
                            <Link href={`/news-and-social-media/${post.slug}`}
                              className="inline-block border-b border-white/20 pb-1 font-poppins text-xs font-bold uppercase tracking-widest text-white transition-all hover:border-white">
                              Read More
                            </Link>
                          </div>
                        </article>
                      );
                    })
                  : BLOG_POSTS.map((post) => (
                      <article key={post.id}
                        className="group overflow-hidden rounded-2xl border border-white/5 bg-[#1c1c1c]/80 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
                        {post.image && (
                          <div className="relative h-56 w-full overflow-hidden">
                            <Image src={post.image} alt={post.title} fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 50vw" />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="mb-4 flex items-center gap-3 font-poppins text-[11px] font-bold uppercase tracking-widest text-eyf-gold">
                            <span>{post.category}</span>
                            <span className="text-white/20">|</span>
                            <span className="text-white/60">{post.date}</span>
                          </div>
                          <h2 className="mb-3 font-montserrat text-xl font-bold leading-tight text-white transition-colors group-hover:text-eyf-gold">
                            {post.title}
                          </h2>
                          <p className="mb-3 flex items-center font-opensans text-xs text-white/40">
                            <span className="mr-2">📍</span> {post.location}
                          </p>
                          <p className="mb-6 line-clamp-3 font-opensans text-[14px] leading-relaxed text-white/70">
                            {post.excerpt}
                          </p>
                          <Link href={`/news-and-social-media/${post.slug}`}
                            className="inline-block border-b border-white/20 pb-1 font-poppins text-xs font-bold uppercase tracking-widest text-white transition-all hover:border-white">
                            Read More
                          </Link>
                        </div>
                      </article>
                    ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-10 lg:col-span-4">
              <div className="rounded-2xl border border-white/5 bg-[#1c1c1c]/80 p-8 shadow-xl backdrop-blur-md">
                <h2 className={sidebarTitle}>Recent Posts</h2>
                <ul className="space-y-4">
                  {recentLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}
                        className="block border-b border-white/5 pb-2 font-opensans text-sm leading-snug text-white/60 transition-colors hover:text-white">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#1c1c1c]/80 p-8 shadow-xl backdrop-blur-md">
                <h2 className={sidebarTitle}>Archives</h2>
                <ul className="space-y-4">
                  {ARCHIVES.map((date) => (
                    <li key={date}>
                      <Link href="/news-and-social-media"
                        className="block border-b border-white/5 pb-2 font-opensans text-sm text-white/60 transition-colors hover:text-white">
                        {date}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#1c1c1c]/80 p-8 shadow-xl backdrop-blur-md">
                <h2 className={sidebarTitle}>Categories</h2>
                <ul className="space-y-4">
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <Link href="/news-and-social-media"
                        className="block border-b border-white/5 pb-2 font-opensans text-sm text-white/60 transition-colors hover:text-white">
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </InternalPageShell>
  );
}
