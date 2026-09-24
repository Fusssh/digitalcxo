"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, HeartHandshake, Sparkles } from "lucide-react";

interface SocialInitiative {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const socialInitiatives: SocialInitiative[] = [
  {
    id: "si-1",
    tag: "Executive Vitality",
    title: "CXO WELLNESS RETREATS",
    description:
      "Hosting immersive wellness experiences focused on rejuvenation, relaxation and stress management to support leadership vitality.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
    link: "/initiatives"
  },
  {
    id: "si-2",
    tag: "Preventive Care",
    title: "HEALTH AWARENESS & SCREENING CAMPS",
    description:
      "Organizing accessible health check-ups and awareness programs to promote preventive care within the CXO community and beyond.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
    link: "/initiatives"
  },
  {
    id: "si-3",
    tag: "Philanthropic Pledge",
    title: "FOUNDERS' PERSONAL GIVING COMMITMENT",
    description:
      "Our founders personally pledge 3% of their annual profits to support meaningful social causes and contribute to community development.",
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop",
    link: "/initiatives"
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
      {/* Subtle warm decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-[#EAE4D6]/40 blur-3xl"
      />

      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10 space-y-10">
        {/* Modern Split Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-[#EAE4D6]/80">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE4D6] border border-[#DDD5C4] text-[#8C6D1F] text-xs font-bold uppercase tracking-widest shadow-sm">
              <HeartHandshake className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Philanthropy &amp; Community Stewardship</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] tracking-tight leading-[1.2]">
              Our Social Initiatives
            </h2>

            <p className="text-base sm:text-lg text-[#555555] max-w-2xl leading-relaxed font-normal">
              Beyond boardroom strategy and technological transformation, our leadership fraternity is dedicated to executive vitality, preventive health diagnostics, and structured philanthropic giving.
            </p>
          </div>

          {/* Action CTAs & Navigation Controls */}
          <div className="flex items-center gap-4 self-start lg:self-end">
            <Link
              href="/initiatives"
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#C9A227] text-white hover:text-neutral-950 transition-all duration-300 shadow-md hover:scale-105 shrink-0"
            >
              <span>Explore Social Impact</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Slider navigation controls */}
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

        {/* 3 Modern Full-Image Cards with Floating White Overlay Pill */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          >
            {socialInitiatives.map((item, idx) => (
              <Link
                key={item.id}
                href={item.link}
                className="group relative block aspect-[16/11] sm:aspect-[16/10] min-h-[300px] md:min-h-[340px] w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-[#EAE4D6] hover:border-[#C9A227] transition-all duration-500 snap-start bg-neutral-900"
              >
                {/* Full-bleed Photo Background */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Dark Vignette Overlay for Depth & Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/40 group-hover:from-black/50 transition-colors duration-500" />

                {/* Top Corner Number Badge */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                  0{idx + 1} • {item.tag}
                </div>

                {/* Center Floating White Capsule Pill */}
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 z-10">
                  <div className="bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[36px] px-6 py-6 sm:px-7 sm:py-7 max-w-[90%] sm:max-w-[86%] text-center shadow-2xl border border-white/80 group-hover:scale-[1.02] group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.3)] transition-all duration-300">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] block mb-1.5 font-mono">
                      Social Initiative
                    </span>

                    <h3 className="font-extrabold text-sm sm:text-base md:text-lg text-[#111111] uppercase tracking-wide mb-2 leading-snug group-hover:text-[#8C6D1F] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                      {item.description}
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#C9A227] transition-colors">
                      <span>Learn More &amp; Participate</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


