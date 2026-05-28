'use client';

import Link from "next/link";
import { cn } from "@/lib/cn";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundOverlay?: boolean;
  ctaText?: string;
  ctaLink?: string;
  ctaExternal?: boolean;
  onCtaClick?: () => void;
  variant?: "home" | "internal";
  className?: string;
}

export default function HeroSection(props: HeroSectionProps) {
  const {
    title,
    subtitle,
    description,
    backgroundImage,
    backgroundOverlay = true,
    ctaText,
    ctaLink,
    onCtaClick,
    variant = "internal",
    className = "",
  } = props;
  const useExternalCta = props.ctaExternal === true;
  const ctaButtonClass =
    "rounded-full bg-white px-8 py-3 font-montserrat text-sm font-bold uppercase tracking-wider text-black transition-colors duration-300 hover:bg-gray-100";
  const isInternal = variant === "internal";

  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `${
          backgroundOverlay ? "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))," : ""
        }url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : !isInternal
      ? {
          background: "linear-gradient(135deg, #1a3a52 0%, #0f2438 100%)",
        }
      : {
          background: "var(--theme-bg-surface-2)",
        };

  return (
    <section
      className={cn(
        "flex w-full items-center justify-center",
        isInternal
          ? "min-h-[180px] py-12 md:min-h-[250px] md:py-16"
          : "min-h-[400px] py-20 md:min-h-[500px] md:py-32",
        className,
      )}
      style={backgroundStyle}
    >
      <div className="container mx-auto max-w-container px-4 text-center">
        {subtitle && (
          <p className="mb-3 font-poppins text-xs font-semibold uppercase tracking-[0.15em] text-eyf-gold md:text-sm">
            {subtitle}
          </p>
        )}

        <h1 className="mb-4 font-poppins text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mx-auto mb-6 max-w-2xl font-opensans text-lg leading-relaxed text-gray-300 md:text-xl">
            {description}
          </p>
        )}

        {ctaText && (ctaLink || onCtaClick) && (
          <div className="mt-6 flex justify-center">
            {onCtaClick ? (
              <button type="button" onClick={onCtaClick} className={ctaButtonClass}>
                {ctaText}
              </button>
            ) : useExternalCta ? (
              <a href={ctaLink} target="_blank" rel="noopener noreferrer" className={ctaButtonClass}>
                {ctaText}
              </a>
            ) : (
              <Link href={ctaLink!} className={ctaButtonClass}>
                {ctaText}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
