import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, Handshake } from "lucide-react";

export function PartnerCtaBand() {
  return (
    <section className="relative py-12 md:py-16 bg-[#141414] text-white overflow-hidden border-t border-neutral-800 select-none">
      {/* Decorative Oversized Gold Chevrons Bleeding Off Top-Left and Bottom-Right Corners */}
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

      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Headline, Narrative & Dual CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C9A227]">
              <span className="w-8 h-[1.5px] bg-[#C9A227]" />
              <span>Strategic Enterprise Collaboration</span>
            </div>

            {/* Large Serif Headline Standardized */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.2]">
              Partner With Digital CXOS
            </h2>

            {/* Subhead narrative Standardized */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-2xl">
              Collaborate with India&apos;s most visionary enterprise decision-makers, boardroom influencers, and digital trailblazers shaping enterprise technology, cyber resilience, and national infrastructure.
            </p>

            {/* Trust highlights */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-300 font-medium pt-1">
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#C9A227]" />
                <span>Chatham House Rule Exchange</span>
              </span>
              <span className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-[#C9A227]" />
                <span>100% Peer Vetted CXO Circle</span>
              </span>
            </div>

            {/* Dual CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/partnership2"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 transition-all duration-200 shadow-xl hover:scale-105 text-center"
              >
                <span>Explore Partnership Tracks</span>
                <span className="font-bold text-base">›</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-transparent hover:bg-neutral-800 text-white border border-neutral-700 transition-colors text-center"
              >
                <span>Schedule Executive Briefing</span>
                <ArrowRight className="w-4 h-4 text-[#C9A227]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Strategic Engagement Pathways Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#1C1C1C]/90 backdrop-blur-md rounded-sm p-6 sm:p-7 border border-[#C9A227]/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#C9A227]">
                <Handshake className="w-5 h-5" />
                <span>Engagement Pathways</span>
              </div>
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                Invitation Only
              </span>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-neutral-300">
              <div className="p-4 rounded bg-neutral-900/60 border border-neutral-800/80 space-y-2">
                <h4 className="font-bold text-white text-sm uppercase tracking-wide flex items-center justify-between">
                  <span>1. Boardroom Roundtables</span>
                  <span className="text-[#C9A227]">Closed Door</span>
                </h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Host closed-door, Chatham House discussions with 20+ verified enterprise technology leaders.
                </p>
              </div>

              <div className="p-4 rounded bg-neutral-900/60 border border-neutral-800/80 space-y-2">
                <h4 className="font-bold text-white text-sm uppercase tracking-wide flex items-center justify-between">
                  <span>2. Joint Research &amp; Playbooks</span>
                  <span className="text-[#C9A227]">Co-Authored</span>
                </h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Publish authoritative benchmarks on AI governance, DPDP compliance, and sovereign infrastructure.
                </p>
              </div>

              <div className="p-4 rounded bg-neutral-900/60 border border-neutral-800/80 space-y-2">
                <h4 className="font-bold text-white text-sm uppercase tracking-wide flex items-center justify-between">
                  <span>3. Conclave Keynotes</span>
                  <span className="text-[#C9A227]">High Visibility</span>
                </h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Lead keynote masterclasses at annual leadership summits across Delhi-NCR, Bengaluru, and Mumbai.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>National CXO Network</span>
              <span className="text-[#C9A227] font-semibold">100% Peer Vetted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
