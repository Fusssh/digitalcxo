"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, HeartHandshake, Sparkles } from "lucide-react";

interface SocialInitiative {
  id: string;
  number: string;
  tag: string;
  commitment: string;
  title: string;
  description: string;
  image: string;
  impactHighlight: string;
}

const socialInitiatives: SocialInitiative[] = [
  {
    id: "si-1",
    number: "01",
    tag: "Executive Vitality & Mind",
    commitment: "Annual Residential Retreat",
    title: "CXO Wellness Retreats",
    description:
      "Hosting immersive wellness experiences focused on rejuvenation, relaxation and stress management to support sustainable leadership vitality and decision clarity.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    impactHighlight: "Peer Restoration & Mindfulness"
  },
  {
    id: "si-2",
    number: "02",
    tag: "Preventive Healthcare",
    commitment: "Quarterly Diagnostic Camps",
    title: "Health Awareness & Screening Camps",
    description:
      "Organizing accessible health check-ups and diagnostic awareness programs to promote early preventive care across the CXO executive fraternity and surrounding communities.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
    impactHighlight: "Early Diagnostics & Preventive Camps"
  },
  {
    id: "si-3",
    number: "03",
    tag: "Philanthropic Pledge",
    commitment: "3% Annual Profit Pledge",
    title: "Founders' Personal Giving Commitment",
    description:
      "Our founders personally pledge 3% of annual profits to fund meaningful social causes, tech literacy for underprivileged students, and grassroot community development.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    impactHighlight: "Direct Institutional Giving"
  }
];

export function EventsTeaser() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
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
  }, []);

  const scrollByAmount = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth > 768 ? el.clientWidth / 3 : el.clientWidth * 0.85;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-[#F7F3EA] text-[#1A1A1A] relative overflow-hidden select-none border-t border-[#EAE4D6]">
      {/* Subtle decorative background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-[#EAE4D6]/40 blur-3xl"
      />

      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10 space-y-12">
        {/* Split Header Architecture */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-[#EAE4D6]/80">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE4D6] border border-[#DDD5C4] text-[#8C6D1F] text-xs font-bold uppercase tracking-widest">
              <HeartHandshake className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Philanthropy &amp; Community Stewardship</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] tracking-tight leading-[1.2]">
              Our Social Initiatives
            </h2>

            <p className="text-base sm:text-lg text-[#555555] max-w-2xl leading-relaxed font-normal">
              Beyond boardroom strategy and technological transformation, our leadership fraternity is dedicated to executive vitality, preventive community health, and structured philanthropic giving.
            </p>
          </div>

          {/* Action CTAs & Navigation Controls */}
          <div className="flex items-center gap-4 self-start lg:self-end">
            <Link
              href="/initiatives"
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#C9A227] text-white hover:text-neutral-950 transition-all duration-300 shadow-md hover:scale-105"
            >
              <span>Explore Social Impact</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Slider navigation controls (active when scrolling is available) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByAmount(-1)}
                disabled={!canScrollLeft}
                aria-label="Previous social initiative"
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(1)}
                disabled={!canScrollRight}
                aria-label="Next social initiative"
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3-Pillar Executive Impact Cards */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          >
            {socialInitiatives.map((item) => (
              <div
                key={item.id}
                className="group bg-[#FDFAF3] rounded-xl overflow-hidden border border-[#EAE4D6] hover:border-[#C9A227] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 snap-start min-w-[280px]"
              >
                {/* Top Media Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center grayscale contrast-125 brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                  {/* Top-Left Category Tag */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#181818]/90 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                    {item.tag}
                  </div>

                  {/* Top-Right Number Badge */}
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#C9A227] text-neutral-950 text-xs font-bold font-mono flex items-center justify-center shadow-lg">
                    {item.number}
                  </div>

                  {/* Bottom Image Bar: Commitment Highlight */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-semibold drop-shadow-md">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{item.commitment}</span>
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A227] block">
                      {item.impactHighlight}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#C9A227] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#555555] leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Link Footer */}
                  <div className="pt-4 border-t border-[#EAE4D6] flex items-center justify-between">
                    <Link
                      href="/initiatives"
                      className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#C9A227] transition-colors inline-flex items-center gap-2"
                    >
                      <span>Learn More &amp; Participate</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C9A227] group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <span className="text-[11px] font-mono text-neutral-400">
                      Digital CXOS Social
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
