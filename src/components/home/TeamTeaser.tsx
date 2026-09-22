import React from "react";
import Link from "next/link";
import Image from "next/image";
import { leadershipTeam } from "@/lib/data/teamData";

export function TeamTeaser() {
  return (
    <section className="py-20 md:py-28 bg-[#F7F3EA] text-[#1A1A1A] border-t border-[#EAE4D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
            Executive Stewardship
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] tracking-tight leading-[1.2]">
            Guided by Accomplished Enterprise Leaders
          </h2>
          <p className="text-base text-[#444444]">
            Decades of cross-industry CXO experience across globally renowned, transformation-driven enterprises.
          </p>
        </div>

        {/* 6 Leadership Photo Cards with Hover Tint & Cream Caption Box (Pattern 8) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {leadershipTeam.map((member) => (
            <Link
              key={member.slug}
              href={`/team/${member.slug}`}
              className="group block bg-[#FDFAF3] rounded-sm overflow-hidden border border-[#EAE4D6] shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Duotone Photo with Hover Tint Lift */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-[#C9A227] font-serif text-3xl font-bold">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                )}
                {/* Subtle gold brand corner accent */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[28px] border-r-[28px] border-t-transparent border-r-[#C9A227]/60" />
              </div>

              {/* Cream Caption Box */}
              <div className="p-6 space-y-2.5">
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A] group-hover:text-[#C9A227] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
                  {member.role}
                </p>
                <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>

                {/* Card Link Action with Gold Chevron */}
                <div className="pt-3 border-t border-[#EAE4D6] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#C9A227]">
                  <span>View Executive Profile</span>
                  <span className="text-[#C9A227] text-base group-hover:translate-x-1 transition-transform">›</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore All Profiles Link */}
        <div className="pt-4 text-center">
          <Link
            href="/about#leadership"
            className="inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#C9A227] transition-colors chevron-link"
          >
            Explore Complete Leadership Credo
          </Link>
        </div>
      </div>
    </section>
  );
}
