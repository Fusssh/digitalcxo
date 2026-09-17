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
    <div className="min-h-screen bg-[#060B18]">
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
                "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer",
                activeCategory === cat
                  ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(230,202,101,0.2)]"
                  : "glass-panel text-slate-400 border-white/10 hover:text-white hover:border-white/25"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 12 Initiatives Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInitiatives.map((item) => {
            const Icon = iconMap[item.iconName] || Sparkles;

            return (
              <div
                key={item.id}
                className="rounded-2xl glass-panel p-7 border border-white/10 hover:border-amber-400/40 hover:bg-[#09132E] transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-amber-300" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90 px-3 py-1 rounded-full bg-slate-900 border border-white/10">
                      #{item.id}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 mb-2 block">
                    {item.category}
                  </span>

                  <h3 className="text-lg font-bold font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Active Community Pod</span>
                  </div>
                  <Link
                    href="/membership2"
                    className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 group/btn"
                  >
                    <span>Participate</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner to Join */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl glass-panel-gold border border-amber-400/30 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold font-serif heading-gold">
              Contribute to Our Initiatives
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We invite enterprise leaders to mentor rising talent, lead crisis labs, and share sovereign insights on national panels.
            </p>
            <div className="pt-2">
              <Link
                href="/membership2"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                <span>Apply For CXO Membership</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
