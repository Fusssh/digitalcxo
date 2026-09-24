import React from "react";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { chaptersData } from "@/lib/data/chaptersData";
import { IndiaTechMap } from "@/components/ui/IndiaTechMap";
import { MapPin, Users, Calendar, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Regional Chapters — Delhi NCR, Mumbai, Bangalore, Chennai | Digital CXOS",
  description: "Explore Digital CXOS city chapters connecting digital leaders across India's premier enterprise and technology corridors.",
};

export default function ChaptersPage() {
  return (
    <div className="min-h-screen bg-[#060B18]">
      <PageHero
        title="Regional Chapters"
        subtitle="Localized high-trust leadership pods connecting CIOs, CISOs, and CTOs across India's vital technology and industrial hubs."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Chapters" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24 space-y-16">
        {/* Interactive India Tech Corridors Map */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-serif heading-gold">
            National Technology Footprint
          </h2>
          <IndiaTechMap />
        </div>

        {/* 4 Chapter City Cards */}
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-100">
            Active Leadership Chapters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {chaptersData.map((chapter) => (
              <div
                key={chapter.id}
                className="rounded-2xl glass-panel p-8 border border-white/10 hover:border-amber-400/40 hover:bg-[#0A1435] transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-amber-300 font-serif text-2xl font-bold">
                      <MapPin className="w-6 h-6 text-amber-400" />
                      <span>{chapter.name}</span>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 font-semibold">
                      {chapter.region}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {chapter.description}
                    </p>

                    <div className="pt-2 space-y-1.5 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-200 font-semibold">{chapter.memberCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span>{chapter.meetingFrequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-sky-400" />
                        <span>{chapter.lead}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Link
                    href={`/chapters/${chapter.id}`}
                    className="text-xs font-bold uppercase tracking-wider text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Explore Chapter Hub</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/membership2"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-emerald-600 text-white transition-colors text-center"
                  >
                    Apply in {chapter.name.split(" ")[0]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
