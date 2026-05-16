"use client";

/**
 * Cloudflare Turnstile widget placeholder.
 * When `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set, replace this with `@marsidev/react-turnstile` or similar.
 */
export function TurnstileSlot() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;
  return (
    <div className="rounded border border-dashed border-white/30 p-4 text-center text-xs text-white/70">
      Turnstile site key is configured; mount the widget here before accepting public submissions.
    </div>
  );
}
