"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { MapPin, Mail, Globe, User, Shield, ArrowRight, ShieldCheck, Award } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative bg-[#0E0E0E] text-neutral-300 border-t border-neutral-800 pt-16 pb-12 overflow-hidden select-none">
      {/* Sovereign Indian Tricolour Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 space-y-12">
        {/* Full-Width Executive Council Dispatch Banner */}
        <div className="bg-[#161616] border border-neutral-800 rounded-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C9A227]">
              <span className="w-4 h-[1px] bg-[#C9A227]" />
              <span>Executive Dispatch &amp; Briefings</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Shaping India&apos;s Sovereign Enterprise Technology Agenda
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Curated strategic benchmarks, Chatham House conclave summaries, and peer intelligence for visionary CIOs, CISOs, CTOs, and CDOs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/membership2"
              className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 transition-all duration-200 shadow-xl hover:scale-105"
            >
              <span>Apply for CXO Access</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded text-xs sm:text-sm font-semibold uppercase tracking-wider border border-neutral-700 hover:border-neutral-500 text-neutral-200 hover:text-white transition-colors"
            >
              <span>Contact Secretariat</span>
            </Link>
          </div>
        </div>

        {/* Main 4-Column Footer Grid Spanning Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-neutral-800/90">
          {/* Column 1: Brand & National Headquarters (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Logo size="lg" showTagline={true} theme="dark" />
            <p className="text-sm sm:text-base leading-relaxed text-neutral-300">
              Digital CXOS Private Limited is India&apos;s premier, exclusive peer-led community uniting CIOs, CISOs, CTOs, CDOs, and senior technology strategists to accelerate national digital transformation and sovereign cyber resilience.
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-neutral-300 pt-1">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-1" />
                <p className="leading-relaxed">
                  <strong className="text-white">National Registered Secretariat:</strong><br />
                  Embassy Galaxy Business Park, Tower-B, 1st Floor,<br />
                  A-44 &amp; 45, Sushil Marg, Sector 62, Noida, NCR – 201309
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a href="mailto:contact@digitalcxos.com" className="hover:text-[#C9A227] transition-colors text-neutral-200 font-medium">
                  contact@digitalcxos.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a href="https://www.digitalcxos.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A227] transition-colors text-neutral-200 font-medium">
                  www.digitalcxos.com
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/membership2"
                className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-neutral-950 transition-all duration-200"
              >
                <User className="w-3.5 h-3.5" />
                <span>Executive Member Portal</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Executive Ecosystem Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm uppercase tracking-widest font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-2.5">
              <span className="text-[#C9A227] font-bold">›</span>
              <span>Executive Ecosystem</span>
            </h4>
            <ul className="space-y-3 text-sm sm:text-[15px]">
              <li>
                <Link href="/about" className="hover:text-[#C9A227] transition-colors text-neutral-300 hover:translate-x-1 inline-flex items-center gap-1.5">
                  <span>About Our Credo &amp; Mission</span>
                </Link>
              </li>
              <li>
                <Link href="/initiatives" className="hover:text-[#C9A227] transition-colors text-neutral-300 hover:translate-x-1 inline-flex items-center gap-1.5">
                  <span>12 Strategic Initiatives</span>
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#C9A227] transition-colors text-neutral-300 hover:translate-x-1 inline-flex items-center gap-1.5">
                  <span>Leadership Conclaves &amp; Roundtables</span>
                </Link>
              </li>
              <li>
                <Link href="/podcast" className="hover:text-[#C9A227] transition-colors text-neutral-300 hover:translate-x-1 inline-flex items-center gap-1.5">
                  <span>Voices of Transformation Podcast</span>
                </Link>
              </li>
              <li>
                <Link href="/membership2" className="hover:text-[#C9A227] transition-colors text-neutral-300 hover:translate-x-1 inline-flex items-center gap-1.5">
                  <span>CXO Council Membership</span>
                </Link>
              </li>
              <li>
                <Link href="/partnership2" className="hover:text-[#C9A227] transition-colors text-neutral-300 hover:translate-x-1 inline-flex items-center gap-1.5">
                  <span>Strategic Enterprise Partners</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C9A227] transition-colors text-neutral-300 hover:translate-x-1 inline-flex items-center gap-1.5">
                  <span>Secretariat Contact &amp; Inquiries</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: National Chapters & Regional Conclaves (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm uppercase tracking-widest font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-2.5">
              <span className="text-[#C9A227] font-bold">›</span>
              <span>National Chapter Hubs</span>
            </h4>
            <ul className="space-y-3 text-sm sm:text-[15px]">
              <li>
                <Link href="/chapters/delhi-ncr" className="hover:text-[#C9A227] transition-colors block text-neutral-300">
                  <span className="font-semibold text-white">Delhi-NCR Sovereign Chapter</span>
                  <span className="block text-xs text-neutral-400">National Policy, Cyber Law &amp; Governance</span>
                </Link>
              </li>
              <li>
                <Link href="/chapters/mumbai" className="hover:text-[#C9A227] transition-colors block text-neutral-300">
                  <span className="font-semibold text-white">Mumbai Financial Chapter</span>
                  <span className="block text-xs text-neutral-400">BFSI, Capital Markets &amp; FinTech Security</span>
                </Link>
              </li>
              <li>
                <Link href="/chapters/bangalore" className="hover:text-[#C9A227] transition-colors block text-neutral-300">
                  <span className="font-semibold text-white">Bengaluru Innovation Chapter</span>
                  <span className="block text-xs text-neutral-400">DeepTech, Enterprise AI &amp; Cloud Sovereignty</span>
                </Link>
              </li>
              <li>
                <Link href="/chapters/chennai" className="hover:text-[#C9A227] transition-colors block text-neutral-300">
                  <span className="font-semibold text-white">Chennai Industrial Chapter</span>
                  <span className="block text-xs text-neutral-400">Manufacturing, Industrial IoT &amp; Critical Infrastructure</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance, DPDP & Social (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm uppercase tracking-widest font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-2.5">
              <span className="text-[#C9A227] font-bold">›</span>
              <span>Governance</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-300">
              <li className="flex items-center gap-1.5 text-xs text-[#C9A227] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Chatham House Code</span>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-[#C9A227] font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>DPDP 2023 Compliant</span>
              </li>
              <li className="pt-1">
                <Link href="/privacy-policy" className="hover:text-[#C9A227] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#C9A227] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#C9A227] transition-colors">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Executive Channels:
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://linkedin.com/company/digitalcxos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Digital CXOS on LinkedIn"
                  className="w-8 h-8 rounded-full border border-neutral-700 hover:border-[#C9A227] flex items-center justify-center text-neutral-300 hover:text-[#C9A227] hover:bg-neutral-800 transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@digitalcxos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Digital CXOS on YouTube"
                  className="w-8 h-8 rounded-full border border-neutral-700 hover:border-[#C9A227] flex items-center justify-center text-neutral-300 hover:text-[#C9A227] hover:bg-neutral-800 transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Full-Width Copyright & Sovereign Motto */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-neutral-400 gap-4">
          <p>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> Digital CXOS Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-neutral-300 font-medium">Leadership Beyond Boundaries</span>
            <span className="tricolour-dots">
              <span />
              <span />
              <span />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
