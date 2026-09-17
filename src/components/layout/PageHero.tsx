import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
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
        "relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-gradient-to-b from-[#0A132C] via-[#070D1F] to-[#060B18] border-b border-white/5",
        className
      )}
    >
      {/* Client Corporate Backdrop */}
      {showBackdrop && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <Image
            src="/assets/Backdrop JPG.jpeg"
            alt="Digital CXOS"
            fill
            className="object-cover object-center opacity-15 mix-blend-luminosity brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-[#0A132C]/90" />
        </div>
      )}

      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-900/20 via-indigo-900/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 executive-grid opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        {/* Breadcrumb */}
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-amber-300 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-amber-400/90 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-serif heading-gold max-w-4xl">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Subtle Tricolour Accent Line */}
        <div className="mt-6 w-24 h-1 rounded-full flex overflow-hidden">
          <div className="w-1/3 bg-[#FF9933]" />
          <div className="w-1/3 bg-white/90" />
          <div className="w-1/3 bg-[#138808]" />
        </div>
      </div>
    </div>
  );
}
