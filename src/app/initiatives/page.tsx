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

      {/* 12 Initiatives Grid with Exec Club Left Border Pattern */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInitiatives.map((item, index) => {
            const Icon = iconMap[item.iconName] || Sparkles;
            const isGold = index % 2 === 0;

            return (
              <div
                key={item.id}
                className={cn(
                  "bg-[#202020] p-7 rounded-sm border border-neutral-800 transition-all duration-300 flex flex-col justify-between group hover:border-neutral-700 hover:shadow-xl",
                  isGold ? "border-l-4 border-l-[#C9A227]" : "border-l-4 border-l-[#2B5C8F]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#C9A227]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227] px-2.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                      #{item.id}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2 block">
                    {item.category}
                  </span>

                  <h3 className="text-lg font-bold font-serif text-white group-hover:text-[#C9A227] transition-colors leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-justify sm:text-left">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Active Program</span>
                  </div>
                  <Link
                    href="/membership2"
                    className="text-xs font-bold uppercase tracking-wider text-[#C9A227] hover:text-[#D4AF37] flex items-center gap-1 group/btn"
                  >
                    <span>Participate</span>
                    <span className="font-bold">›</span>
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
