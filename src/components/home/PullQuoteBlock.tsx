import React from "react";

export function PullQuoteBlock() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#141414] text-white border-t border-neutral-800 relative z-10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center relative z-10 flex flex-col items-center">
        {/* Top gold accent line */}
        <span className="w-12 sm:w-20 md:w-24 h-[1.5px] bg-[#C9A227]/60" />

        {/* Large Gold Quotation Mark */}
        <span className="text-[#C9A227] text-5xl sm:text-7xl md:text-8xl font-serif leading-none opacity-80 mt-4 sm:mt-6 mb-1 sm:mb-2">
          “
        </span>

        {/* Quote */}
        <blockquote className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-serif leading-[1.35] sm:leading-[1.28] text-white tracking-wide max-w-5xl mx-auto">
          Digital CXOS isn&apos;t just a membership; it&apos;s a powerful network
          of diverse executives driving change. The connections I&apos;ve made
          here have been invaluable. This is where the leaders of today and
          tomorrow come together to shape India&apos;s digital future.
        </blockquote>

        {/* Bottom gold accent line */}
        <span className="w-12 sm:w-20 md:w-24 h-[1.5px] bg-[#C9A227]/60 mt-8 sm:mt-10" />
      </div>
    </section>
  );
}