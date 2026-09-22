import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light";
}

export function Logo({ className, showTagline = true, size = "md", theme = "dark" }: LogoProps) {
  const crestSize = size === "sm" ? 42 : size === "lg" ? 64 : 50;

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3.5 group focus:outline-none transition-transform duration-200 hover:scale-[1.02]",
        className
      )}
      aria-label="Digital CXOS - Leadership Beyond Boundaries"
    >
      {/* Authentic High-Resolution Sovereign Logo Medallion */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/assets/logo-256.png"
          alt="Digital CXOS Official Logo Medallion"
          width={crestSize}
          height={crestSize}
          priority
          className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] select-none pointer-events-none"
        />
      </div>

      {/* Brand Name & Tagline with India theme indicator */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-lg sm:text-xl font-bold tracking-wider font-serif transition-colors",
              theme === "light" ? "text-neutral-900 group-hover:text-[#C9A227]" : "text-white group-hover:text-[#D4AF37]"
            )}
          >
            DIGITAL CXOS
          </span>
          {/* Subtle Sovereign Indian Tricolour Dots */}
          <span className="tricolour-dots" title="India Enterprise Leadership Community">
            <span />
            <span />
            <span />
          </span>
        </div>
        {showTagline && (
          <span
            className={cn(
              "text-[9px] uppercase tracking-[0.22em] font-medium whitespace-nowrap",
              theme === "light" ? "text-neutral-600" : "text-neutral-300"
            )}
          >
            Leadership Beyond Boundaries
          </span>
        )}
      </div>
    </Link>
  );
}

