import React from "react";
import Link from "next/link";
import Image from "next/image";

export function WhyDigitalCXOS() {
  return (
    <section className="relative z-20 bg-[#F7F3EA] text-[#1A1A1A] border-t border-[#EAE4D6] overflow-visible select-none">
      {/* ===== TEXT (TOP) ===== */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-12 md:pb-16">
        {/* Eyebrow + Headline */}
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-5">
          <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C9A227]">
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#C9A227]" />
            <span>Why Digital CXOS?</span>
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#C9A227]" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#1A1A1A] tracking-tight leading-[1.2]">
            Community Is a Strategic Advantage for Modern Leaders.
          </h2>

          <span className="block w-12 sm:w-16 h-[1.5px] bg-[#C9A227]/70 mx-auto" />
        </div>

        {/* Responsive body copy: aligned, clean line height */}
        <div
          className="mt-8 sm:mt-10 md:mt-12 max-w-4xl mx-auto space-y-5 sm:space-y-6 text-sm sm:text-base md:text-lg text-[#2C2C2C] leading-relaxed md:leading-[1.85] text-left sm:text-justify"
          style={{
            hyphens: "none",
            WebkitHyphens: "none",
            wordBreak: "normal",
            overflowWrap: "normal",
          }}
        >
          <p>
            Digital CXOS Private Limited is founded by accomplished leaders with decades of CXO and executive leadership experience across globally renowned, transformation-driven enterprises. The team has successfully led complex initiatives spanning Financial services, ITES, HealthTech, Aerospace, Defense, Enterprise consulting and other critical sectors.
          </p>
          <p>
            United by a shared purpose, Digital CXOS has created an Exclusive, high-trust platform for India&apos;s most influential digital leaders like CIOs, CISOs, CTOs, CDOs, Chief Strategy Officers, Chief Innovation Officers and others shaping enterprise technology and cybersecurity. This CXO-led community fosters cross-industry collaboration, strategic knowledge exchange and collective leadership, strengthening the digital leadership ecosystem and contributing meaningfully to a secure, future-ready digital economy for the nation.
          </p>
        </div>

        {/* Metrics: responsive grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4 max-w-4xl mx-auto pt-6 sm:pt-8 border-t border-[#EAE4D6]">
          <div className="p-2.5 sm:p-3.5 bg-[#F4EFE4] rounded text-center">
            <span className="block text-base sm:text-xl md:text-2xl font-bold font-serif text-[#1A1A1A]">100%</span>
            <span className="text-[9px] sm:text-xs text-[#666666] uppercase tracking-wider font-semibold">Peer Vetted</span>
          </div>
          <div className="p-2.5 sm:p-3.5 bg-[#F4EFE4] rounded text-center">
            <span className="block text-base sm:text-xl md:text-2xl font-bold font-serif text-[#1A1A1A]">12+</span>
            <span className="text-[9px] sm:text-xs text-[#666666] uppercase tracking-wider font-semibold">Critical Sectors</span>
          </div>
          <div className="p-2.5 sm:p-3.5 bg-[#F4EFE4] rounded text-center">
            <span className="block text-base sm:text-xl md:text-2xl font-bold font-serif text-[#1A1A1A]">Chatham</span>
            <span className="text-[9px] sm:text-xs text-[#666666] uppercase tracking-wider font-semibold">House Rule</span>
          </div>
        </div>

        {/* Learn More Link */}
        <div className="pt-6 sm:pt-8 flex justify-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#C9A227] transition-colors chevron-link"
          >
            Learn More About Our Story
          </Link>
        </div>
      </div>

      {/* ===== IMAGE (BOTTOM, full-width banner) ===== */}
      <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[480px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=85&w=1920&auto=format&fit=crop"
          alt="Indian business executives in strategic discussion"
          fill
          sizes="100vw"
          className="object-cover object-center grayscale contrast-125 brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>
    </section>
  );
}