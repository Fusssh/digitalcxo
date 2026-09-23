import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Executive3DMedallion } from "@/components/ui/Executive3DMedallion";

export function WhyDigitalCXOS() {
  return (
    <section className="relative z-20 bg-[#F7F3EA] text-[#1A1A1A] border-t border-[#EAE4D6] overflow-visible select-none">


      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* Left: Full-height image panel */}
        <div className="relative min-h-[320px] lg:min-h-full order-1 lg:order-1 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=85&w=1200&auto=format&fit=crop"
            alt="Indian business executives in strategic discussion"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center grayscale contrast-125 brightness-95"
          />
          <div className="absolute inset-0 bg-black/10" />

          {/* Floating Executive Trust Badge */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:left-8 z-10 bg-[#141414]/90 backdrop-blur-md border border-[#C9A227]/40 px-4 py-2.5 rounded-lg text-white shadow-xl">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#C9A227]">
              100% Peer Vetted
            </p>
            <p className="text-xs text-neutral-300">
              Exclusive Non-Commercial Boardroom Exchange
            </p>
          </div>
        </div>

        {/* Right: Text, vertically + horizontally centered in its half, filling width */}
        <div className="flex items-center justify-center px-6 sm:px-10 lg:px-16 py-12 md:py-16 order-2 lg:order-2 relative">
          <div className="max-w-3xl w-full text-center space-y-6 relative z-10">
            {/* Gold Eyebrow Label */}
            <div className="inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C9A227]">
              <span className="w-6 h-[1.5px] bg-[#C9A227]" />
              <span>Why Digital CXOS?</span>
              <span className="w-6 h-[1.5px] bg-[#C9A227]" />
            </div>

            {/* Serif Headline Standardized */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] tracking-tight leading-[1.2]">
              Community Is a Strategic Advantage for Modern Leaders.
            </h2>

            {/* Body copy: centered with increased font size and readability */}
            <div className="space-y-4 text-base sm:text-[17px] text-[#2C2C2C] leading-relaxed text-center">
              <p>
                Digital CXOS Private Limited is founded by accomplished leaders with decades of CXO and executive leadership experience across globally renowned, transformation-driven enterprises. The team has successfully led complex initiatives spanning Financial services, ITES, HealthTech, Aerospace, Defense, Enterprise consulting and other critical sectors.
              </p>
              <p>
                United by a shared purpose, Digital CXOS has created an Exclusive, high-trust platform for India&apos;s most influential digital leaders like CIOs, CISOs, CTOs, CDOs, Chief Strategy Officers, Chief Innovation Officers and others shaping enterprise technology and cybersecurity. This CXO-led community fosters cross-industry collaboration, strategic knowledge exchange and collective leadership, strengthening the digital leadership ecosystem and contributing meaningfully to a secure, future-ready digital economy for the nation.
              </p>
            </div>

            {/* Executive Credo Metrics to Fill Horizontal Space */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-3 border-t border-[#EAE4D6]">
              <div className="p-3 bg-[#F4EFE4] rounded text-center">
                <span className="block text-lg sm:text-xl font-bold font-serif text-[#1A1A1A]">100%</span>
                <span className="text-[10px] sm:text-xs text-[#666666] uppercase tracking-wider font-semibold">Peer Vetted</span>
              </div>
              <div className="p-3 bg-[#F4EFE4] rounded text-center">
                <span className="block text-lg sm:text-xl font-bold font-serif text-[#1A1A1A]">12+</span>
                <span className="text-[10px] sm:text-xs text-[#666666] uppercase tracking-wider font-semibold">Critical Sectors</span>
              </div>
              <div className="p-3 bg-[#F4EFE4] rounded text-center">
                <span className="block text-lg sm:text-xl font-bold font-serif text-[#1A1A1A]">Chatham</span>
                <span className="text-[10px] sm:text-xs text-[#666666] uppercase tracking-wider font-semibold">House Rule</span>
              </div>
            </div>

            {/* Learn More Link */}
            <div className="pt-2 flex justify-center">
              <Link
                href="/about"
                className="inline-flex items-center text-sm sm:text-base font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#C9A227] transition-colors chevron-link"
              >
                Learn More About Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}