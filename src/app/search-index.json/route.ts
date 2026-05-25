import { buildSearchIndex } from "@/lib/search/buildIndex";

/**
 * Static search index endpoint.
 *
 * Generated at build time by Next.js (force-static) so it's served as
 * a plain JSON file from Cloudflare's edge — no function invocation,
 * no cold start, sub-50ms response everywhere.
 *
 * The client-side <SearchDialog> downloads this once on first focus
 * and caches it in memory for the rest of the session.
 */
export const dynamic = "force-static";

export async function GET() {
  const entries = await buildSearchIndex();

  return new Response(JSON.stringify(entries), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Index gets regenerated on every build (Sanity webhook → GH Actions
      // → new build). Cache aggressively at the edge until then.
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
