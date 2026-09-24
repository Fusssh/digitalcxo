import React from "react";
import Image from "next/image";
import { Compass, Eye, ShieldCheck } from "lucide-react";

export function OngoingPlatformSection() {
  return (
    <section className="relative z-20 py-12 md:py-16 bg-[#181818] text-white border-t border-neutral-800 overflow-visible select-none">
      {/* Botanical Leaf Branch overlapping across dark-to-cream boundary (3D drop shadow, 0 rectangle artifacts) */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-28 sm:-bottom-36 md:-bottom-55 right-0 sm:right-2 md:right-6 w-28 sm:w-36 md:w-44 z-30 drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
      >
        <Image
          src="/assets/branch-green.png"
          alt="Overlapping botanical leaf branch"
          width={220}
          height={400}
          className="w-full h-auto object-contain transform rotate-6"
        />
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10 space-y-10">
        {/* Centered Header with Standardized Consistent Typography */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C9A227]">
            <span className="w-8 h-[1.5px] bg-[#C9A227]" />
            <span>Mission, Vision &amp; Core Values</span>
            <span className="w-8 h-[1.5px] bg-[#C9A227]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.2]">
            An Ongoing Leadership Platform — Not Just Access to Events
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-3xl mx-auto font-normal">
            A sovereign commitment to national resilience, ethical stewardship, and peer-driven transformation shaping enterprise technology.
          </p>
        </div>

        {/* 3-Column Executive Card Grid filling left & right width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Our Mission */}
          <div className="group relative bg-[#1E1E1E] rounded-sm p-8 sm:p-9 border border-neutral-800 hover:border-[#C9A227]/70 shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#282828] border border-[#C9A227]/50 flex items-center justify-center text-[#C9A227] shadow-inner group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7 stroke-[1.75]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
                Acceleration &amp; Impact
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Our Mission
              </h3>
              <p className="text-base sm:text-[17px] text-neutral-200 leading-relaxed pt-1">
                &ldquo;To empower the global IT and C-suite leadership community to accelerate digital transformation, strengthen cybersecurity and enhance technological impact building resilient enterprises that contribute to India&apos;s digital future.&rdquo;
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span>National Impact</span>
              <span className="text-[#C9A227] font-bold">Resilient Tech</span>
            </div>
          </div>

          {/* Card 2: Our Vision */}
          <div className="group relative bg-[#1E1E1E] rounded-sm p-8 sm:p-9 border border-neutral-800 hover:border-[#C9A227]/70 shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#282828] border border-[#C9A227]/50 flex items-center justify-center text-[#C9A227] shadow-inner group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7 stroke-[1.75]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
                Strategic Horizon
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Our Vision
              </h3>
              <p className="text-base sm:text-[17px] text-neutral-200 leading-relaxed pt-1">
                &ldquo;To empower visionary technology leaders with a dynamic platform that accelerates digital transformation, nurtures secure innovation and improves enterprise technology driving sustainable growth, resilience and strategic clarity across industries.&rdquo;
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span>Strategic Clarity</span>
              <span className="text-[#C9A227] font-bold">Secure Growth</span>
            </div>
          </div>

          {/* Card 3: Core Values */}
          <div className="z-100 group relative bg-[#1E1E1E] rounded-sm p-8 sm:p-9 border border-neutral-800 hover:border-[#C9A227]/70 shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#282828] border border-[#C9A227]/50 flex items-center justify-center text-[#C9A227] shadow-inner group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 stroke-[1.75]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
                Ethical Standard
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Core Values
              </h3>
              <p className="text-base sm:text-[17px] text-neutral-200 leading-relaxed pt-1">
                &ldquo;We are guided by trust, confidentiality, strategic relevance, ethical leadership and a shared commitment to shaping secure, responsible and forward-looking digital enterprises for the country&apos;s progress.&rdquo;
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span>Chatham House Code</span>
              <span className="text-[#C9A227] font-bold relative z-40">Ethical Trust</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
