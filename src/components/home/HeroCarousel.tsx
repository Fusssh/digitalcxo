"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Shield,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  tagline: string;
  image: string;
  ctaLink: string;
  ctaText: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "summit-mumbai",
    title: "National CXO Strategy Summit",
    category: "Annual Flagship Conclave",
    location: "Grand Hyatt, Mumbai",
    date: "14–15 November 2026",
    tagline: "Architecting Sovereign Tech Stacks & Generative AI for India Inc.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1400&auto=format&fit=crop",
    ctaLink: "/events",
    ctaText: "Explore Conclave Agenda"
  },
  {
    id: "ciso-bengaluru",
    title: "CISO Cyber Defense Conclave",
    category: "Closed-Door Security Forum",
    location: "ITC Gardenia, Bengaluru",
    date: "19 December 2026",
    tagline: "Zero Trust, Quantum Preparedness & Enterprise Resilience.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1400&auto=format&fit=crop",
    ctaLink: "/events",
    ctaText: "View Security Pods"
  },
  {
    id: "retreat-manesar",
    title: "Digital CXOS Horizon 2026",
    category: "Signature Residential Retreat",
    location: "Resort Country Club, Manesar, Gurugram",
    date: "30–31 January 2026",
    tagline: "Leadership Conversations Beyond the Boardroom... Thoughtful Experiences for Spouses.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1400&auto=format&fit=crop",
    ctaLink: "/events",
    ctaText: "Discover Retreat Highlights"
  },
  {
    id: "ai-hyderabad",
    title: "AI & Sovereign Tech Conclave 2027",
    category: "Emerging Tech & Infrastructure",
    location: "HICC Novotel, Hyderabad",
    date: "23–24 January 2027",
    tagline: "Frontier Foundation Models, Digital Public Infrastructure & Sovereign Cloud.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1400&auto=format&fit=crop",
    ctaLink: "/events",
    ctaText: "Review Sovereign AI Track"
  }
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch gesture handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto mt-12 mb-8 group/carousel select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Outer Glow Halo */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 via-blue-600/15 to-emerald-500/20 blur-xl opacity-70 group-hover/carousel:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Main Glassmorphic Carousel Frame */}
      <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#081026]/90 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        {/* Slides Container (Aspect Ratio 16:9 on Mobile, 21:9 on Desktop) */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-slate-950">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                  isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                )}
                aria-hidden={!isActive}
              >
                {/* Background Image with Ken Burns Zoom */}
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className={cn(
                    "object-cover transition-transform duration-[8000ms] ease-out",
                    isActive ? "scale-105" : "scale-100"
                  )}
                />

                {/* Multilayered Gradient Overlays for High Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-[#060B18]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060B18]/90 via-[#060B18]/40 to-transparent" />

                {/* Slide Content Overlay */}
                <div className="absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-between z-20">
                  {/* Top Bar Badges */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-400/40 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                        {slide.category}
                      </span>
                    </div>

                    <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-[11px] text-slate-300 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{slide.date}</span>
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="inline-flex sm:hidden items-center gap-1.5 text-amber-300 text-xs font-semibold">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{slide.date}</span>
                    </div>

                    <p className="text-xs uppercase tracking-wider font-bold text-amber-400/90 drop-shadow-sm">
                      {slide.tagline}
                    </p>

                    <h3 className="text-xl sm:text-3xl md:text-4xl font-bold font-serif text-white tracking-tight leading-tight drop-shadow-md">
                      {slide.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{slide.location}</span>
                      </span>

                      <Link
                        href={slide.ctaLink}
                        className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200 transition-colors group/link"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Navigation Bar (Bottom Floating Strip) */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-30 flex items-center gap-3">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                  idx === currentIndex 
                    ? "w-6 bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
                    : "w-2 bg-white/30 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
            <span className="text-[10px] font-mono font-bold text-slate-400 ml-1.5">
              0{currentIndex + 1} / 0{HERO_SLIDES.length}
            </span>
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/15 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/15 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
