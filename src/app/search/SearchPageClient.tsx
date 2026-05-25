"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import type { SearchEntry } from "@/lib/search/buildIndex";

/**
 * Client-rendered search experience for the /search page.
 *
 * Reads the `q` query parameter so URLs like /search?q=donation can be
 * shared and bookmarked. Updates the URL as the user types (without
 * full navigation) so back-button works intuitively.
 */

const TYPE_CHIP: Record<SearchEntry["type"], string> = {
  Page: "bg-white/10 text-white/80",
  Event: "bg-eyf-gold/20 text-eyf-gold",
  News: "bg-blue-500/20 text-blue-300",
  FAQ: "bg-purple-500/20 text-purple-300",
  Team: "bg-emerald-500/20 text-emerald-300",
};

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts: React.ReactNode[] = [];
  let i = 0;
  while (i < text.length) {
    const idx = lower.indexOf(q, i);
    if (idx === -1) {
      parts.push(text.slice(i));
      break;
    }
    if (idx > i) parts.push(text.slice(i, idx));
    parts.push(
      <mark
        key={idx}
        className="rounded bg-eyf-gold/30 px-0.5 text-white"
      >
        {text.slice(idx, idx + q.length)}
      </mark>,
    );
    i = idx + q.length;
  }
  return <>{parts}</>;
}

export function SearchPageClient() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQuery = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load index once
  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((r) => r.json() as Promise<SearchEntry[]>)
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setIndex([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Reflect query in URL (debounced; replace, not push, so back doesn't
  // get cluttered with every keystroke)
  useEffect(() => {
    const t = setTimeout(() => {
      const next = query.trim()
        ? `/search/?q=${encodeURIComponent(query.trim())}`
        : "/search/";
      router.replace(next, { scroll: false });
    }, 200);
    return () => clearTimeout(t);
  }, [query, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter((entry) => {
      const haystack =
        `${entry.title} ${entry.description} ${entry.type}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, index]);

  // Group results by type for readability
  const grouped = useMemo(() => {
    const groups: Record<string, SearchEntry[]> = {};
    for (const r of results) {
      groups[r.type] = groups[r.type] || [];
      groups[r.type].push(r);
    }
    return groups;
  }, [results]);

  return (
    <div>
      {/* Search input */}
      <div className="mb-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-xl">
        <SearchIcon className="h-5 w-5 shrink-0 text-white/40" aria-hidden />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, news, FAQs, pages…"
          className="flex-1 bg-transparent font-opensans text-base text-white placeholder:text-white/40 focus:outline-none"
          aria-label="Search query"
        />
      </div>

      {/* Empty state — no query yet */}
      {!query.trim() && (
        <div className="rounded-3xl border border-white/5 bg-[#1c1c1c]/40 px-8 py-12 text-center backdrop-blur-md">
          <p className="font-opensans text-white/60">
            Start typing to search across events, news, programs, and FAQs.
          </p>
          <p className="mt-2 font-opensans text-sm text-white/40">
            Tip — press{" "}
            <kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[11px]">
              Ctrl
            </kbd>{" "}
            <kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[11px]">
              K
            </kbd>{" "}
            from anywhere on the site to open quick search.
          </p>
        </div>
      )}

      {/* Loading state */}
      {query.trim() && loading && (
        <p className="font-opensans text-sm text-white/50">Loading index…</p>
      )}

      {/* No matches */}
      {query.trim() && !loading && results.length === 0 && (
        <div className="rounded-3xl border border-white/5 bg-[#1c1c1c]/40 px-8 py-12 text-center backdrop-blur-md">
          <p className="font-poppins text-lg font-bold uppercase tracking-widest text-white">
            No results
          </p>
          <p className="mt-3 font-opensans text-sm text-white/60">
            We couldn&apos;t find anything matching{" "}
            <strong className="text-white">&ldquo;{query}&rdquo;</strong>.
            Try a different keyword or browse the navigation menu.
          </p>
        </div>
      )}

      {/* Results — grouped by type */}
      {query.trim() && !loading && results.length > 0 && (
        <div className="space-y-10">
          <p className="font-opensans text-sm text-white/60">
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <strong className="text-white">&ldquo;{query}&rdquo;</strong>
          </p>

          {Object.entries(grouped).map(([type, entries]) => (
            <section key={type}>
              <h2 className="mb-4 font-poppins text-xs font-bold uppercase tracking-[0.2em] text-eyf-gold">
                {type} <span className="text-white/30">({entries.length})</span>
              </h2>
              <ul className="space-y-3">
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={entry.path}
                      className="group block rounded-xl border border-white/5 bg-[#1c1c1c]/60 px-5 py-4 transition hover:border-white/15 hover:bg-[#1c1c1c]/80"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-montserrat text-base font-semibold text-white transition-colors group-hover:text-eyf-gold">
                          <Highlight text={entry.title} query={query} />
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 font-poppins text-[9px] font-bold uppercase tracking-widest ${TYPE_CHIP[entry.type]}`}
                        >
                          {entry.type}
                        </span>
                      </div>
                      <p className="font-opensans text-sm leading-relaxed text-white/55">
                        <Highlight text={entry.description} query={query} />
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
