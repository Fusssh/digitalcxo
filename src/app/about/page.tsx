import React from "react";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ValuesPillars } from "@/components/home/ValuesPillars";
import { leadershipTeam } from "@/lib/data/teamData";
import { Shield, ArrowRight, Award, Layers } from "lucide-react";

export const metadata = {
  title: "About Us — Digital CXOS | Purpose, Mission & Leadership",
  description: "Digital CXOS Private Limited is founded by accomplished leaders with decades of CXO and executive leadership experience across globally renowned enterprises.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060B18]">
      {/* Page Hero */}
      <PageHero
        title="About Digital CXOS"
        subtitle="An exclusive, high-trust platform for India's most influential digital leaders shaping enterprise technology and cybersecurity."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      {/* Main Narrative Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Our Founding Legacy</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif heading-gold">
                Decades of Executive Transformation
              </h2>

              <div className="space-y-5 text-sm sm:text-base text-slate-300 leading-relaxed text-justify">
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
              <div className="rounded-2xl glass-panel-gold p-8 border border-amber-400/30 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Institutional Trust
                    </p>
                    <p className="text-lg font-bold font-serif text-slate-100">
                      Sovereign Impact
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-2xl font-bold font-serif text-amber-300">100%</span>
                    <p className="text-xs text-slate-300 mt-0.5">Vetted CXO Membership</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-2xl font-bold font-serif text-emerald-400">4 Metro Hubs</span>
                    <p className="text-xs text-slate-300 mt-0.5">Delhi NCR, Mumbai, Bangalore, Chennai</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-2xl font-bold font-serif text-sky-400">6 Key Sectors</span>
                    <p className="text-xs text-slate-300 mt-0.5">BFSI, IT, Manufacturing, Telecom, Consulting, AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Core Values Section */}
      <ValuesPillars />

      {/* Leadership Team Section */}
      <section className="py-24 bg-gradient-to-b from-[#050914] to-[#060B18] relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
              Executive Guidance
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif heading-gold mt-2">
              Meet Our Leadership Team
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Behind every successful vision is a team of leaders who inspire growth, innovation and trust. Meet the minds shaping the future of digital transformation at Digital CXOS.
            </p>
            <div className="mt-4 mx-auto w-20 h-0.5 rounded-full bg-gradient-to-r from-[#FF9933] via-white/80 to-[#138808]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadershipTeam.map((member) => (
              <Link
                key={member.slug}
                href={`/team/${member.slug}`}
                className="group relative rounded-2xl glass-panel p-6 border border-white/10 hover:border-amber-400/50 hover:bg-[#0A1433] transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#12234F] to-[#0A122B] border border-amber-400/30 flex items-center justify-center text-amber-300 font-serif font-bold text-lg shadow-inner group-hover:scale-105 transition-transform">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                      Leadership
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-slate-100 group-hover:text-amber-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-medium mt-1">
                    {member.role}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {member.sectors.map((sec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-amber-200">
                  <span>Click to view profile.</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
