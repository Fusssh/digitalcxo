"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Laptop, 
  Factory, 
  Radio, 
  Briefcase, 
  Bot, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SectorItem {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  highlight: string;
  details: string;
  cxoFocus: string;
}

const sectors: SectorItem[] = [
  {
    id: "banking",
    name: "Banking & BFSI",
    icon: Building2,
    color: "#E6CA65",
    gradient: "from-amber-500/20 to-yellow-600/10",
    highlight: "Core Banking Modernization & DPDP Compliance",
    details: "High-security cloud migration, fraud telemetry, and API banking ecosystems safeguarding financial transactions across national infrastructure.",
    cxoFocus: "CIOs & CISOs in FinTech, Public & Private Banks"
  },
  {
    id: "it",
    name: "Information Technology",
    icon: Laptop,
    color: "#38BDF8",
    gradient: "from-sky-500/20 to-blue-600/10",
    highlight: "Hyperscale Cloud & Sovereign Stacks",
    details: "Building global delivery hubs, zero-trust architectures, and enterprise microservices powering multi-billion-dollar enterprise ecosystems.",
    cxoFocus: "CTOs, CDOs & Chief Technology Architects"
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: Factory,
    color: "#F97316",
    gradient: "from-orange-500/20 to-amber-600/10",
    highlight: "Industry 4.0 & Smart Factory Robotics",
    details: "Converging IT with OT operational technology, industrial IoT edge sensors, supply chain digital twins, and predictive maintenance pipelines.",
    cxoFocus: "Heads of Digital Operations & Smart Infrastructure"
  },
  {
    id: "telecom",
    name: "Telecom & 5G",
    icon: Radio,
    color: "#A855F7",
    gradient: "from-purple-500/20 to-indigo-600/10",
    highlight: "5G Enterprise Networks & Edge AI",
    details: "Deploying high-throughput low-latency network fabrics, telecom cloud architectures, and sovereign communications infrastructure.",
    cxoFocus: "Chief Network Officers & Enterprise Telecom Chiefs"
  },
  {
    id: "consulting",
    name: "Consulting",
    icon: Briefcase,
    color: "#10B981",
    gradient: "from-emerald-500/20 to-teal-600/10",
    highlight: "Boardroom Transformation & M&A Due Diligence",
    details: "Strategic advisory bridging technology roadmaps with corporate governance, ESG compliance metrics, and large-scale M&A digital integrations.",
    cxoFocus: "Chief Strategy Officers & Managing Partners"
  },
  {
    id: "ai",
    name: "AI & Cognitive Systems",
    icon: Bot,
    color: "#EC4899",
    gradient: "from-pink-500/20 to-rose-600/10",
    highlight: "Enterprise LLMs, AI Governance & Autonomous Agents",
    details: "Accelerating secure generative AI deployment, neural knowledge bases, automated decision pipelines, and ethical AI safeguards across industries.",
    cxoFocus: "Chief AI Officers & Digital Innovation Leaders"
  }
];

export function SectorsSection() {
  const [selectedSector, setSelectedSector] = useState<SectorItem>(sectors[0]);

  return (
    <section className="py-20 bg-gradient-to-b from-[#060B18] via-[#091229] to-[#060B18] relative overflow-hidden border-y border-white/5">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-950/20 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Caption verbatim */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cross-Industry Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif heading-gold">
            Driving Digital Transformation Across Sectors
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300">
            A strategic movement uniting CXOs across India&apos;s most vital economic engines to co-architect digital defense, resilience, and scalable growth.
          </p>
        </div>

        {/* Interactive Sectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {sectors.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedSector.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSector(s)}
                className={cn(
                  "p-4 rounded-xl text-center transition-all duration-300 flex flex-col items-center gap-3 border relative group cursor-pointer",
                  isSelected
                    ? "bg-[#0E1B3D] border-amber-400/60 shadow-[0_0_20px_rgba(230,202,101,0.25)] scale-[1.02]"
                    : "glass-panel border-white/10 hover:border-white/25 hover:bg-[#0A132C]"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                    isSelected ? "bg-amber-400/20 text-amber-300" : "bg-white/5 text-slate-300"
                  )}
                >
                  <Icon className="w-6 h-6" style={{ color: isSelected ? "#E6CA65" : s.color }} />
                </div>
                <span
                  className={cn(
                    "text-xs font-bold tracking-wide",
                    isSelected ? "text-amber-200" : "text-slate-300 group-hover:text-white"
                  )}
                >
                  {s.name}
                </span>

                {isSelected && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Sector Deep-Dive Card */}
        <div className="relative rounded-2xl glass-panel-gold p-6 sm:p-8 lg:p-10 border border-amber-400/30 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 blur-3xl pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {selectedSector.highlight}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enterprise Grade</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-100">
                {selectedSector.name} Digital Blueprint
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {selectedSector.details}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-amber-200/90 font-medium">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Executive Pods: </span>
                <span className="text-slate-300">{selectedSector.cxoFocus}</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-center p-6 rounded-xl bg-slate-950/60 border border-white/10 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                {React.createElement(selectedSector.icon, {
                  className: "w-8 h-8 text-amber-300"
                })}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Community Representation
                </p>
                <p className="text-2xl font-bold font-serif text-amber-300 mt-0.5">
                  1,200+ Leaders
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Across Boardrooms & Technology Councils
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
