import { HomePage } from "@/sections/home/HomePage";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Engage Youth Foundation",
  url: "https://engage-youth.org",
  logo: "https://engage-youth.org/wp-content/uploads/2024/03/eyf-logo-2.png",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePage />
    </>
  );
}
