"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log("Subscribing email:", email);
    setEmail("");
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
          <form 
            onSubmit={handleSubmit}
            className="flex w-full md:w-auto max-w-md gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Sign up to newsletter"
              required
              className="flex-1 rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-eyf-gold focus:bg-white/10"
            />
            <button
              type="submit"
              className="rounded bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-eyf-gold hover:text-white"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
