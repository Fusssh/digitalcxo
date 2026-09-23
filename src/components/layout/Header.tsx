"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { ChevronDown, Menu, X, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownLink {
  title: string;
  href: string;
  description?: string;
}

interface NavItem {
  id: string;
  title: string;
  href: string;
  children?: DropdownLink[];
  emphasis?: boolean; // gold, bold "action" style like reference (Attend an Event, Join the Club)
}

// HOME removed — logo already links home, matching the reference pattern.
// Emphasis items are the primary CTAs (gold + bold, stacked two-line style).
// Everything else is a plain, quiet text link — this is what creates hierarchy.
const NAV_ITEMS: NavItem[] = [
  {
    id: "join",
    title: "Join Us",
    href: "/membership2",
    emphasis: true,
    children: [
      { title: "CXO Membership Application", href: "/membership2", description: "Exclusive for CIOs, CISOs, CTOs, CDOs and senior leaders" },
      { title: "Partner & Enterprise Membership", href: "/partnership2", description: "Sponsorship and strategic enterprise collaboration" }
    ]
  },
  {
    id: "events",
    title: "Events",
    href: "/events",
    emphasis: true,
    children: [
      { title: "Upcoming Conclaves & Events", href: "/events?tab=upcoming", description: "Flagship leadership conclaves and peer roundtables" },
      { title: "Digital CXOS Founders' Impact Day", href: "/events", description: "18 April 2026 — Empowering Lives, Building Futures" },
      { title: "Horizon 2026 Residential Conclave", href: "/events", description: "30–31 January 2026 — Resort Country Club, Manesar" },
      { title: "Past Conclave Highlights", href: "/events?tab=past", description: "Insights and takeaways from past closed-door sessions" }
    ]
  },
  {
    id: "initiatives",
    title: "Initiatives",
    href: "/initiatives",
    emphasis: true,
    children: [
      { title: "All 12 Strategic Initiatives", href: "/initiatives", description: "Explore the complete portfolio of purpose-driven programs" },
      { title: "CXO Mentorship & Peer Learning Circles", href: "/initiatives", description: "Guiding emerging leaders through confidential pods" },
      { title: "Strategic Workshops & AI Literacy", href: "/initiatives", description: "Actionable AI adoption and cybersecurity literacy" },
      { title: "Crisis Simulation Labs", href: "/initiatives", description: "Boardroom simulations for cyberattacks and resilience" },
      { title: "Cross-Industry Innovation Labs", href: "/initiatives", description: "Co-developing breakthrough industry solutions" }
    ]
  },
  {
    id: "about",
    title: "About Us",
    href: "/about",
    children: [
      { title: "Our Purpose & Story", href: "/about", description: "Our founding story, mission, and collective leadership credo" },
      { title: "Leadership Team & Advisors", href: "/about#leadership", description: "Accomplished CXOs and executive stewardship" },
      { title: "Mission, Vision & Core Values", href: "/about#values", description: "Principles guiding India's digital future" }
    ]
  },
  {
    id: "chapters",
    title: "Chapters",
    href: "/chapters",
    children: [
      { title: "Delhi NCR Chapter", href: "/chapters/delhi-ncr", description: "National capital region enterprise leadership circle" },
      { title: "Mumbai Chapter", href: "/chapters/mumbai", description: "Financial capital CXO & BFSI strategic forum" },
      { title: "Bangalore Chapter", href: "/chapters/bangalore", description: "Silicon Valley of India tech innovation circle" },
      { title: "Chennai Chapter", href: "/chapters/chennai", description: "Southern manufacturing & deep-tech leadership hub" }
    ]
  },
  {
    id: "podcast",
    title: "Podcast",
    href: "/podcast"
  },
  {
    id: "contact",
    title: "Contact Us",
    href: "/contact"
  }
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const emphasisItems = NAV_ITEMS.filter((i) => i.emphasis);
  const plainItems = NAV_ITEMS.filter((i) => !i.emphasis);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#141414]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.8)] border-b border-neutral-800/80 py-3"
          : "bg-gradient-to-b from-[#111111]/95 via-[#141414]/90 to-[#141414]/60 py-5 border-b border-white/5"
      )}
    >
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between gap-6">
        {/* Logo — larger, this is the only "home" link needed.
            Scaled via transform since Logo.tsx isn't available to confirm
            larger size props; origin-left keeps it anchored, not pushing into nav. */}
        <Logo className="shrink-0 scale-110 lg:scale-125 origin-left" size="lg" showTagline={true} theme="dark" />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {/* Emphasis group: bold, gold, two-line action links — like "Attend an Event" */}
          <nav className="flex items-center gap-6 xl:gap-8" aria-label="Primary Navigation">
            {emphasisItems.map((item) => {
              const isOpen = activeDropdown === item.id;
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link href={item.href} className="flex flex-col items-center leading-tight group focus:outline-none">
                    <span className="flex items-center gap-1 text-[15px] xl:text-base font-bold uppercase tracking-wide text-white group-hover:text-[#C9A227] transition-colors">
                      {item.title}
                      {item.children && (
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 text-[#C9A227] transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      )}
                    </span>

                    {/* Sovereign Indian Tricolour accent — kept only on the primary/emphasis
                        links so it stays a distinctive signature, not repeated 8x as noise */}
                    <div className="w-full h-[2px] rounded-full overflow-hidden flex mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-1/3 bg-[#FF9933]" />
                      <div className="w-1/3 bg-white" />
                      <div className="w-1/3 bg-[#138808]" />
                    </div>
                  </Link>

                  {item.children && (
                    <div
                      className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 min-w-[320px] pt-4 transition-all duration-200 z-50",
                        isOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      )}
                    >
                      <div className="bg-[#F7F3EA] text-[#1A1A1A] rounded-md shadow-2xl border border-[#E5DFD1] p-3">
                        <ul className="divide-y divide-[#EAE4D6]">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <Link
                                href={child.href}
                                className="block py-2.5 px-3 hover:bg-[#EFEAE0] transition-colors rounded group/link"
                              >
                                <div className="flex items-center text-xs sm:text-sm font-semibold text-[#1A1A1A] group-hover/link:text-[#C9A227] transition-colors">
                                  <span className="text-[#C9A227] font-bold mr-2">›</span>
                                  <span>{child.title}</span>
                                </div>
                                {child.description && (
                                  <p className="text-[11px] text-[#666666] pl-4 mt-0.5 leading-snug">
                                    {child.description}
                                  </p>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="h-8 w-px bg-neutral-800" />

          {/* Plain group: quiet text links — like "About Us / Podcast / Sponsorship" */}
          <nav className="flex items-center gap-5 xl:gap-6" aria-label="Secondary Navigation">
            {plainItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/") ||
                (item.children && item.children.some((c) => pathname.startsWith(c.href.split("?")[0])));
              const isOpen = activeDropdown === item.id;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-[13.5px] font-medium text-neutral-200 hover:text-white transition-colors focus:outline-none"
                  >
                    <span className={cn(isActive && "text-[#C9A227]")}>{item.title}</span>
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          "w-3 h-3 text-[#C9A227] transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {item.children && (
                    <div
                      className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 min-w-[300px] pt-4 transition-all duration-200 z-50",
                        isOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      )}
                    >
                      <div className="bg-[#F7F3EA] text-[#1A1A1A] rounded-md shadow-2xl border border-[#E5DFD1] p-3">
                        <ul className="divide-y divide-[#EAE4D6]">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <Link
                                href={child.href}
                                className="block py-2.5 px-3 hover:bg-[#EFEAE0] transition-colors rounded group/link"
                              >
                                <div className="flex items-center text-xs sm:text-sm font-semibold text-[#1A1A1A] group-hover/link:text-[#C9A227] transition-colors">
                                  <span className="text-[#C9A227] font-bold mr-2">›</span>
                                  <span>{child.title}</span>
                                </div>
                                {child.description && (
                                  <p className="text-[11px] text-[#666666] pl-4 mt-0.5 leading-snug">
                                    {child.description}
                                  </p>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/membership2"
              className="flex items-center gap-1.5 text-[13.5px] font-medium text-neutral-200 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Member Portal</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/membership2"
            className="px-3.5 py-1.5 text-xs font-bold uppercase rounded bg-[#C9A227] text-neutral-950"
          >
            Join
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-200 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#181818] border-b border-neutral-800 px-5 pt-3 pb-6 max-h-[85vh] overflow-y-auto">
          <div className="space-y-4 pb-4 border-b border-neutral-800">
            {NAV_ITEMS.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <Link
                  href={item.href}
                  className={cn(
                    "inline-block text-sm font-bold uppercase tracking-wider",
                    item.emphasis ? "text-[#C9A227]" : "text-neutral-100"
                  )}
                >
                  {item.title}
                </Link>
                {item.children && (
                  <div className="pl-3 border-l-2 border-[#C9A227]/40 space-y-1.5 mt-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        className="block text-xs text-neutral-300 hover:text-[#C9A227] py-0.5"
                      >
                        › {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-2.5">
            <Link
              href="/membership2"
              className="w-full text-center py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#C9A227] text-neutral-950 flex items-center justify-center gap-2"
            >
              <span>Explore CXO Membership</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/partnership2"
              className="w-full text-center py-2.5 rounded text-xs font-bold uppercase tracking-wider border border-neutral-700 text-neutral-200 hover:border-[#C9A227]"
            >
              Partner &amp; Enterprise Membership
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}