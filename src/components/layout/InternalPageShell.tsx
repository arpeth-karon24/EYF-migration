import Image from "next/image";
import { cn } from "@/lib/cn";
import { DEFAULT_INTERNAL_PAGE_BG } from "@/constants/internalPage";

type InternalPageShellProps = {
  children: React.ReactNode;
  backgroundImage?: string;
  backgroundImageClassName?: string;
  className?: string;
};

export function InternalPageShell({
  children,
  backgroundImage = DEFAULT_INTERNAL_PAGE_BG,
  backgroundImageClassName = "opacity-10 grayscale",
  className = "",
}: InternalPageShellProps) {
  return (
    <div className={cn("relative min-h-screen bg-[#111]", className)}>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <Image
          src={backgroundImage}
          alt=""
          fill
          className={cn("object-cover", backgroundImageClassName)}
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-transparent to-[#111]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
