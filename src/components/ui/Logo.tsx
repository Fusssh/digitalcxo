import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "nav";
  theme?: "dark" | "light";
}

export function Logo({ className, size = "md" }: LogoProps) {
  if (size === "nav") {
    return (
      <Link
        href="/"
        className={cn(
          "relative z-30 flex items-center group focus:outline-none transition-transform duration-300 hover:scale-[1.03]",
          className
        )}
        aria-label="Digital CXOS Official Logo"
      >
        {/* Authentic High-Resolution Sovereign Logo Medallion with prominent executive dimensions */}
        <div className="relative shrink-0 flex items-center justify-center w-[92px] h-[92px] sm:w-[106px] sm:h-[106px] lg:w-[122px] lg:h-[122px] xl:w-[140px] xl:h-[140px]">
          <Image
            src="/assets/logo-256.png"
            alt="Digital CXOS Official Logo Medallion"
            width={150}
            height={150}
            priority
            className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] select-none pointer-events-none"
          />
        </div>
      </Link>
    );
  }

  const crestSize = size === "sm" ? 52 : size === "lg" ? 120 : 90;

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3.5 sm:gap-4 group focus:outline-none transition-transform duration-200",
        className
      )}
      aria-label="Digital CXOS"
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
    </Link>
  );
}
