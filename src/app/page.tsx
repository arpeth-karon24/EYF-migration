import { HomePage } from "@/sections/home/HomePage";

/**
 * Root page — Schema.org Organization + WebSite are injected globally
 * via the root layout, so no per-page JSON-LD is required here.
 * Any future home-only schemas (e.g., featured Event lists) can be added
 * via <JsonLd /> alongside <HomePage />.
 */
export default function Page() {
  return <HomePage />;
}
