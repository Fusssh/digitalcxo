"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Shield, 
  Award, 
  Users, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BackgroundSlide {
  id: string;
  title: string;
  location: string;
  image: string;
}

// Curated DARK-TONED, high-contrast executive conclave & summit imagery (NO blinding white furniture/tables)
const HERO_BACKGROUNDS: BackgroundSlide[] = [
  {
    id: "summit-mumbai",
    title: "National CXO Strategy Summit",
    location: "Grand Hyatt, Mumbai",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=85&w=2000&auto=format&fit=crop"
  },
  {
    id: "convention-delhi",
    title: "Digital CXOS Founders' Leadership Summit",
    location: "ITC Maurya, New Delhi",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=85&w=2000&auto=format&fit=crop"
  },
  {
    id: "ciso-keynote",
    title: "CISO Cyber Defense & AI Conclave",
    location: "ITC Gardenia, Bengaluru",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=85&w=2000&auto=format&fit=crop"
  },
  {
    id: "skyline-corporate",
    title: "Enterprise Technology & Infrastructure Conclave",
    location: "HICC Novotel, Hyderabad",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=2000&auto=format&fit=crop"
  }
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_BACKGROUNDS.length) % HERO_BACKGROUNDS.length);
  }, []);

  // 6-second autoplay timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const currentSlide = HERO_BACKGROUNDS[currentIndex];

  return (
    <section 
      className="relative min-h-[92vh] pt-36 pb-20 md:pt-44 md:pb-24 overflow-hidden flex flex-col justify-between select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* VIBRANT, DARK-TONED BACKGROUND IMAGES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {HERO_BACKGROUNDS.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                isActive ? "opacity-100 z-0" : "opacity-0 z-0"
              )}
              aria-hidden={!isActive}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className={cn(
                  "object-cover object-center brightness-[0.70] contrast-[1.05] transition-transform duration-[8000ms] ease-out",
                  isActive ? "scale-105" : "scale-100"
                )}
              />
            </div>
          );
        })}

        {/* Unified contrast scrim & bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060B18]/70 via-[#060B18]/50 to-[#060B18]/90 z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060B18] via-[#060B18]/80 to-transparent z-[2]" />
      </div>

      {/* Floating Previous & Next Navigation Chevrons (Desktop Screen Edges) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 hover:border-amber-400/70 text-white hover:text-amber-300 transition-all duration-200 cursor-pointer backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95"
        aria-label="Previous background photo"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 hover:border-amber-400/70 text-white hover:text-amber-300 transition-all duration-200 cursor-pointer backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95"
        aria-label="Next background photo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* MAIN HERO CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 my-auto">
        <div className="max-w-4xl mx-auto text-center space-y-7">
          {/* Executive Movement Pill with Tricolour Accent */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/90 border border-amber-400/40 shadow-[0_0_20px_rgba(0,0,0,0.6)] text-xs font-semibold tracking-wide backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-200">CXO Leadership Community</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-200">Shaping India&apos;s Digital Future</span>
          </div>

          {/* Verbatim Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif tracking-tight leading-[1.15] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            More Than a Network — <span className="heading-gold">A Strategic Movement</span>
          </h1>

          {/* Tricolour Accent Bar with Client Official Colors */}
          <div className="mx-auto w-32 h-1 rounded-full flex overflow-hidden shadow-[0_0_15px_rgba(255,90,0,0.6)]">
            <div className="w-1/3 bg-[#FF5A00]" />
            <div className="w-1/3 bg-[#FFFFFF]" />
            <div className="w-1/3 bg-[#138808]" />
          </div>

          {/* Verbatim Hero Description with Crisp Contrast */}
          <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed font-normal text-justify sm:text-center max-w-4xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            Welcome to a purpose-driven platform where CIOs, CISOs, CTOs, CDOs and senior IT leaders unite to exchange insights, ignite innovation and address the industry&apos;s most critical challenges. Founded by accomplished CXOs, this is more than just a network. It is a trusted, high-impact community shaping India&apos;s digital future. Built by experienced leaders for the country&apos;s most visionary enterprise decision-makers, this initiative brings together those who lead transformation, secure critical infrastructure and create lasting impact at scale. We invite boardroom influencers, digital trailblazers and national change-makers to be part of this strategic movement. A collective redefining enterprise leadership for India&apos;s next digital chapter.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/membership2"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_4px_35px_rgba(16,185,129,0.6)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-semibold"
            >
              <span>Join As CXO Member</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/partnership2"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-slate-950/90 hover:bg-slate-900 text-amber-300 border border-amber-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_4px_25px_rgba(230,202,101,0.3)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-semibold"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* FLOATING STATUS & INDICATOR BAR */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
            {/* Slide Context Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/20 text-slate-200 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-white">{currentSlide.title}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">{currentSlide.location}</span>
            </div>

            {/* Slide Indicator Dots + Counter */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/20 shadow-xl">
              <div className="flex items-center gap-1.5">
                {HERO_BACKGROUNDS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                      idx === currentIndex 
                        ? "w-5 bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" 
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    )}
                    aria-label={`Go to background slide ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-300 ml-1">
                0{currentIndex + 1} / 0{HERO_BACKGROUNDS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST PILLARS (FROSTED GLASS CAPSULE PROTECTION: GUARANTEES 100% CONTRAST OVER ANY PHOTO) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-8">
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#060B18]/85 backdrop-blur-xl border border-white/15 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 shrink-0">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">High-Trust Platform</p>
                <p className="text-[11px] text-slate-300">Strictly CXO-vetted</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 shrink-0">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Peer Exchange</p>
                <p className="text-[11px] text-slate-300">Closed-door pods</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 shrink-0">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">National Impact</p>
                <p className="text-[11px] text-slate-300">Policy & AI governance</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Zero Commercial Bias</p>
                <p className="text-[11px] text-slate-300">Pure strategic value</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
