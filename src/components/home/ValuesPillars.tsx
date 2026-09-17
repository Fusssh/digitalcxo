import React from "react";
import { Target, Compass, Award, ShieldCheck, Globe2 } from "lucide-react";
import { IndiaTechMap } from "@/components/ui/IndiaTechMap";

export function ValuesPillars() {
  return (
    <section className="py-24 bg-[#050914] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-blue-900/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
            Strategic Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif heading-gold mt-2">
            Mission, Vision & Core Values
          </h2>
          <div className="mt-4 mx-auto w-24 h-1 rounded-full flex overflow-hidden shadow-[0_0_12px_rgba(255,90,0,0.3)]">
            <div className="w-1/3 bg-[#FF5A00]" />
            <div className="w-1/3 bg-[#FFFFFF]" />
            <div className="w-1/3 bg-[#138808]" />
          </div>
        </div>

        {/* 3 Pillars Cards with Client-Specified Official Colors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          {/* Mission Card - Client #FF5A00 Orange */}
          <div className="lg:col-span-4 rounded-2xl glass-panel p-8 border border-white/10 hover:border-[#FF5A00]/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-[0_0_25px_rgba(255,90,0,0.06)]">
            {/* Vertical Mission #FF5A00 Ribbon */}
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FF5A00] via-[#FF7A29] to-transparent" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FF5A00]/15 border border-[#FF5A00]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-[#FF5A00]" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FF5A00]/20 text-[#FF7A29] border border-[#FF5A00]/30">
                  Strategic Directive
                </span>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-100 mb-4 flex items-center gap-2">
                <span>Our Mission</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                &ldquo;To empower the global IT and C-suite leadership community to accelerate digital transformation, strengthen cybersecurity and enhance technological impact building resilient enterprises that contribute to India&apos;s digital future.&rdquo;
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs text-[#FF7A29] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#FF5A00]" />
              <span>Sovereign Cyber Resilience</span>
            </div>
          </div>

          {/* Vision Card - Client #FFFFFF White */}
          <div className="lg:col-span-4 rounded-2xl glass-panel p-8 border border-white/10 hover:border-white/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-[0_0_25px_rgba(255,255,255,0.06)]">
            {/* Vertical Vision #FFFFFF Ribbon */}
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FFFFFF] via-slate-200 to-transparent" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/30">
                  Long-Term Horizon
                </span>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-100 mb-4 flex items-center gap-2">
                <span>Our Vision</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                &ldquo;To empower visionary technology leaders with a dynamic platform that accelerates digital transformation, nurtures secure innovation and improves enterprise technology driving sustainable growth, resilience and strategic clarity across industries.&rdquo;
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs text-slate-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Sustainable Growth & Clarity</span>
            </div>
          </div>

          {/* Core Values Card - Client #138808 Green */}
          <div className="lg:col-span-4 rounded-2xl glass-panel p-8 border border-white/10 hover:border-[#138808]/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-[0_0_25px_rgba(19,136,8,0.1)]">
            {/* Vertical Values #138808 Ribbon */}
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#138808] via-emerald-500 to-transparent" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#138808]/15 border border-[#138808]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-[#10B981]" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#138808]/20 text-emerald-300 border border-[#138808]/30">
                  Guiding Principles
                </span>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-100 mb-4 flex items-center gap-2">
                <span>Our Values</span>
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed italic">
                &ldquo;We are guided by trust, confidentiality, strategic relevance, ethical leadership and a shared commitment to shaping secure, responsible and forward-looking digital enterprises for the country&apos;s progress.&rdquo;
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#138808]/20 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Guiding Principles of Trust</span>
            </div>
          </div>
        </div>

        {/* Interactive Digital India Tech Corridors Map Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Pan-India Executive Fabric</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100 mt-2">
                Digital Corridors Connecting India&apos;s Enterprise Capitals
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF9933]" /> NCR</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#E6CA65]" /> Mumbai</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]" /> Bengaluru</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Chennai</span>
            </div>
          </div>

          <IndiaTechMap />
        </div>
      </div>
    </section>
  );
}
