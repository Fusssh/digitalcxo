"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { initiativesData } from "@/lib/data/initiativesData";
import { 
  Users, 
  Compass, 
  GraduationCap, 
  Award, 
  ShieldAlert, 
  Sparkles, 
  Code, 
  HeartHandshake, 
  Layers, 
  Leaf, 
  FileCheck, 
  Mic, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Users,
  Compass,
  GraduationCap,
  Award,
  ShieldAlert,
  Sparkles,
  Code,
  HeartHandshake,
  Layers,
  Leaf,
  FileCheck,
  Mic,
};

const categories = [
  "All",
  "Mentorship",
  "Governance & Policy",
  "Innovation & Labs",
  "Community & Outreach",
] as const;

export default function InitiativesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredInitiatives =
    activeCategory === "All"
      ? initiativesData
      : initiativesData.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Page Hero */}
      <PageHero
        title="Enrichment & Contribution"
        subtitle="Twelve purpose-driven initiatives designed to empower digital leaders, foster cross-industry innovation, and contribute meaningfully to India's digital future."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Initiatives" },
        ]}
      />

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 border cursor-pointer",
                activeCategory === cat
                  ? "bg-[#C9A227] text-neutral-950 border-[#C9A227]"
                  : "bg-[#202020] text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 12 Initiatives Grid with Asymmetrical Design */}
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {filteredInitiatives.map((item, index) => {
            const Icon = iconMap[item.iconName] || Sparkles;
            const isCream = index % 2 === 0;

            return (
              <div
                key={item.id}
                className={cn(
                  "p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl group cursor-pointer",
                  isCream
                    ? "bg-[#F7F3EA] text-[#1A1A1A] border-none rounded-tl-[60px] rounded-br-[60px] rounded-tr-xl rounded-bl-xl"
                    : "bg-[#1E1E1E] text-white border border-neutral-800 rounded-tr-[60px] rounded-bl-[60px] rounded-tl-xl rounded-br-xl"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-black/5 border border-black/10 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={cn("w-6 h-6", isCream ? "text-[#C9A227]" : "text-[#C9A227]")} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border",
                      isCream ? "text-[#1A1A1A] border-[#1A1A1A]/20 bg-black/5" : "text-neutral-400 border-neutral-700 bg-neutral-900"
                    )}>
                      #{item.id}
                    </span>
                  </div>

                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider mb-2 block",
                    isCream ? "text-[#C9A227]" : "text-[#C9A227]"
                  )}>
                    {item.category}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-bold font-serif mb-4 leading-tight group-hover:text-[#C9A227] transition-colors">
                    {item.title}
                  </h3>

                  <p className={cn("text-sm leading-relaxed mb-8 text-justify sm:text-left", isCream ? "text-neutral-700" : "text-neutral-400")}>
                    {item.description}
                  </p>
                </div>

                <div className={cn("pt-5 border-t flex items-center justify-between", isCream ? "border-neutral-300" : "border-neutral-800")}>
                  <div className={cn("flex items-center gap-1.5 text-[11px]", isCream ? "text-neutral-600" : "text-neutral-500")}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Active Program</span>
                  </div>
                  <Link
                    href="/membership2"
                    className={cn(
                      "text-xs font-bold uppercase tracking-widest flex items-center gap-1 group/btn",
                      isCream ? "text-[#1A1A1A]" : "text-white"
                    )}
                  >
                    <span className="group-hover/btn:text-[#C9A227] transition-colors">Join</span>
                    <span className="font-bold text-[#C9A227] group-hover/btn:translate-x-1 transition-transform">›</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner to Join */}
        <div className="mt-16 p-8 sm:p-12 rounded-sm bg-[#141414] border border-[#C9A227]/40 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Contribute to Our Initiatives
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              We invite enterprise leaders to mentor rising talent, lead crisis labs, and share sovereign insights on national panels.
            </p>
            <div className="pt-2">
              <Link
                href="/membership2"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 shadow-lg transition-all"
              >
                <span>Apply For CXO Membership</span>
                <span className="font-bold">›</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
