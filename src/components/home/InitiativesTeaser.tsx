"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { initiativesData } from "@/lib/data/initiativesData";
import { InitiativeItem } from "@/types";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function InitiativesTeaser() {
  const [initiatives, setInitiatives] = useState<InitiativeItem[]>(initiativesData);

  useEffect(() => {
    fetch("/api/admin/initiatives")
      .then((res) => res.json())
      .then((data) => {
        if (data.initiatives && Array.isArray(data.initiatives) && data.initiatives.length > 0) {
          setInitiatives(data.initiatives);
        }
      })
      .catch(() => {
        // Fallback to static data
      });
  }, []);

  // Take 8 representative initiatives for the 4x2 grid
  const teaserList = initiatives.slice(0, 8);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#181818] text-white relative overflow-hidden border-t border-neutral-800 select-none">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 lg:mb-16 gap-6 sm:gap-8 pb-4 sm:pb-6 border-b border-neutral-800">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#111111]/85 border border-neutral-700/80 text-[#C9A227] text-xs font-semibold uppercase tracking-widest shadow-xl">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enrichment &amp; Contribution</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-[1.2]">
              Strategic Initiatives &amp; Enterprise Pods
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed font-normal max-w-2xl">
              Transformative enterprise pods, mentorship circles, and crisis simulation labs driving national impact across industries.
            </p>
          </div>

          <Link
            href="/initiatives"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 transition-all duration-200 shadow-xl hover:scale-105 shrink-0"
          >
            <span>View All {initiatives.length} Initiatives</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4x2 Initiatives Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {teaserList.map((item, idx) => {
            const isCream = idx % 2 === 0;

            return (
              <div
                key={item.id}
                className={cn(
                  "p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl group cursor-pointer",
                  isCream
                    ? "bg-[#F7F3EA] text-[#1A1A1A] border-none rounded-tl-[32px] sm:rounded-tl-[40px] rounded-br-[32px] sm:rounded-br-[40px] rounded-tr-xl rounded-bl-xl"
                    : "bg-[#1E1E1E] text-white border border-neutral-800 rounded-tr-[32px] sm:rounded-tr-[40px] rounded-bl-[32px] sm:rounded-bl-[40px] rounded-tl-xl rounded-br-xl"
                )}
              >
                <div>
                  <div className="mb-4 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/5 border border-black/10 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold mb-2 leading-tight group-hover:text-[#C9A227] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className={cn("text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3", isCream ? "text-neutral-700" : "text-neutral-400")}>
                    {item.description}
                  </p>
                </div>

                <div className={cn("pt-4 border-t", isCream ? "border-neutral-300" : "border-neutral-800")}>
                  <Link
                    href="/initiatives"
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 group/link",
                      isCream ? "text-[#1A1A1A]" : "text-white"
                    )}
                  >
                    <span className="group-hover/link:text-[#C9A227] transition-colors">Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A227] group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
