import { HomePage } from "@/sections/home/HomePage";

// Schema.org structured data — search engines & social embeds need ABSOLUTE
// URLs here. We derive from NEXT_PUBLIC_SITE_URL so dev/prod swap cleanly.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://engage-youth.org";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Engage Youth Foundation",
  url: SITE_URL,
  logo: `${SITE_URL.replace(/\/$/, "")}/images/logo/eyf-logo.png`,
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePage />
    </>
  );
}
