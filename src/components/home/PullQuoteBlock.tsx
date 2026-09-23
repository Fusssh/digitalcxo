import React from "react";

export function PullQuoteBlock() {
  return (
    <section className="py-14 md:py-20 bg-[#141414] text-white border-t border-neutral-800 relative z-10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center space-y-7 relative z-10">
        {/* Subtle Sovereign Protocol Header */}
        <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C9A227]">
          <span className="w-10 sm:w-16 h-[1.5px] bg-[#C9A227]/60" />
          <span>Chatham House Rule Exchange</span>
          <span className="w-10 sm:w-16 h-[1.5px] bg-[#C9A227]/60" />
        </div>

        {/* Large Gold Quotation Mark */}
        <div className="flex justify-center -mb-3">
          <span className="text-[#C9A227] text-7xl md:text-8xl font-serif leading-none select-none opacity-80">
            “
          </span>
        </div>

        {/* Bold Serif White Quote with Significantly Increased Font Size */}
        <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-serif leading-[1.28] text-white tracking-wide max-w-5xl mx-auto">
          &ldquo;Digital CXOS isn&apos;t just a membership; it&apos;s a powerful network of diverse executives driving change. The connections I&apos;ve made here have been invaluable. This is where the leaders of today and tomorrow come together to shape India&apos;s digital future.&rdquo;
        </blockquote>

        {/* Attribution Byline with Increased Typography */}
        <div className="space-y-1.5 pt-3">
          <p className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Enterprise Member Executive
          </p>
          <p className="text-sm sm:text-base text-neutral-300 font-medium">
            Chief Information Officer &amp; CISO, Fortune India 500 Enterprise
          </p>
          <div className="flex items-center justify-center gap-2 pt-1 text-xs text-[#C9A227] uppercase tracking-widest font-semibold">
            <span>Verified Boardroom Peer</span>
            <span>•</span>
            <span>100% Non-Commercial</span>
          </div>
        </div>
      </div>
    </section>
  );
}
