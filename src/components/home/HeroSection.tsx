"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden bg-[#181818] select-none">
      {/* Full-bleed executive monochrome / duotone background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=85&w=2000&auto=format&fit=crop"
          alt="Indian enterprise leaders in executive conference"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.25] contrast-[1.15] grayscale"
        />
        {/* Subtle executive gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#141414]/90 via-[#181818]/60 to-[#181818] z-10" />
      </div>

      {/* Main Hero Typography */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center my-auto space-y-7">
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

        {/* Serif Headline (Exec Club style large Palatino/Source Serif) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-[1.18] max-w-4xl mx-auto">
          More Than a Network — <span className="italic text-[#F3E8C8]">A Strategic Movement</span>
        </h1>

        {/* Verbatim Digital CXOS Description Copy */}
        <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-normal max-w-3xl mx-auto text-justify sm:text-center">
          Welcome to a purpose-driven platform where CIOs, CISOs, CTOs, CDOs and senior IT leaders unite to exchange insights, ignite innovation and address the industry&apos;s most critical challenges. Founded by accomplished CXOs, this is more than just a network. It is a trusted, high-impact community shaping India&apos;s digital future. Built by experienced leaders for the country&apos;s most visionary enterprise decision-makers, this initiative brings together those who lead transformation, secure critical infrastructure and create lasting impact at scale. We invite boardroom influencers, digital trailblazers and national change-makers to be part of this strategic movement. A collective redefining enterprise leadership for India&apos;s next digital chapter.
        </p>
      </div>

      {/* Pattern 1 CTA Card: Single Cream-Boxed Card at Hero Bottom (Exact Exec Club Screenshot Pattern) */}
      <div className="relative z-20 max-w-md mx-auto w-full px-4 pt-6">
        <Link
          href="/membership2"
          className="group block bg-[#F7F3EA] text-[#1A1A1A] border-2 border-[#E2DAC8] hover:border-[#C9A227] rounded-sm p-5 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center"
        >
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold font-serif text-[#1A1A1A] group-hover:text-[#C9A227] transition-colors">
              Explore Membership
            </h3>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#555555] group-hover:text-[#1A1A1A]">
              <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Email: contact@digitalcxos.com</span>
              <span className="text-[#C9A227] font-bold">›</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
