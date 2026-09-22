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
  preTitle?: string;
  mainTitle: string;
  href: string;
  isPrimary?: boolean;
  children?: DropdownLink[];
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    id: "events",
    preTitle: "Attend an",
    mainTitle: "EVENT",
    href: "/events",
    isPrimary: true,
    children: [
      { title: "Upcoming Conclaves & Events", href: "/events?tab=upcoming", description: "Flagship leadership conclaves and peer roundtables" },
      { title: "Digital CXOS Founders' Impact Day", href: "/events", description: "18 April 2026 — Empowering Lives, Building Futures" },
      { title: "Horizon 2026 Residential Conclave", href: "/events", description: "30–31 January 2026 — Resort Country Club, Manesar" },
      { title: "Past Conclave Highlights", href: "/events?tab=past", description: "Insights and takeaways from past closed-door sessions" }
    ]
  },
  {
    id: "join",
    preTitle: "Join",
    mainTitle: "DIGITAL CXOS",
    href: "/membership2",
    isPrimary: true,
    children: [
      { title: "CXO Membership Application", href: "/membership2", description: "Exclusive for CIOs, CISOs, CTOs, CDOs and senior leaders" },
      { title: "Partner & Enterprise Membership", href: "/partnership2", description: "Sponsorship and strategic enterprise collaboration" }
    ]
  },
  {
    id: "initiatives",
    preTitle: "Our",
    mainTitle: "INITIATIVES",
    href: "/initiatives",
    isPrimary: true,
    children: [
      { title: "All 12 Strategic Initiatives", href: "/initiatives", description: "Explore the complete portfolio of purpose-driven programs" },
      { title: "CXO Mentorship & Peer Learning Circles", href: "/initiatives", description: "Guiding emerging leaders through confidential pods" },
      { title: "Strategic Workshops & AI Literacy", href: "/initiatives", description: "Actionable AI adoption and cybersecurity literacy" },
      { title: "Crisis Simulation Labs", href: "/initiatives", description: "Boardroom simulations for cyberattacks and resilience" },
      { title: "Cross-Industry Innovation Labs", href: "/initiatives", description: "Co-developing breakthrough industry solutions" }
    ]
  }
];

