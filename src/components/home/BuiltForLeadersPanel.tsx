import React from "react";
import Image from "next/image";

export function BuiltForLeadersPanel() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#181818]">
      {/* Full-width dark / duotone photo backdrop (Screenshot 4) */}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-12">
        {/* Serif White Headline Sitting Directly Over Photo */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.2]">
            Built for Leaders Who Shape Decisions — and the People Behind Them
          </h2>
        </div>

        {/* Two Offset Cream Cards Side by Side (Screenshot 4 Pattern) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* Left Cream Card: Selective Membership & Sectors */}
          <div className="bg-[#FDFBF7] text-[#1A1A1A] p-8 sm:p-10 rounded-sm shadow-2xl border border-[#EAE4D6] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-serif text-[#1A1A1A]">
                Intentionally Selective Community
              </h3>
              <p className="text-base text-[#333333] leading-relaxed">
                Membership in Digital CXOS is intentionally selective. We bring together senior leaders who influence outcomes, shape organizations, and engage thoughtfully with peers across critical sectors and disciplines.
              </p>
              <p className="text-base text-[#333333] leading-relaxed">
                Our members spearhead high-impact transformations across Financial Services, ITES, HealthTech, Aerospace, Defense, Enterprise Consulting, and manufacturing infrastructure driving India&apos;s digital epoch.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EAE4D6] flex items-center justify-between text-xs font-semibold text-[#666666]">
              <span>Trusted Boardroom Exchange</span>
              <span className="text-[#C9A227] font-bold">100% Peer Vetted</span>
            </div>
          </div>

          {/* Right Cream Card: "Our Members Typically Are:" */}
          <div className="bg-[#FDFBF7] text-[#1A1A1A] p-8 sm:p-10 rounded-sm shadow-2xl border border-[#EAE4D6] space-y-5">
            <h3 className="text-xl font-bold font-sans text-[#1A1A1A] tracking-tight">
              Our Members Typically Are:
            </h3>

            <ul className="space-y-3 text-sm sm:text-base text-[#222222]">
              <li className="flex items-start gap-3">
                <span className="text-[#C9A227] text-lg font-bold leading-none mt-1">●</span>
                <span>CIOs, CISOs, CTOs, and Chief Digital Officers (CDOs)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C9A227] text-lg font-bold leading-none mt-1">●</span>
                <span>Chief Strategy Officers &amp; Chief Innovation Officers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C9A227] text-lg font-bold leading-none mt-1">●</span>
                <span>Senior Technology Directors &amp; Enterprise Architects</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C9A227] text-lg font-bold leading-none mt-1">●</span>
                <span>Leaders safeguarding critical national infrastructure &amp; cyber defense</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C9A227] text-lg font-bold leading-none mt-1">●</span>
                <span>Decision-makers directing enterprise AI, data sovereign cloud &amp; ESG</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
