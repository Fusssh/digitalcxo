import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { OngoingPlatformSection } from "@/components/home/OngoingPlatformSection";
import { leadershipTeam } from "@/lib/data/teamData";
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
      <section className="py-20 md:py-28 bg-[#F7F3EA] text-[#1A1A1A] border-t border-[#EAE4D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
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

            {/* Right Column Metric Callout */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FDFAF3] p-8 rounded-sm border border-[#EAE4D6] shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#666666] font-bold">
                      Institutional Trust
                    </p>
                    <p className="text-lg font-bold font-serif text-[#1A1A1A]">
                      Sovereign Impact
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-sm bg-white border border-[#EAE4D6]">
                    <span className="text-2xl font-bold font-serif text-[#C9A227]">100%</span>
                    <p className="text-xs text-[#555555] mt-0.5">Vetted CXO Membership</p>
                  </div>
                  <div className="p-4 rounded-sm bg-white border border-[#EAE4D6]">
                    <span className="text-2xl font-bold font-serif text-[#1A1A1A]">4 Metro Hubs</span>
                    <p className="text-xs text-[#555555] mt-0.5">Delhi NCR, Mumbai, Bangalore, Chennai</p>
                  </div>
                  <div className="p-4 rounded-sm bg-white border border-[#EAE4D6]">
                    <span className="text-2xl font-bold font-serif text-[#2B5C8F]">6 Key Sectors</span>
                    <p className="text-xs text-[#555555] mt-0.5">BFSI, IT, Manufacturing, Telecom, Consulting, AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Core Values Section (DARK) */}
      <div id="values">
        <OngoingPlatformSection />
      </div>

      {/* Leadership Team Section (LIGHT CREAM) */}
      <section id="leadership" className="py-24 bg-[#F7F3EA] text-[#1A1A1A] border-t border-[#EAE4D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C9A227]">
              Executive Guidance
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1A1A1A]">
              Meet Our Leadership Team &amp; Advisors
            </h2>
            <p className="text-sm sm:text-base text-[#444444] leading-relaxed max-w-2xl mx-auto">
              Behind every successful vision is a team of leaders who inspire growth, innovation and trust. Meet the minds shaping the future of digital transformation at Digital CXOS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipTeam.map((member) => (
              <Link
                key={member.slug}
                href={`/team/${member.slug}`}
                className="group block bg-[#FDFAF3] rounded-sm overflow-hidden border border-[#EAE4D6] shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-[#C9A227] font-serif text-3xl font-bold">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[28px] border-r-[28px] border-t-transparent border-r-[#C9A227]/60" />
                </div>

                <div className="p-6 space-y-2.5">
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A] group-hover:text-[#C9A227] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
                    {member.role}
                  </p>
                  <p className="text-xs text-[#666666] line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#EAE4D6] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A] group-hover:text-[#C9A227]">
                    <span>View Profile</span>
                    <span className="text-[#C9A227] text-base group-hover:translate-x-1 transition-transform">›</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
