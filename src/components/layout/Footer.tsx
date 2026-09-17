import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { MapPin, Mail, Globe, Shield, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#040813] text-slate-400 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Subtle Top Tricolour Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF9933] via-white/80 to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-sm leading-relaxed text-slate-300">
              Welcome To Digital CXOS Private Limited, a unique platform of top industry leaders driving innovation and change.
            </p>
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Website: </span>
                <a
                  href="https://www.digitalcxos.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:underline"
                >
                  www.digitalcxos.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Email: </span>
                <a
                  href="mailto:contact@digitalcxos.com"
                  className="text-amber-300 hover:underline"
                >
                  contact@digitalcxos.com
                </a>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-amber-300">
              Useful Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/initiatives" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Initiatives</span>
                </Link>
              </li>
              <li>
                <Link href="/podcast" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Podcast</span>
                </Link>
              </li>
              <li>
                <Link href="/membership2" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Join Us CXOS</span>
                </Link>
              </li>
              <li>
                <Link href="/partnership2" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Join Us Partners</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Others / Legal Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-amber-300">
              Others
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-300 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-400 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold text-amber-300">
              Contact Us
            </h4>
            <div className="text-xs leading-relaxed space-y-2 text-slate-300">
              <p className="font-semibold text-slate-200">Registered Office:</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  Digital CXOS Private Limited<br />
                  Embassy Galaxy Business Park<br />
                  Tower-B, 1st Floor, A-44 & 45, Sushil Marg,<br />
                  Sector 62, Noida – 201309
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-300 mb-2">Social:</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com/company/digitalcxos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-amber-300 border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://youtube.com/@digitalcxos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-amber-300 border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <span>YouTube</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> Digital CXOS Private Limited. All rights reserved.</p>
          <p className="text-slate-400">Leadership Beyond Boundaries</p>
        </div>
      </div>
    </footer>
  );
}
