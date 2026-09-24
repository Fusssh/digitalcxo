"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, ShieldCheck, Users, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const HERO_BACKGROUND_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=85&w=2400&auto=format&fit=crop",
    alt: "Indian enterprise leaders in executive conference"
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=85&w=2400&auto=format&fit=crop",
    alt: "National leadership conclave and strategic technology summit"
  },
  {
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=85&w=2400&auto=format&fit=crop",
    alt: "CXO keynote address on enterprise digital transformation"
  },
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=2400&auto=format&fit=crop",
    alt: "Modern architectural glass enterprise headquarters"
  },
  {
    src: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=85&w=2400&auto=format&fit=crop",
    alt: "Executive boardroom strategic leadership roundtable"
  }
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Interval-based background image rotation within the dark layer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_BACKGROUND_IMAGES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden bg-[#181818] select-none">
      {/* Full-bleed executive monochrome / duotone background cycling within dark layer */}
      <div className="absolute inset-0 z-0">
        {HERO_BACKGROUND_IMAGES.map((img, idx) => (
          <div
            key={img.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              idx === currentImageIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* Subtle dark overlay for text readability without losing image color */}
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      {/* Main Full-Width Executive Layout (Eliminating empty left & right sides) */}
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 relative z-20 my-auto">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Centered Content: Authoritative Leadership Narrative & CTAs */}
          <div className="space-y-6 text-center flex flex-col items-center">
            {/* Eyebrow Label with Indian Tricolour Dots */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#111111]/85 border border-neutral-700/80 text-xs font-semibold tracking-wider uppercase text-neutral-200 shadow-xl backdrop-blur-md">
              <span className="text-[#C9A227]">CXO Leadership Platform</span>
              <span className="text-neutral-500">•</span>
              <span className="flex items-center gap-1.5">
                <span>Shaping India&apos;s Digital Economy</span>
                <span className="tricolour-dots ml-1">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
            </div>

            {/* Serif Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-[1.16]">
              More Than a Network — <br className="hidden sm:block" /><span className="italic text-[#F3E8C8]">A Strategic Movement</span>
            </h1>

            {/* Verbatim Digital CXOS Description Copy */}
            <p className="text-sm sm:text-base md:text-[17px] text-neutral-200 leading-relaxed font-normal max-w-4xl mx-auto">
              Welcome to a purpose-driven platform where CIOs, CISOs, CTOs, CDOs and senior IT leaders unite to exchange insights, ignite innovation and address the industry&apos;s most critical challenges. Founded by accomplished CXOs, this is more than just a network. It is a trusted, high-impact community shaping India&apos;s digital future. Built by experienced leaders for the country&apos;s most visionary enterprise decision-makers, this initiative brings together those who lead transformation, secure critical infrastructure and create lasting impact at scale. We invite boardroom influencers, digital trailblazers and national change-makers to be part of this strategic movement. A collective redefining enterprise leadership for India&apos;s next digital chapter.
            </p>

            {/* Executive Dual Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/membership2"
                className="w-full sm:w-auto px-7 py-3.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 transition-all duration-200 shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Explore CXO Membership</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/partnership2"
                className="w-full sm:w-auto px-7 py-3.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wider border border-[#EAE4D6]/70 hover:border-[#C9A227] text-white hover:text-[#C9A227] bg-black/40 backdrop-blur-sm transition-all duration-200 text-center"
              >
                Strategic Partnerships
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-2 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs text-neutral-300 font-medium">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[#C9A227] font-bold">✓</span>
                <span>100% Peer Vetted</span>
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[#C9A227] font-bold">✓</span>
                <span>Chatham House Rule</span>
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[#C9A227] font-bold">✓</span>
                <span>Non-Commercial Exchange</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
