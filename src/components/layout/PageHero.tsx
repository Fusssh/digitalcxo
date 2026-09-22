import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  showBackdrop?: boolean;
}

export function PageHero({
  title,
  subtitle,
  breadcrumbs,
  className,
  showBackdrop = true,
}: PageHeroProps) {
  return (
    <div
      className={cn(
        "relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-[#181818] border-b border-neutral-800 text-white",
        className
      )}
    >
      {/* Background Graphic Scrim */}
      {showBackdrop && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <Image
            src="/assets/Backdrop JPG.jpeg"
            alt="Digital CXOS"
            fill
            className="object-cover object-center opacity-10 mix-blend-luminosity grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-[#141414]/90" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        {/* Breadcrumb with Gold Chevrons */}
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center sm:justify-start gap-2 text-xs text-neutral-400">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[#C9A227] font-bold">›</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[#C9A227] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title in Serif Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white max-w-4xl tracking-tight leading-[1.2]">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Subtle Indian Tricolour Accent Line */}
        <div className="mt-6 w-24 h-1 rounded-full flex overflow-hidden">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#138808]" />
        </div>
      </div>
    </div>
  );
}
