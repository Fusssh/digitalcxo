import React from "react";

export function PullQuoteBlock() {
  return (
    <section className="py-20 md:py-28 bg-[#181818] text-white border-t border-neutral-800 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        {/* Large Gold Quotation Mark (Exec Club Screenshot 3) */}
        <div className="flex justify-center">
          <span className="text-[#C9A227] text-6xl md:text-7xl font-serif leading-none select-none">
            “
          </span>
        </div>

        {/* Centered Bold Serif White Quote (Marked TODO for client quote) */}
        {/* // TODO: client to supply a real member quote + name + title */}
        <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif leading-relaxed text-white tracking-wide">
          &ldquo;Digital CXOS isn&apos;t just a membership; it&apos;s a powerful network of diverse executives driving change. The connections I&apos;ve made here have been invaluable. This is where the leaders of today and tomorrow come together to shape India&apos;s digital future.&rdquo;
        </blockquote>

        {/* Attribution Byline in Clean Sans-Serif */}
        <div className="space-y-1 pt-2">
          <p className="text-base font-bold text-white tracking-wide">
            {/* // TODO: Client to supply real member name */}
            Member Executive
          </p>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">
            {/* // TODO: Client to supply real title & organization */}
            Chief Information Officer &amp; CISO, Enterprise Member
          </p>
        </div>
      </div>
    </section>
  );
}
