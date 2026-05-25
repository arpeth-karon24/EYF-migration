"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { SearchDialog } from "./SearchDialog";

/**
 * Search trigger button — opens the SearchDialog.
 *
 * Sits in the site header. Also installs a global keyboard listener for
 * Ctrl+K / Cmd+K so power users can search from anywhere on the page
 * without aiming at the button.
 *
 * The shortcut is the de facto standard for command palettes / search
 * (GitHub, Linear, Notion, Vercel, Slack, etc.) so most users already
 * know it instinctively.
 */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  // Detect platform once on mount so we can show ⌘ on Mac, Ctrl elsewhere
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    }
  }, []);

  // Global Ctrl/Cmd+K listener
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open site search"
        aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
        className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/60 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
      >
        <Search className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden font-opensans sm:inline">Search…</span>
        <kbd className="hidden rounded border border-white/20 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/40 group-hover:text-white/60 navlg:inline-block">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      </button>

      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
