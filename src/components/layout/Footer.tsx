import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { MapPin, Mail, Globe, User, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#111111] text-neutral-300 border-t border-neutral-800 pt-16 pb-12 overflow-hidden">
      {/* Subtle Top Tricolour Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-neutral-800">
          {/* Column 1: Brand & Headquarters */}
          <div className="lg:col-span-4 space-y-5">
            <Logo size="md" showTagline={true} theme="dark" />
            <p className="text-sm leading-relaxed text-neutral-400">
              Welcome to Digital CXOS Private Limited, an exclusive, high-trust platform where CIOs, CISOs, CTOs, CDOs and senior IT leaders unite to shape India&apos;s digital future.
            </p>

            <div className="space-y-2 text-xs text-neutral-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Digital CXOS Private Limited<br />
                  Embassy Galaxy Business Park, Tower-B, 1st Floor,<br />
                  A-44 & 45, Sushil Marg, Sector 62, Noida – 201309
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a href="mailto:contact@digitalcxos.com" className="hover:text-[#C9A227] transition-colors">
                  contact@digitalcxos.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a href="https://www.digitalcxos.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A227] transition-colors">
                  www.digitalcxos.com
                </a>
              </div>
            </div>

            {/* Member Portal Button */}
            <div className="pt-2">
              <Link
                href="/membership2"
                className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-neutral-950 transition-all duration-200"
              >
                <User className="w-3.5 h-3.5" />
                <span>Member Portal</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white flex items-center gap-1.5">
              <span className="text-[#C9A227] font-bold">›</span>
              <span>Useful Links</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#C9A227] transition-colors text-neutral-400 hover:translate-x-0.5 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/initiatives" className="hover:text-[#C9A227] transition-colors text-neutral-400 hover:translate-x-0.5 inline-block">
                  Strategic Initiatives
                </Link>
              </li>
              <li>
                <Link href="/podcast" className="hover:text-[#C9A227] transition-colors text-neutral-400 hover:translate-x-0.5 inline-block">
                  Executive Podcast Series
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#C9A227] transition-colors text-neutral-400 hover:translate-x-0.5 inline-block">
                  Conclaves & Events
                </Link>
              </li>
              <li>
                <Link href="/membership2" className="hover:text-[#C9A227] transition-colors text-neutral-400 hover:translate-x-0.5 inline-block">
                  Join Us CXOS
                </Link>
              </li>
              <li>
                <Link href="/partnership2" className="hover:text-[#C9A227] transition-colors text-neutral-400 hover:translate-x-0.5 inline-block">
                  Join Us Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Chapters & Metro Hubs */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white flex items-center gap-1.5">
              <span className="text-[#C9A227] font-bold">›</span>
              <span>Chapters</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/chapters/delhi-ncr" className="hover:text-[#C9A227] transition-colors text-neutral-400">
                  Delhi NCR Chapter
                </Link>
              </li>
              <li>
                <Link href="/chapters/mumbai" className="hover:text-[#C9A227] transition-colors text-neutral-400">
                  Mumbai Chapter
                </Link>
              </li>
              <li>
                <Link href="/chapters/bangalore" className="hover:text-[#C9A227] transition-colors text-neutral-400">
                  Bangalore Chapter
                </Link>
              </li>
              <li>
                <Link href="/chapters/chennai" className="hover:text-[#C9A227] transition-colors text-neutral-400">
                  Chennai Chapter
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal, Governance & Social */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white flex items-center gap-1.5">
              <span className="text-[#C9A227] font-bold">›</span>
              <span>Legal & Governance</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#C9A227] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#C9A227] transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li className="pt-2">
                <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#C9A227] transition-colors">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>

            {/* Social Icons Row (Circular outline icons) */}
            <div className="pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                Connect With Us:
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com/company/digitalcxos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Digital CXOS on LinkedIn"
                  className="w-9 h-9 rounded-full border border-neutral-700 hover:border-[#C9A227] flex items-center justify-center text-neutral-300 hover:text-[#C9A227] hover:bg-neutral-800 transition-all duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@digitalcxos"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Digital CXOS on YouTube"
                  className="w-9 h-9 rounded-full border border-neutral-700 hover:border-[#C9A227] flex items-center justify-center text-neutral-300 hover:text-[#C9A227] hover:bg-neutral-800 transition-all duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> Digital CXOS Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Leadership Beyond Boundaries</span>
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
