import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showTagline = true, size = "md" }: LogoProps) {
  const crestSize = size === "sm" ? 38 : size === "lg" ? 64 : 50;

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 group focus:outline-none transition-transform duration-200 hover:scale-[1.02]",
        className
      )}
      aria-label="Digital CXOS - Leadership Beyond Boundaries"
    >
      {/* Authentic High-Resolution Sovereign Logo Medallion */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/assets/logo-256.png"
          alt="Digital CXOS Official Crest Medallion"
          width={crestSize}
          height={crestSize}
          priority
          className="object-contain drop-shadow-[0_2px_14px_rgba(230,202,101,0.25)] select-none pointer-events-none"
        />
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-bold tracking-wider font-serif bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent">
          DIGITAL CXOS
        </span>
        {showTagline && (
          <span className="text-[9.5px] uppercase tracking-[0.2em] text-slate-300 font-medium whitespace-nowrap">
            Leadership Beyond Boundaries
          </span>
        )}
      </div>
    </Link>
  );
}