const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    id: "about",
    mainTitle: "About Us",
    href: "/about",
    children: [
      { title: "Our Purpose & Story", href: "/about" },
      { title: "Leadership Team & Advisors", href: "/about#leadership" },
      { title: "Mission, Vision & Core Values", href: "/about#values" }
    ]
  },
  {
    id: "chapters",
    mainTitle: "Chapters",
    href: "/chapters",
    children: [
      { title: "Delhi NCR Chapter", href: "/chapters/delhi-ncr" },
      { title: "Mumbai Chapter", href: "/chapters/mumbai" },
      { title: "Bangalore Chapter", href: "/chapters/bangalore" },
      { title: "Chennai Chapter", href: "/chapters/chennai" }
    ]
  },
  {
    id: "podcast",
    mainTitle: "Podcast",
    href: "/podcast"
  },
  {
    id: "partnership",
    mainTitle: "Partnership",
    href: "/partnership2"
  }
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#141414]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.8)] border-b border-neutral-800/80 py-2.5"
          : "bg-gradient-to-b from-[#111111]/95 via-[#141414]/80 to-transparent py-4 border-b border-white/5"
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Authentic Digital CXOS Logo */}
        <div className="shrink-0">
          <Logo size="md" showTagline={true} theme="dark" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {/* Primary Two-Tier Menu Items (Exec Club Style) */}
          <nav className="flex items-center gap-5 xl:gap-7" aria-label="Primary Navigation">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href) ||
                    (item.children && item.children.some((c) => pathname.startsWith(c.href.split("?")[0])));
              const isOpen = activeDropdown === item.id;

              return (
                <div
                  key={item.id}
                  className="relative group py-2"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className="flex flex-col text-left group-hover:text-white transition-colors focus:outline-none"
                  >
                    {item.preTitle && (
                      <span className="text-[11px] font-normal tracking-wide text-[#C9A227] leading-none mb-1">
                        {item.preTitle}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <span
                        className={cn(
                          "text-sm xl:text-[15px] font-bold tracking-wider uppercase transition-colors",
                          isActive ? "text-white" : "text-neutral-200 group-hover:text-white"
                        )}
                      >
                        {item.mainTitle}
                      </span>
                      {item.children && (
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 text-[#C9A227] transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      )}
                    </div>
                  </Link>

                  {/* Active Gold Underline Bar */}
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-[3px] bg-[#C9A227] transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  />

                  {/* Warm Cream Dropdown Panel on Hover */}
                  {item.children && (
                    <div
                      className={cn(
                        "absolute top-full left-0 min-w-[320px] pt-3 transition-all duration-200 z-50",
                        isOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      )}
                    >
                      <div className="bg-[#F7F3EA] text-[#1A1A1A] rounded-md shadow-2xl border border-[#E5DFD1] p-3 overflow-hidden">
                        <ul className="divide-y divide-[#EAE4D6]">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <Link
                                href={child.href}
                                className="block py-2.5 px-3 hover:bg-[#EFEAE0] transition-colors rounded group/link"
                              >
                                <div className="flex items-center text-sm font-semibold text-[#1A1A1A] group-hover/link:text-[#C9A227] transition-colors">
                                  <span className="text-[#C9A227] font-bold mr-2">›</span>
                                  <span>{child.title}</span>
                                </div>
                                {child.description && (
                                  <p className="text-xs text-[#666666] pl-4 mt-0.5 leading-snug">
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

          {/* Secondary Nav Items & Actions */}
          <div className="flex items-center gap-4 xl:gap-5 border-l border-neutral-800 pl-5">
            {SECONDARY_NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const isOpen = activeDropdown === item.id;

              return (
                <div
                  key={item.id}
                  className="relative group py-2"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "text-xs xl:text-sm font-medium tracking-wide flex items-center gap-1 transition-colors hover:text-[#C9A227]",
                      isActive ? "text-[#C9A227] font-semibold" : "text-neutral-300"
                    )}
                  >
                    <span>{item.mainTitle}</span>
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          "w-3 h-3 text-[#C9A227] transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown for Secondary items */}
                  {item.children && (
                    <div
                      className={cn(
                        "absolute top-full right-0 min-w-[240px] pt-3 transition-all duration-200 z-50",
                        isOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      )}
                    >
                      <div className="bg-[#F7F3EA] text-[#1A1A1A] rounded-md shadow-2xl border border-[#E5DFD1] p-2 overflow-hidden">
                        <ul className="divide-y divide-[#EAE4D6]">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <Link
                                href={child.href}
                                className="flex items-center py-2 px-3 text-xs font-semibold text-[#1A1A1A] hover:text-[#C9A227] hover:bg-[#EFEAE0] transition-colors rounded group/sublink"
                              >
                                <span className="text-[#C9A227] font-bold mr-2">›</span>
                                <span>{child.title}</span>
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

            {/* Member Portal Button (Exec Club Pattern) */}
            <Link
              href="/membership2"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold tracking-wider uppercase border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-neutral-950 transition-all duration-200"
            >
              <User className="w-3.5 h-3.5" />
              <span>Member Portal</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/membership2"
            className="px-3 py-1 text-xs font-bold uppercase rounded bg-[#C9A227] text-neutral-950"
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
        <div className="lg:hidden bg-[#181818] border-b border-neutral-800 px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto">
          {/* Primary Mobile Items */}
          <div className="space-y-3 pb-4 border-b border-neutral-800">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <div key={item.id} className="space-y-1">
                <Link
                  href={item.href}
                  className="block text-sm font-bold uppercase text-[#C9A227] tracking-wider"
                >
                  {item.preTitle && <span className="text-[11px] block lowercase font-normal text-neutral-400">{item.preTitle}</span>}
                  {item.mainTitle}
                </Link>
                {item.children && (
                  <div className="pl-3 border-l-2 border-[#C9A227]/40 space-y-1.5 mt-1">
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

          {/* Secondary Mobile Items */}
          <div className="space-y-2 py-4 border-b border-neutral-800">
            {SECONDARY_NAV_ITEMS.map((item) => (
              <div key={item.id}>
                <Link
                  href={item.href}
                  className="block text-sm font-medium text-neutral-200 hover:text-[#C9A227] py-1"
                >
                  {item.mainTitle}
                </Link>
                {item.children && (
                  <div className="pl-3 border-l-2 border-neutral-700 space-y-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        className="block text-xs text-neutral-400 hover:text-white py-0.5"
                      >
                        › {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile CTA Actions */}
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
              Partner & Enterprise Membership
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
