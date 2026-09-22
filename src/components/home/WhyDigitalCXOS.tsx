import React from "react";
import Link from "next/link";
import Image from "next/image";

export function WhyDigitalCXOS() {
  return (
    <section className="py-20 md:py-28 bg-[#F7F3EA] text-[#1A1A1A] border-t border-[#EAE4D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & Eyebrow */}
          <div className="lg:col-span-7 space-y-6">
            {/* Gold Eyebrow Label */}
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
              Why Digital CXOS?
            </span>

            {/* Large Serif Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] leading-[1.18] tracking-tight">
              Community Is a Strategic Advantage for Modern Leaders.
            </h2>

            {/* Verbatim Digital CXOS About Us Copy (High Contrast Dark Text) */}
            <div className="space-y-4 text-base sm:text-lg text-[#333333] leading-relaxed text-justify sm:text-left">
              <p>
                Digital CXOS Private Limited is founded by accomplished leaders with decades of CXO and executive leadership experience across globally renowned, transformation-driven enterprises. The team has successfully led complex initiatives spanning Financial services, ITES, HealthTech, Aerospace, Defense, Enterprise consulting and other critical sectors.
              </p>
              <p>
                United by a shared purpose, Digital CXOS has created an Exclusive, high-trust platform for India&apos;s most influential digital leaders like CIOs, CISOs, CTOs, CDOs, Chief Strategy Officers, Chief Innovation Officers and others shaping enterprise technology and cybersecurity. This CXO-led community fosters cross-industry collaboration, strategic knowledge exchange and collective leadership, strengthening the digital leadership ecosystem and contributing meaningfully to a secure, future-ready digital economy for the nation.
              </p>
            </div>

            {/* Learn More Link with Gold Chevron */}
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#C9A227] transition-colors chevron-link"
              >
                Learn More About Our Story
              </Link>
            </div>
          </div>

          {/* Right Column: B&W / Duotone Photo of Business Leaders in Conversation */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-sm overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=85&w=1200&auto=format&fit=crop"
                alt="Indian business executives in strategic discussion"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center grayscale contrast-125 brightness-95 hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
