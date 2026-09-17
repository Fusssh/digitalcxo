import React from "react";
import Link from "next/link";
import Image from "next/image";
import { leadershipTeam } from "@/lib/data/teamData";
import { ArrowRight, UserCheck } from "lucide-react";

export function TeamTeaser() {
  return (
    <section className="py-24 bg-[#060B18] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
            Enterprise Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif heading-gold mt-2">
            Meet Our Leadership Team
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Behind every successful vision is a team of leaders who inspire growth, innovation and trust. Meet the minds shaping the future of digital transformation at Digital CXOS.
          </p>
          <div className="mt-4 mx-auto w-20 h-0.5 rounded-full bg-gradient-to-r from-[#FF9933] via-white/80 to-[#138808]" />
        </div>

        {/* 6 Leadership Team Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leadershipTeam.map((member) => (
            <Link
              key={member.slug}
              href={`/team/${member.slug}`}
              className="group relative rounded-2xl glass-panel p-6 border border-white/10 hover:border-amber-400/50 hover:bg-[#0A1433] transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-1"
            >
              <div>
                {/* Avatar / Monogram */}
                <div className="flex items-center justify-between mb-4">
                  {member.image ? (
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-amber-400/30 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,153,51,0.2)]">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#12234F] to-[#0A122B] border border-amber-400/30 flex items-center justify-center text-amber-300 font-serif font-bold text-lg shadow-inner group-hover:scale-105 transition-transform">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                    Leader
                  </span>
                </div>

                {/* Name and Role */}
                <h3 className="text-lg font-bold font-serif text-slate-100 group-hover:text-amber-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-amber-400/90 font-medium mt-1">
                  {member.role}
                </p>

                {/* Sectors badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {member.sectors.slice(0, 2).map((sec, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5"
                    >
                      {sec}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Card Footer: Verbatim "Click to view profile." */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-amber-200">
                <span>Click to view profile.</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* View All Team Link */}
        <div className="mt-12 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 transition-all"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Explore All Executive Profiles & Advisors</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
