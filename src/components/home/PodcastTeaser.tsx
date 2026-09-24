"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { initialPodcastsData } from "@/lib/data/podcastData";
import { PodcastEpisode } from "@/types";
import { ArrowRight, ChevronLeft, ChevronRight, Mic } from "lucide-react";

export function PodcastTeaser() {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>(initialPodcastsData);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetch("/api/admin/podcasts")
      .then((res) => res.json())
      .then((data) => {
        if (data.podcasts && Array.isArray(data.podcasts) && data.podcasts.length > 0) {
          setPodcasts(data.podcasts);
        }
      })
      .catch(() => {
        // fallback to initialPodcastsData
      });
  }, []);

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
  }, [podcasts]);

  const scrollByAmount = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth > 768 ? el.clientWidth / 2 : el.clientWidth * 0.88;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28 bg-[#181818] text-white relative overflow-hidden border-t border-neutral-800 select-none">
      {/* Background ambient gold gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-1/4 w-[500px] h-[350px] rounded-full bg-[#C9A227]/5 blur-[120px]"
      />

      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10 space-y-10">
        {/* Split Header Architecture */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-neutral-800">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111]/85 border border-neutral-700/80 text-[#C9A227] text-xs font-semibold uppercase tracking-widest shadow-xl">
              <Mic className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Thought Leadership Media</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.2]">
              Our Latest Podcast Series
            </h2>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal max-w-2xl">
              C-suite dialogues on AI disruption, cyber sovereign defense, DPDP regulations, and boardroom strategy with global thought leaders.
            </p>
          </div>

          {/* Action CTAs & Navigation Controls */}
          <div className="flex items-center gap-4 self-start lg:self-end">
            <Link
              href="/podcast"
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 transition-all duration-200 shadow-xl hover:scale-105 shrink-0"
            >
              <span>Listen &amp; Watch Full Series</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByAmount(-1)}
                disabled={!canScrollLeft}
                aria-label="Previous podcast episode"
                className="w-10 h-10 rounded-full border border-neutral-700 bg-[#1E1E1E] flex items-center justify-center text-neutral-300 hover:bg-[#C9A227] hover:text-neutral-950 hover:border-[#C9A227] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none shadow-md cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(1)}
                disabled={!canScrollRight}
                aria-label="Next podcast episode"
                className="w-10 h-10 rounded-full border border-neutral-700 bg-[#1E1E1E] flex items-center justify-center text-neutral-300 hover:bg-[#C9A227] hover:text-neutral-950 hover:border-[#C9A227] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none shadow-md cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Carousel Track */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 lg:gap-8 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          >
            {podcasts.map((pod) => {
              const ytId =
                pod.youtubeId ||
                pod.youtubeUrl?.match(/(?:v=|\/embed\/|\/watch\?v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] ||
                "dQw4w9WgXcQ";

              return (
                <div
                  key={pod.id}
                  className="w-[85vw] sm:w-[540px] md:w-[600px] lg:w-[640px] shrink-0 snap-start"
                >
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-800 hover:border-[#C9A227]/80 transition-all duration-300 group">
                    {/* Top-Left Category Tag */}
                    <div className="absolute top-3.5 left-3.5 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[#C9A227] text-[10px] font-bold uppercase tracking-wider shadow-md pointer-events-none">
                      {pod.subtitle || "Executive Series"}
                    </div>

                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                      title={pod.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


