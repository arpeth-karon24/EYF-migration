'use client';

import { cn } from "@/lib/cn";

interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  backgroundColor?: "dark" | "darker" | "light";
  centered?: boolean;
}

export default function ContentSection({
  title,
  children,
  className = "",
  backgroundColor = "dark",
  centered = true,
}: ContentSectionProps) {
  const bgClass =
    backgroundColor === "darker"
      ? "bg-[var(--theme-bg-surface)]"
      : backgroundColor === "light"
        ? "bg-[var(--theme-bg-surface)]"
        : "bg-[var(--theme-bg-page)]";

  const headingColor = "text-[var(--theme-text)]";
  const textColor    = "text-[var(--theme-text-2)]";
  const textAlign = centered ? "text-center" : "";

  return (
    <section className={cn(bgClass, "py-12 md:py-20", className)}>
      <div className={cn("container mx-auto max-w-container px-4", textAlign)}>
        {title && (
          <h2
            className={cn(
              "mb-8 font-poppins text-2xl font-bold md:mb-12 md:text-3xl",
              headingColor,
            )}
          >
            {title}
          </h2>
        )}
        <div className={cn(textColor, "font-opensans leading-relaxed")}>{children}</div>
      </div>
    </section>
  );
}
