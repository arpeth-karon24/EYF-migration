"use client";

import { useState, useRef } from "react";
import { Mail } from "lucide-react";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { useTurnstile } from "@/hooks/useTurnstile";

export function NewsletterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { token: turnstileToken, reset: resetTurnstile } = useTurnstile(containerRef, 'dark');
  const [email, setEmail] = useState("");
  const { isLoading, message, submit, clearMessage } = useFormSubmission({ endpoint: "/api/newsletter" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessage();
    if (!email) return;
    const success = await submit({ email }, turnstileToken);
    if (success) {
      setEmail("");
      resetTurnstile();
    }
  };

  return (
    <div className="bg-[#1f2024] py-8 border-b border-white/5">
      <div className="mx-auto max-w-container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-white font-poppins font-bold text-xl md:text-2xl mb-2">
              Subscribe to our newsletter
            </h3>
            <p className="text-gray-400 font-opensans text-sm">
              Stay updated with our latest news, events, and initiatives.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full md:w-auto max-w-md">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-eyf-gold focus:bg-white/10 disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-eyf-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "..." : "Subscribe"}
                </button>
              </div>

              {/* Turnstile */}
              <div ref={containerRef} className="flex justify-center" />

              {message && (
                <div className={`rounded-lg p-2 text-xs border ${
                  message.type === "success"
                    ? "bg-emerald-950/40 text-emerald-100 border-emerald-500/30"
                    : "bg-red-950/40 text-red-100 border-red-500/30"
                }`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
