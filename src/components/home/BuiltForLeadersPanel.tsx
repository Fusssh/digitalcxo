import React from "react";
import Image from "next/image";

export function BuiltForLeadersPanel() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-[#181818] border-t border-neutral-800/80 select-none">
      {/* Full-width dark / duotone photo backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1577495508048-b635879837f1?q=85&w=2000&auto=format&fit=crop"
          alt="Executive technology leaders in collaboration"
          fill
          sizes="100vw"
          className="object-cover object-center grayscale contrast-125 brightness-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#181818]/90 via-[#181818]/50 to-[#181818]/95 z-10" />
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-20 space-y-8 sm:space-y-10">
        {/* Serif White Headline Sitting Directly Over Photo */}
        <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C9A227]">
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#C9A227]" />
            <span>Executive Vetting &amp; Sectors</span>
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#C9A227]" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-[1.2]">
            Built for Leaders Who Shape Decisions — and the People Behind Them
          </h2>
        </div>

        {/* Two Offset Cream Cards Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          {/* Left Cream Card: Selective Membership & Sectors */}
          <div className="bg-[#FDFBF7] text-[#1A1A1A] p-6 sm:p-8 md:p-10 rounded-sm shadow-2xl border border-[#EAE4D6] flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A]">
                Intentionally Selective Community
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-[#333333] leading-relaxed">
                Membership in Digital CXOS is intentionally selective. We bring together senior leaders who influence outcomes, shape organizations, and engage thoughtfully with peers across critical sectors and disciplines.
              </p>
              <p className="text-xs sm:text-sm md:text-base text-[#333333] leading-relaxed">
                Our members spearhead high-impact transformations across Financial Services, ITES, HealthTech, Aerospace, Defense, Enterprise Consulting, and manufacturing infrastructure driving India&apos;s digital epoch.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EAE4D6] flex items-center justify-between text-xs font-semibold text-[#666666]">
              <span>Trusted Boardroom Exchange</span>
              <span className="text-[#C9A227] font-bold">100% Peer Vetted</span>
            </div>
          </div>

          {/* Right Cream Card: "Our Members Typically Are:" */}
          <div className="bg-[#FDFBF7] text-[#1A1A1A] p-6 sm:p-8 md:p-10 rounded-sm shadow-2xl border border-[#EAE4D6] space-y-4 sm:space-y-5">
            <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
              Our Members Typically Are:
            </h3>

            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm md:text-base text-[#222222]">
              <li className="flex items-start gap-2.5 sm:gap-3">
                <span className="text-[#C9A227] text-base sm:text-lg font-bold leading-none mt-1">●</span>
                <span>CIOs, CISOs, CTOs, and Chief Digital Officers (CDOs)</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <span className="text-[#C9A227] text-base sm:text-lg font-bold leading-none mt-1">●</span>
                <span>Chief Strategy Officers &amp; Chief Innovation Officers</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <span className="text-[#C9A227] text-base sm:text-lg font-bold leading-none mt-1">●</span>
                <span>Senior Technology Directors &amp; Enterprise Architects</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <span className="text-[#C9A227] text-base sm:text-lg font-bold leading-none mt-1">●</span>
                <span>Leaders safeguarding critical national infrastructure &amp; cyber defense</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <span className="text-[#C9A227] text-base sm:text-lg font-bold leading-none mt-1">●</span>
                <span>Decision-makers directing enterprise AI, data sovereign cloud &amp; ESG</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
