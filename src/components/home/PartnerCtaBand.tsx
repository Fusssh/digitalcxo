import React from "react";
import Link from "next/link";

export function PartnerCtaBand() {
  return (
    <section className="relative py-24 md:py-32 bg-[#141414] text-white overflow-hidden border-t border-neutral-800">
      {/* Decorative Oversized Gold Chevrons Bleeding Off Top-Left and Bottom-Right Corners (Exec Club yellow-arrow pattern) */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 opacity-20 transform -rotate-12 select-none"
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-[#C9A227]" strokeWidth="24">
          <path d="M40 30 L100 90 L40 150" strokeLinecap="square" strokeLinejoin="miter" />
          <path d="M100 30 L160 90 L100 150" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      </div>

      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 opacity-20 transform rotate-12 select-none"
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-[#C9A227]" strokeWidth="24">
          <path d="M160 170 L100 110 L160 50" strokeLinecap="square" strokeLinejoin="miter" />
          <path d="M100 170 L40 110 L100 50" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
          Strategic Enterprise Collaboration
        </span>

        {/* Large Serif Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.18]">
          Partner With Digital CXOS
        </h2>

        {/* One-Line Subhead */}
        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Collaborate with India&apos;s most visionary enterprise decision-makers, boardroom influencers, and digital trailblazers.
        </p>

        {/* Single Solid-Gold CTA Button (Exec Club Pattern 10) */}
        <div className="pt-4">
          <Link
            href="/partnership2"
            className="inline-flex items-center gap-2 px-8 py-4 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 transition-all duration-200 shadow-xl hover:scale-105"
          >
            <span>Explore Partnership Opportunities</span>
            <span className="font-bold text-base">›</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
