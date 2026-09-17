import React from "react";
import Link from "next/link";
import { initiativesData } from "@/lib/data/initiativesData";
import { ArrowRight, Sparkles } from "lucide-react";

export function InitiativesTeaser() {
  // Take 4 representative initiatives for teaser
  const teaserList = initiativesData.slice(0, 4);

  return (
    <section className="py-24 bg-gradient-to-b from-[#060B18] via-[#091129] to-[#060B18] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enrichment & Contribution</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif heading-gold">
              Our Social Initiatives
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Transformative enterprise pods, mentorship circles, and crisis simulation labs driving national impact across industries.
            </p>
          </div>

          <Link
            href="/initiatives"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 border border-amber-400/30 transition-all self-start md:self-auto group"
          >
            <span>View All 12 Initiatives</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teaserList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl glass-panel p-6 border border-white/10 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between group hover:bg-[#0A1433]"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 inline-block mb-4">
                  {item.category}
                </span>
                <h3 className="text-base font-bold font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-snug mb-3">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href="/initiatives"
                  className="text-xs font-semibold text-slate-300 group-hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>Explore initiative</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
