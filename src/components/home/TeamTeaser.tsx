"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { leadershipTeam } from "@/lib/data/teamData";
import { TeamMember } from "@/types";

export function TeamTeaser() {
  const [team, setTeam] = useState<TeamMember[]>(leadershipTeam);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetch("/api/admin/leadership")
      .then((res) => res.json())
      .then((data) => {
        if (data.teamMembers && Array.isArray(data.teamMembers) && data.teamMembers.length > 0) {
          setTeam(data.teamMembers);
        }
      })
      .catch(() => {});
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [team]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = card ? card.offsetWidth + 32 /* gap-8 */ : el.clientWidth / 4;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <section className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F9F9F8] text-[#1A1A1A] border-t border-[#EAE4D6] select-none overflow-hidden">
      {/* Subtle dot-grid texture, top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-8 left-6 sm:left-8 w-36 h-36 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(#C9C4B4 1.3px, transparent 1.3px)",
          backgroundSize: "13px 13px",
        }}
      />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10 space-y-8 sm:space-y-10">
        {/* Top Split Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end pb-4 sm:pb-6 border-b border-[#EAE4D6]">
          {/* Left Column: Eyebrow + Main Title */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C9A227]">
              <span className="w-6 sm:w-8 h-[1.5px] bg-[#C9A227]" />
              <span>Our Leadership [{team.length.toString().padStart(2, "0")}]</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#1A1A1A] tracking-tight leading-[1.2]">
              The People Behind Digital CXOS
            </h2>
          </div>

          {/* Right Column: Narrative Description + Slider Arrows */}
          <div className="lg:col-span-5 flex items-end justify-between gap-6">
            <p className="text-sm sm:text-base md:text-lg text-[#555555] leading-relaxed font-normal max-w-2xl">
              Our team is a blend of visionaries, enterprise strategists, and technology leaders dedicated to fostering high-trust peer collaboration. We come together with one shared goal: to guide India&apos;s digital future while ensuring every initiative exceeds expectations.
            </p>

            {/* Nav arrows, desktop only */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={!canScrollLeft}
                aria-label="Previous team members"
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={!canScrollRight}
                aria-label="Next team members"
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Team Slider — smaller cards, kept inside the section's own padding */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex lg:grid lg:grid-cols-5 gap-4 lg:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {team.map((member) => {
              return (
                <Link
                  key={member.slug}
                  data-card
                  href={`/team/${member.slug}`}
                  className="group shrink-0 grow basis-0 min-w-[150px] sm:min-w-[170px] lg:min-w-[190px] w-full snap-start block bg-white rounded-xl p-2 sm:p-2.5 border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Portrait photo */}
                  <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-neutral-900 mb-3">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 52vw, (max-width: 1024px) 30vw, 15vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-[#C9A227] font-serif text-2xl font-bold">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                  </div>

                  {/* Role Subtitle + Elegant Serif Name */}
                  <div className="px-0.5 space-y-0.5 mb-3">
                    <span className="text-[11px] font-medium text-neutral-500 block line-clamp-1">
                      {member.role}
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-neutral-900 group-hover:text-[#C9A227] transition-colors leading-tight">
                      {member.name}
                    </h3>
                  </div>

                  <div className="px-0.5 pb-0.5">
                    <div className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-neutral-950 group-hover:bg-[#C9A227] text-white group-hover:text-neutral-950 font-sans text-[10.5px] sm:text-[11px] font-semibold tracking-wide transition-all duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] group-hover:bg-neutral-950 transition-colors" />
                      <span>View Details</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right-edge fade hint that there's more to scroll, on mobile/tablet */}
          <div className="pointer-events-none absolute top-0 right-0 bottom-2 w-12 bg-gradient-to-l from-[#F9F9F8] to-transparent lg:hidden" />
        </div>

        {/* Footer Explore Link */}
        <div className="pt-2 text-center">
          <Link
            href="/about#leadership"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#C9A227] transition-colors chevron-link"
          >
            Explore Complete Leadership Credo &amp; Board Advisory
          </Link>
        </div>
      </div>
    </section>
  );
}