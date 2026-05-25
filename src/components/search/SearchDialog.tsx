"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search as SearchIcon, X } from "lucide-react";
import type { SearchEntry } from "@/lib/search/buildIndex";

/**
 * Site-wide search dialog.
 *
 * UX patterns deliberately mirror modern app search (GitHub, Linear,
 * Notion, Vercel) so keyboard-driven users feel at home immediately.
 *
 * - Open with Ctrl/Cmd+K or the header search button
 * - Type to filter — matches title + description + type tag
 * - ↑/↓ to navigate, Enter to open, Esc to close
 * - Results grouped by type with coloured chips
 *
 * Index is downloaded once from /search-index.json on first open and
 * cached in module scope for the rest of the session.
 */

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

// In-memory cache — survives across openings within the same session
let cachedIndex: SearchEntry[] | null = null;
let cachedIndexPromise: Promise<SearchEntry[]> | null = null;

async function loadIndex(): Promise<SearchEntry[]> {
  if (cachedIndex) return cachedIndex;
  if (cachedIndexPromise) return cachedIndexPromise;
  cachedIndexPromise = fetch("/search-index.json")
    .then((r) => r.json() as Promise<SearchEntry[]>)
    .then((data) => {
      cachedIndex = data;
      return data;
    })
    .catch(() => []);
  return cachedIndexPromise;
}

/** Visual chip colors per content type — kept minimal and consistent. */
const TYPE_CHIP: Record<SearchEntry["type"], string> = {
  Page: "bg-white/10 text-white/80",
  Event: "bg-eyf-gold/20 text-eyf-gold",
  News: "bg-blue-500/20 text-blue-300",
  FAQ: "bg-purple-500/20 text-purple-300",
  Team: "bg-emerald-500/20 text-emerald-300",
};

/** Highlight `query` substrings inside `text` for skimmability. */
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
        className="bg-eyf-gold/30 text-white rounded px-0.5"
      >
        {text.slice(idx, idx + q.length)}
      </mark>,
    );
    i = idx + q.length;
  }
  return <>{parts}</>;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  // Load index once when first opened
  useEffect(() => {
    if (!open) return;
    if (cachedIndex) {
      setIndex(cachedIndex);
      return;
    }
    setLoading(true);
    loadIndex()
      .then(setIndex)
      .finally(() => setLoading(false));
  }, [open]);

  // Focus input on open, lock body scroll
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset active row whenever results change
  useEffect(() => setActiveIndex(0), [query]);

  // Run the filter — substring match on title + description + type
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index;
    return index.filter((entry) => {
      const haystack =
        `${entry.title} ${entry.description} ${entry.type}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, index]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        const target = results[activeIndex];
        window.location.href = target.path;
        onClose();
      }
    },
    [results, activeIndex, onClose],
  );

  // Scroll active row into view as user navigates
  useEffect(() => {
    if (!resultsRef.current) return;
    const node = resultsRef.current.children[activeIndex] as
      | HTMLElement
      | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center px-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-2xl">
        <h2 id="search-dialog-title" className="sr-only">
          Search Engage Youth Foundation
        </h2>

        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <SearchIcon className="h-5 w-5 shrink-0 text-white/40" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, news, pages, FAQs…"
            className="flex-1 bg-transparent font-opensans text-base text-white placeholder:text-white/40 focus:outline-none"
            aria-label="Search query"
            aria-controls="search-results"
          />
          <kbd className="hidden rounded border border-white/20 bg-white/5 px-2 py-0.5 font-poppins text-[10px] uppercase tracking-widest text-white/50 sm:inline-block">
            Esc
          </kbd>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-white/40 transition hover:bg-white/10 hover:text-white sm:hidden"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results / empty / loading */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <p className="px-5 py-6 font-opensans text-sm text-white/50">
              Loading index…
            </p>
          )}

          {!loading && results.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="font-opensans text-sm text-white/60">
                No results found
                {query.trim() ? (
                  <>
                    {" "}
                    for <strong className="text-white">&ldquo;{query}&rdquo;</strong>
                  </>
                ) : null}
                .
              </p>
              <p className="mt-2 font-opensans text-xs text-white/40">
                Try a different keyword, or browse the navigation menu.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul
              ref={resultsRef}
              id="search-results"
              role="listbox"
              className="py-2"
            >
              {results.map((entry, i) => (
                <li
                  key={entry.id}
                  role="option"
                  aria-selected={i === activeIndex}
                >
                  <Link
                    href={entry.path}
                    onClick={onClose}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex items-center gap-3 px-5 py-3 transition ${
                      i === activeIndex
                        ? "bg-white/5"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-montserrat text-sm font-semibold text-white">
                          <Highlight text={entry.title} query={query} />
                        </span>
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 font-poppins text-[9px] font-bold uppercase tracking-widest ${TYPE_CHIP[entry.type]}`}
                        >
                          {entry.type}
                        </span>
                      </div>
                      <p className="mt-1 truncate font-opensans text-xs text-white/55">
                        <Highlight text={entry.description} query={query} />
                      </p>
                    </div>
                    <span
                      className="font-poppins text-[10px] uppercase tracking-widest text-white/30"
                      aria-hidden
                    >
                      ↵
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint row */}
        <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-5 py-3 font-opensans text-[11px] text-white/40">
          <span>
            <kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px]">
              ↑
            </kbd>{" "}
            <kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px]">
              ↓
            </kbd>{" "}
            navigate
          </span>
          <span>
            <kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px]">
              ↵
            </kbd>{" "}
            open
          </span>
          <span>
            <kbd className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>{" "}
            close
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
