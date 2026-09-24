"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Film, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface EventHighlight {
  id: string;
  videoUrl: string;
  posterUrl: string;
  tag: string;
  edition: string;
  title: string;
}

const defaultHighlights: EventHighlight[] = [
  {
    id: "eh-1",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    posterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    tag: "Flagship Conclave",
    edition: "2026 Annual Conclave",
    title: "Digital CXOS National Conclave — The Sovereign AI Era"
  },
  {
    id: "eh-2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    posterUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    tag: "Security Summit",
    edition: "Cyber Defense Conclave",
    title: "Enterprise Cyber Sovereign Defense & Crisis Simulation"
  },
  {
    id: "eh-3",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
    tag: "Boardroom Roundtable",
    edition: "Executive Summit",
    title: "Digital Transformation & DPDP Boardroom Accord"
  }
];

export function EventHighlightsSection() {
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
    <section className="py-16 md:py-24 bg-[#181818] text-white relative overflow-hidden select-none border-t border-neutral-800">
      {/* Background ambient gold gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/4 w-[600px] h-[350px] rounded-full bg-[#C9A227]/5 blur-[120px]"
      />

      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10 space-y-10">
        {/* Split Header Architecture */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-neutral-800">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111]/85 border border-neutral-700/80 text-[#C9A227] text-xs font-semibold uppercase tracking-widest shadow-xl">
              <Film className="w-3.5 h-3.5" />
              <span>Conclave Media &amp; Video Highlights</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.2]">
              Event Highlights &amp; Past Summits
            </h2>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-2xl">
              Relive keynotes, high-stakes boardroom debates, and closed-door leadership sessions uniting India&apos;s top enterprise CXOs.
            </p>
          </div>

          {/* Action CTAs & Navigation Controls */}
          <div className="flex items-center gap-4 self-start lg:self-end">
            <Link
              href="/events?tab=past"
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 transition-all duration-200 shadow-xl hover:scale-105 shrink-0"
            >
              <span>View All Conclave Archives</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Slider navigation controls */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByAmount(-1)}
                disabled={!canScrollLeft}
                aria-label="Previous video highlight"
                className="w-10 h-10 rounded-full border border-neutral-700 bg-[#1E1E1E] flex items-center justify-center text-neutral-300 hover:bg-[#C9A227] hover:text-neutral-950 hover:border-[#C9A227] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none shadow-md cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(1)}
                disabled={!canScrollRight}
                aria-label="Next video highlight"
                className="w-10 h-10 rounded-full border border-neutral-700 bg-[#1E1E1E] flex items-center justify-center text-neutral-300 hover:bg-[#C9A227] hover:text-neutral-950 hover:border-[#C9A227] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none shadow-md cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Cards Grid / Carousel — ONLY Video Frames */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          >
            {defaultHighlights.map((item) => (
              <div
                key={item.id}
                className="group relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-800 hover:border-[#C9A227]/80 transition-all duration-300 hover:-translate-y-1 snap-start min-w-[290px]"
              >
                {/* Top-Left Category Badge */}
                <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/10 text-[#C9A227] text-[10px] font-bold uppercase tracking-wider shadow-md pointer-events-none">
                  {item.tag}
                </div>

                {/* Top-Right Edition Tag */}
                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/10 text-neutral-300 text-[10px] font-mono shadow-md pointer-events-none">
                  {item.edition}
                </div>

                {/* Video Element */}
                <video
                  src={item.videoUrl}
                  poster={item.posterUrl}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

