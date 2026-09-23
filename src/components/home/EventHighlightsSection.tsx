"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Film, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface EventHighlight {
  id: string;
  videoUrl: string;
  tag: string;
  title: string;
  location: string;
  edition: string;
  summary: string;
  attendees: string;
}

const defaultHighlights: EventHighlight[] = [
  {
    id: "eh-1",
    videoUrl: "https://www.digitalcxos.com/wp-content/uploads/2026/04/video2-1.png",
    tag: "Flagship Conclave",
    title: "Digital CXOS National Conclave — The Sovereign AI Era",
    location: "Mumbai",
    edition: "2026 Annual Conclave",
    summary: "Visionary keynotes and closed-door debates exploring enterprise AI sovereignty, data governance, and Boardroom IT strategy.",
    attendees: "120+ Enterprise Leaders"
  },
  {
    id: "eh-2",
    videoUrl: "https://www.digitalcxos.com/wp-content/uploads/2026/04/video1.png",
    tag: "Security Summit",
    title: "Enterprise Cyber Sovereign Defense & Crisis Simulation",
    location: "Bengaluru",
    edition: "Cyber Defense Conclave",
    summary: "Real-time ransomware simulation drills and crisis management protocols conducted under the strict Chatham House Rule.",
    attendees: "90+ Security Leaders"
  },
  {
    id: "eh-3",
    videoUrl: "https://www.digitalcxos.com/wp-content/uploads/2026/08/cxos3.png",
    tag: "Boardroom Roundtable",
    title: "Digital Transformation & DPDP Boardroom Accord",
    location: "New Delhi",
    edition: "Executive Summit",
    summary: "High-trust peer dialogues uniting enterprise technology architects to address regulatory compliance and next-gen infrastructure.",
    attendees: "75+ Enterprise CXOs"
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

      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10 space-y-12">
        {/* Split Header Architecture */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-neutral-800">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 transition-all duration-200 shadow-xl hover:scale-105"
            >
              <span>View All Conclave Archives</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Slider navigation controls (for future-proof scrolling when 3+ videos exist) */}
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

        {/* Video Cards Grid / Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          >
            {defaultHighlights.map((item) => (
              <div
                key={item.id}
                className="group bg-[#1E1E1E] rounded-xl overflow-hidden border border-neutral-800 hover:border-[#C9A227]/70 shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 snap-start min-w-[290px]"
              >
                {/* 16:9 Video Player Container */}
                <div className="relative w-full aspect-video bg-black overflow-hidden border-b border-neutral-800">
                  {/* Top-Left Category Badge */}
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-[#181818]/90 backdrop-blur-md border border-white/10 text-[#C9A227] text-[10px] font-bold uppercase tracking-wider shadow-md pointer-events-none">
                    {item.tag}
                  </div>

                  {/* Top-Right Edition Tag */}
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-neutral-300 text-[10px] font-mono shadow-md pointer-events-none">
                    {item.edition}
                  </div>

                  {/* Native HTML5 Video Element preserving user's exact required URL */}
                  <video
                    src={item.videoUrl}
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Content Metadata Frame */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-3">
                    {/* Location & Attendance Metadata Bar */}
                    <div className="flex items-center gap-4 text-xs text-neutral-400">
                      <span className="inline-flex items-center gap-1.5 text-[#C9A227] font-semibold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.location}</span>
                      </span>
                      <span className="w-1 h-1 rounded-full bg-neutral-600" />
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{item.attendees}</span>
                      </span>
                    </div>

                    {/* Conclave Title */}
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-[#C9A227] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Synopsis */}
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <Link
                      href="/events?tab=past"
                      className="text-xs font-bold uppercase tracking-wider text-[#C9A227] group-hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2"
                    >
                      <span>Watch Full Conclave Coverage</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      Recorded
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
