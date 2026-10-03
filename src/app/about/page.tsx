import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { TeamTeaser } from "@/components/home/TeamTeaser";
import { Shield, Award } from "lucide-react";

export const metadata = {
  title: "About Us — Digital CXOS | Purpose, Mission & Leadership",
  description: "Digital CXOS Private Limited is founded by accomplished leaders with decades of CXO and executive leadership experience across globally renowned enterprises.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Page Hero */}
      <PageHero
        title="About Digital CXOS"
        subtitle="An exclusive, high-trust platform for India's most influential digital leaders shaping enterprise technology and cybersecurity."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      {/* Main Narrative Section (LIGHT CREAM) */}
      <section className="py-12 md:py-16 bg-[#F7F3EA] text-[#1A1A1A] border-t border-[#EAE4D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Our Founding Legacy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
              Decades of Executive Transformation
            </h2>

            <div className="space-y-4 text-base text-[#333333] leading-relaxed text-justify sm:text-left">
              <p>
                Digital CXOS Private Limited is founded by accomplished leaders with decades of CXO and executive leadership experience across globally renowned, transformation-driven enterprises. The team has successfully led complex initiatives spanning Financial services, ITES, HealthTech, Aerospace, Defense, Enterprise consulting and other critical sectors.
              </p>

              <p>
                United by a shared purpose, Digital CXOS has created an Exclusive, high-trust platform for India&apos;s most influential digital leaders like CIOs, CISOs, CTOs, CDOs, Chief Strategy Officers, Chief Innovation Officers and others shaping enterprise technology and cyber security. This CXO-led community fosters cross-industry collaboration, strategic knowledge exchange and collective leadership, strengthening the digital leadership ecosystem and contributing meaningfully to a secure, future-ready digital economy for the nation.
              </p>

              <p>
                The platform continuously evolves to meet the dynamic challenges of the digital era, ensuring its members remain at the forefront of innovation and excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <TeamTeaser />
    </div>
  );
}
