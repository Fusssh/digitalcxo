import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Award, CheckCircle } from "lucide-react";

export function AboutTeaser() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#060B18] to-[#080F24] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Who We Are</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif heading-gold">
              About Digital CXOS
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed text-justify">
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

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors group"
              >
                <span>Learn more about our vision & leadership team</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Executive Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl glass-panel-gold p-8 border border-amber-400/30 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Leadership Credo</p>
                    <p className="text-base font-bold font-serif text-slate-100">Enterprise Excellence</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                  CXO Exclusive
                </span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Curated for CIOs, CISOs, CTOs, CDOs & Chief Strategy Officers</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sovereign Cyber Resilience, Zero-Trust & DPDP Frameworks</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Cross-sector synergy across BFSI, HealthTech, Defense & Manufacturing</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>National Chapter network in Delhi NCR, Mumbai, Bangalore, Chennai</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold font-serif text-amber-300">25+ Years</p>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Average Leadership Depth</p>
                </div>
                <Link
                  href="/membership2"
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  Join Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
