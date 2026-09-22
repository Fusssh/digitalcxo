import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ExperienceCard {
  title: string;
  description: string;
  borderColor: "gold" | "blue";
  href: string;
}

const EXPERIENCE_CARDS: ExperienceCard[] = [
  {
    title: "CXO Mentorship & Peer Learning Circles",
    description: "Establish mentoring circles and peer learning pods where experienced CXOs guide emerging leaders and regularly exchange insights on industry challenges.",
    borderColor: "gold",
    href: "/initiatives"
  },
  {
    title: "Strategic Workshops & AI Literacy Programs",
    description: "Offer focused workshops and webinars on cybersecurity, digital transformation, AI, crisis leadership and practical AI adoption strategies tailored for business executives.",
    borderColor: "blue",
    href: "/initiatives"
  },
  {
    title: "Conduct Crisis Simulation Labs",
    description: "Run boardroom-style simulations to enhance CXO decision-making during cyberattacks, system failures and reputational crises.",
    borderColor: "gold",
    href: "/initiatives"
  },
  {
    title: "Cross-Industry Collaborative Innovation Labs",
    description: "Establish labs where CXOs from different industries co-develop innovative solutions addressing shared challenges, fostering cross-sector learning and breakthrough initiatives.",
    borderColor: "blue",
    href: "/initiatives"
  }
];

export function MemberExperienceGrid() {
  return (
    <section className="py-20 md:py-28 bg-[#F7F3EA] text-[#1A1A1A] border-t border-[#EAE4D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Tall Duotone Photo Running Alongside */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=85&w=1200&auto=format&fit=crop"
                alt="Executive strategy session"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center grayscale contrast-125 brightness-95"
              />
            </div>
          </div>

          {/* Right Column: Title & 4 Cards with Left Border Accents */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
                Purpose-Driven Value
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1A1A] tracking-tight leading-[1.2]">
                What Members Experience
              </h2>
              <p className="text-base text-[#444444] max-w-xl">
                Integrated peer connection, sovereign knowledge exchange, and leadership development designed to support CXOs over time.
              </p>
            </div>

            {/* Grid of 4 Cream Cards with Alternating Left-Border Accents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {EXPERIENCE_CARDS.map((card, idx) => (
                <Link
                  key={idx}
                  href={card.href}
                  className={`group block bg-[#FDFAF3] p-6 rounded-sm shadow-md hover:shadow-xl border border-[#EAE4D6] transition-all duration-300 transform hover:-translate-y-1 ${
                    card.borderColor === "gold" ? "border-l-4 border-l-[#C9A227]" : "border-l-4 border-l-[#2B5C8F]"
                  }`}
                >
                  <h3 className="text-base font-bold font-sans text-[#1A1A1A] group-hover:text-[#C9A227] transition-colors flex items-start justify-between gap-2">
                    <span>{card.title}</span>
                    <span className="text-[#C9A227] font-bold text-lg leading-none shrink-0 group-hover:translate-x-1 transition-transform">
                      ›
                    </span>
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-[#555555] leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                </Link>
              ))}
            </div>

            {/* View All Initiatives CTA */}
            <div className="pt-2">
              <Link
                href="/initiatives"
                className="inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#C9A227] transition-colors chevron-link"
              >
                Explore All 12 Strategic Initiatives
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
