"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { TricolourAccent } from "@/components/ui/TricolourAccent";
import { ChevronDown, Menu, X, Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavDropdownItem {
  title: string;
  href: string;
  badge?: string;
}

interface NavItem {
  title: string;
  href: string;
  hasDropdown?: boolean;
  children?: NavDropdownItem[];
}

const navItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About Us", href: "/about" },
  { title: "Initiatives", href: "/initiatives" },
  {
    title: "Events",
    href: "/events",
    hasDropdown: true,
    children: [
      { title: "Upcoming Events", href: "/events?tab=upcoming" },
      { title: "Past Events", href: "/events?tab=past" }
    ]
  },
  { title: "Podcast", href: "/podcast" },
  {
    title: "Chapters",
    href: "/chapters",
    hasDropdown: true,
    children: [
      { title: "Delhi NCR", href: "/chapters/delhi-ncr" },
      { title: "Mumbai", href: "/chapters/mumbai" },
      { title: "Bangalore", href: "/chapters/bangalore" },
      { title: "Chennai", href: "/chapters/chennai" }
    ]
  },
  {
    title: "Join Us",
    href: "/membership2",
    hasDropdown: true,
    children: [
      { title: "CXOS Signup", href: "/membership2", badge: "CXO" },
      { title: "Partners Signup", href: "/partnership2", badge: "Partner" }
    ]
  },
  { title: "Contact Us", href: "/contact" }
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#050914]/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.6)] border-b border-white/10 py-2.5"
          : "bg-gradient-to-b from-[#050914]/95 via-[#050914]/80 to-transparent py-3.5 border-b border-white/5"
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Crest Logo */}
        <div className="shrink-0">
          <Logo size="md" showTagline={true} />
        </div>

        {/* Desktop Navigation Menu — Guaranteed Single Line with Centered Tricolour Baseline */}
        <nav
          className="hidden xl:flex items-center gap-1 2xl:gap-2 shrink-0 h-11"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href) ||
                  (item.children &&
                    item.children.some((c) => pathname.startsWith(c.href.split("?")[0])));

            return (
              <div
                key={item.title}
                className="relative group h-full flex flex-col justify-center px-0.5"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "px-2.5 2xl:px-3 py-1.5 text-xs 2xl:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 rounded-md shrink-0",
                    isActive
                      ? "text-amber-300 font-semibold"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  <span className="whitespace-nowrap">{item.title}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200 text-slate-400 group-hover:text-amber-300 shrink-0",
                        activeDropdown === item.title && "rotate-180"
                      )}
                    />
                  )}
                </Link>

                {/* Tricolour Underline Accent — Anchored at exact bottom of nav bar */}
                <div className="absolute -bottom-1 left-2.5 right-2.5 h-[2px] pointer-events-none">
                  <TricolourAccent active={isActive} />
                </div>

                {/* Dropdown Menu */}
                {item.hasDropdown && item.children && (
                  <div
                    className={cn(
                      "absolute top-full left-0 min-w-[210px] pt-2 transition-all duration-200 z-50",
                      activeDropdown === item.title
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    )}
                  >
                    <div className="bg-[#091229] border border-white/10 rounded-xl p-2 shadow-2xl backdrop-blur-xl divide-y divide-white/5">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors group/item whitespace-nowrap"
                        >
                          <span>{child.title}</span>
                          {child.badge ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                              {child.badge}
                            </span>
                          ) : (
                            <ArrowRight className="w-3 h-3 text-slate-500 group-hover/item:translate-x-1 group-hover/item:text-amber-300 transition-all" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden xl:flex items-center gap-2.5 shrink-0">
          <Link
            href="/membership2"
            className="px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_22px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>CXO Signup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin"
            title="Admin Portal"
            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-white/5 rounded-lg border border-white/10 transition-colors"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex xl:hidden items-center gap-2 shrink-0">
          <Link
            href="/membership2"
            className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 text-white whitespace-nowrap"
          >
            Join
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070D1F] border-b border-white/10 px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.title} className="border-b border-white/5 pb-2">
              {item.hasDropdown ? (
                <div>
                  <div className="flex items-center justify-between text-slate-200 py-2 font-medium text-sm">
                    <span>{item.title}</span>
                  </div>
                  <div className="pl-4 space-y-1 pt-1 border-l-2 border-amber-400/30">
                    {item.children?.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        className="block py-1.5 text-xs text-slate-300 hover:text-amber-300"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="block py-2 text-sm font-medium text-slate-300 hover:text-amber-300"
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}

          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/membership2"
              className="w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white"
            >
              CXOS Signup
            </Link>
            <Link
              href="/partnership2"
              className="w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-200 border border-white/10"
            >
              Partners Signup
            </Link>
            <Link
              href="/admin"
              className="w-full text-center py-2 text-xs text-slate-400 flex items-center justify-center gap-1.5 hover:text-amber-300"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
