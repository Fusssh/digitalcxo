import React from "react";
import Image from "next/image";
import { Compass, Eye, ShieldCheck } from "lucide-react";

export function OngoingPlatformSection() {
  return (
    <section className="relative z-20 py-12 sm:py-16 md:py-20 lg:py-24 bg-[#181818] text-white border-t border-neutral-800 overflow-visible select-none">
      {/* Botanical Leaf Branch overlapping across dark-to-cream boundary */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-28 sm:-bottom-36 md:-bottom-52 right-0 sm:right-2 md:right-6 w-24 sm:w-36 md:w-44 z-30 drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
      >
        <Image
          src="/assets/branch-green.png"
          alt="Overlapping botanical leaf branch"
          width={220}
          height={400}
          className="w-full h-auto object-contain transform rotate-6"
        />
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10 space-y-8 sm:space-y-10">
        {/* Centered Header with Standardized Consistent Typography */}
        <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C9A227]">
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#C9A227]" />
            <span>Mission, Vision &amp; Core Values</span>
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#C9A227]" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-[1.2]">
            An Ongoing Leadership Platform — Not Just Access to Events
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed max-w-3xl mx-auto font-normal">
            A sovereign commitment to national resilience, ethical stewardship, and peer-driven transformation shaping enterprise technology.
          </p>
        </div>

        {/* 3-Column Executive Card Grid constrained to be smaller */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Our Mission */}
          <div className="group relative bg-[#1E1E1E] rounded-2xl p-6 border border-neutral-800 hover:border-[#C9A227]/70 shadow-lg transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#C9A227] tracking-tight mb-3">
              Our Mission
            </h3>
            <p className="text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-normal">
              &ldquo;To empower the global IT and C-suite leadership community to accelerate digital transformation, strengthen cybersecurity and enhance technological impact building resilient enterprises that contribute to India&apos;s digital future.&rdquo;
            </p>
          </div>

          {/* Card 2: Our Vision */}
          <div className="group relative bg-[#1E1E1E] rounded-2xl p-6 border border-neutral-800 hover:border-[#C9A227]/70 shadow-lg transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#C9A227] tracking-tight mb-3">
              Our Vision
            </h3>
            <p className="text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-normal">
              &ldquo;To empower visionary technology leaders with a dynamic platform that accelerates digital transformation, nurtures secure innovation and improves enterprise technology driving sustainable growth, resilience and strategic clarity across industries.&rdquo;
            </p>
          </div>

          {/* Card 3: Core Values */}
          <div className="z-10 group relative bg-[#1E1E1E] rounded-2xl p-6 border border-neutral-800 hover:border-[#C9A227]/70 shadow-lg transition-all duration-300 hover:-translate-y-1">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#C9A227] tracking-tight mb-3">
              Core Values
            </h3>
            <p className="text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-normal">
              &ldquo;We are guided by trust, confidentiality, strategic relevance, ethical leadership and a shared commitment to shaping secure, responsible and forward-looking digital enterprises for the country&apos;s progress.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
