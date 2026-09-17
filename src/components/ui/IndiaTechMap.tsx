"use client";

import React, { useState } from "react";
import Link from "next/link";
import indiaMapData from "@svg-maps/india";
import { chaptersData } from "@/lib/data/chaptersData";
import { MapPin, Users, Calendar, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChapterCityPin {
  id: string;
  name: string;
  stateId: string;
  cx: number;
  cy: number;
  color: string;
  badge: string;
}

const chapterCities: ChapterCityPin[] = [
  {
    id: "delhi-ncr",
    name: "Delhi NCR",
    stateId: "dl",
    cx: 198,
    cy: 210,
    color: "#FF9933", // Saffron
    badge: "Policy & Sovereign Governance"
  },
  {
    id: "mumbai",
    name: "Mumbai",
    stateId: "mh",
    cx: 128,
    cy: 412,
    color: "#E6CA65", // Gold
    badge: "BFSI & Financial Capital"
  },
  {
    id: "bangalore",
    name: "Bangalore",
    stateId: "ka",
    cx: 205,
    cy: 560,
    color: "#10B981", // Emerald
    badge: "DeepTech & Cloud Innovation"
  },
  {
    id: "chennai",
    name: "Chennai",
    stateId: "tn",
    cx: 265,
    cy: 540,
    color: "#38BDF8", // Cyan
    badge: "Industrial & Telecom Hub"
  }
];

interface MapLocation {
  id: string;
  name: string;
  path: string;
}

export function IndiaTechMap({ className }: { className?: string }) {
  const [activeCityId, setActiveCityId] = useState<string>("delhi-ncr");
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const activeChapter =
    chaptersData.find((c) => c.id === activeCityId) || chaptersData[0];
  const activePin =
    chapterCities.find((c) => c.id === activeCityId) || chapterCities[0];

  // Locations from authentic SVG map of India
  const locations: MapLocation[] = (indiaMapData as unknown as { locations: MapLocation[] }).locations || [];

  return (
    <div
      className={cn(
        "rounded-3xl glass-panel-gold border border-amber-400/30 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-16 -right-16 w-96 h-96 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-96 h-96 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Authentic Geographically Accurate India SVG Map */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[420px] aspect-[612/696] flex items-center justify-center p-2">
            <svg
              viewBox={indiaMapData.viewBox || "0 0 612 696"}
              className="w-full h-full drop-shadow-[0_0_30px_rgba(230,202,101,0.2)]"
              xmlns="http://www.w3.org/2000/svg"
            >

              {/* State Paths from authentic Geographic India dataset */}
              <g className="states-group">
                {locations.map((loc) => {
                  const isChapterState = chapterCities.some((c) => c.stateId === loc.id);
                  const isSelected = activePin.stateId === loc.id;
                  const isHovered = hoveredLocation === loc.id;

                  return (
                    <path
                      key={loc.id}
                      d={loc.path}
                      id={loc.id}
                      name={loc.name}
                      onMouseEnter={() => setHoveredLocation(loc.id)}
                      onMouseLeave={() => setHoveredLocation(null)}
                      onClick={() => {
                        const foundCity = chapterCities.find((c) => c.stateId === loc.id);
                        if (foundCity) setActiveCityId(foundCity.id);
                      }}
                      className={cn(
                        "transition-all duration-300 cursor-pointer",
                        isSelected
                          ? "fill-[#132552] stroke-amber-300 stroke-[1.5]"
                          : isChapterState
                          ? "fill-[#0B1738] hover:fill-[#12224A] stroke-amber-400/40 stroke-[1]"
                          : isHovered
                          ? "fill-[#0E1A3D] stroke-white/30 stroke-[0.8]"
                          : "fill-[#070E24] hover:fill-[#0C1736] stroke-white/10 stroke-[0.6]"
                      )}
                    />
                  );
                })}
              </g>

              {/* Interconnecting Sovereign Cyber Corridor Highways */}
              {/* Delhi -> Mumbai */}
              <path
                d="M 198 210 Q 155 300 128 412"
                stroke="#FF9933"
                strokeWidth="2"
                strokeDasharray="4 3"
                fill="none"
                opacity="0.75"
              />
              {/* Mumbai -> Bangalore */}
              <path
                d="M 128 412 Q 160 490 205 560"
                stroke="#E6CA65"
                strokeWidth="2"
                strokeDasharray="4 3"
                fill="none"
                opacity="0.75"
              />
              {/* Bangalore -> Chennai */}
              <path
                d="M 205 560 L 265 540"
                stroke="#10B981"
                strokeWidth="2.2"
                strokeDasharray="4 3"
                fill="none"
                opacity="0.8"
              />
              {/* Delhi -> Chennai Spine */}
              <path
                d="M 198 210 Q 240 375 265 540"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1.2"
                strokeDasharray="3 4"
                fill="none"
              />

              {/* City Nodes */}
              {chapterCities.map((city) => {
                const isActive = activeCityId === city.id;
                return (
                  <g
                    key={city.id}
                    onClick={() => setActiveCityId(city.id)}
                    className="cursor-pointer group/node"
                  >

                    {/* Node Glow */}
                    <circle
                      cx={city.cx}
                      cy={city.cy}
                      r={isActive ? 13 : 9}
                      fill={city.color}
                      fillOpacity={isActive ? "0.35" : "0.15"}
                      stroke={city.color}
                      strokeWidth={isActive ? "2.5" : "1.2"}
                      className="transition-all duration-300"
                    />

                    {/* Central Pip */}
                    <circle
                      cx={city.cx}
                      cy={city.cy}
                      r={isActive ? 5 : 3.5}
                      fill={isActive ? "#FFFFFF" : city.color}
                    />

                    {/* City Label Badge */}
                    <g className="select-none">
                      <rect
                        x={city.cx + (city.cx > 210 ? 12 : -74)}
                        y={city.cy - 12}
                        width="68"
                        height="20"
                        rx="5"
                        fill="#050A1A"
                        fillOpacity="0.88"
                        stroke={isActive ? city.color : "rgba(255,255,255,0.15)"}
                        strokeWidth="1"
                      />
                      <text
                        x={city.cx + (city.cx > 210 ? 46 : -40)}
                        y={city.cy + 1}
                        fill={isActive ? "#FFF7DF" : "#CBD5E1"}
                        fontSize="9.5"
                        fontWeight={isActive ? "bold" : "600"}
                        fontFamily="var(--font-sans), sans-serif"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {city.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-center text-[10px] uppercase tracking-widest text-slate-400 mt-2">
            Accurate Sovereign Contour • Click any city node to inspect chapter
          </p>
        </div>

        {/* Right Column: Selected Chapter Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase font-bold tracking-widest px-3.5 py-1 rounded-full border"
              style={{
                color: activePin.color,
                borderColor: `${activePin.color}50`,
                backgroundColor: `${activePin.color}15`
              }}
            >
              {activePin.badge}
            </span>

            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sovereign Tech Corridor</span>
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-amber-300" />
              <span>{activeChapter.name} Chapter</span>
            </h3>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              {activeChapter.description}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                <Users className="w-4 h-4" />
                <span>Executive Strength</span>
              </div>
              <p className="text-xl font-bold font-serif text-slate-100">
                {activeChapter.memberCount}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Calendar className="w-4 h-4" />
                <span>Roundtable Cadence</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                {activeChapter.meetingFrequency}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#09132E] border border-white/5 text-xs text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Governance Pod: </span>
              <span>{activeChapter.lead}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={`/chapters/${activeChapter.id}`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-amber-300 hover:bg-slate-800 border border-amber-400/40 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore {activeChapter.name} Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/membership2"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Apply in {activeChapter.name.split(" ")[0]}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
