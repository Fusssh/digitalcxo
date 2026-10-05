"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, HeartHandshake, Sparkles } from "lucide-react";

interface SocialInitiative {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  link: string;
  displayOrder?: number;
}

const defaultSocialInitiatives: SocialInitiative[] = [
  {
    id: "si-1",
    tag: "National Mentorship",
    title: "CXOS FOR NAYA BHARAT",
    description:
      "Mobilizing CXO leaders to contribute ideas, digital transformation blueprints, and mentorship for India's technological future.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
    link: "/initiatives",
    displayOrder: 1
  },
  {
    id: "si-2",
    tag: "Preventive Care",
    title: "HEALTH AWARENESS & SCREENING CAMPS",
    description:
      "Organizing accessible health check-ups and wellness awareness programs to promote preventive vitality within the executive community.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
    link: "/initiatives",
    displayOrder: 2
  },
  {
    id: "si-3",
    tag: "Philanthropic Pledge",
    title: "FOUNDERS' PERSONAL GIVING COMMITMENT",
    description:
      "Our founders personally pledge 3% of their annual revenue to support meaningful social causes, digital equity, and community development.",
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop",
    link: "/initiatives",
    displayOrder: 3
  }
];

export function EventsTeaser() {
  const [socialList, setSocialList] = useState<SocialInitiative[]>(defaultSocialInitiatives);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch Public Social Initiatives (Step 48: GET /api/v1/social-initiatives/public)
  useEffect(() => {
    import("@/lib/apiClient").then(({ adminApi }) => {
      const processInitiatives = (apiItems: any[]) => {
        if (!Array.isArray(apiItems) || apiItems.length === 0) return;

        const mapped: SocialInitiative[] = apiItems.map((item: any, idx: number) => ({
          id: item._id || `si-${idx}`,
          tag: item.tag || (idx === 0 ? "Strategic Impact" : idx === 1 ? "Executive Vitality" : "Community Giving"),
          title: item.title,
          description: item.description || "",
          image: item.imageUrl || defaultSocialInitiatives[idx % defaultSocialInitiatives.length].image,
          link: "/initiatives",
          displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : idx + 1
        }));

        mapped.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
        setSocialList(mapped);
      };

      adminApi
        .get<{ data: any[] }>("/social-initiatives/public")
        .then((res) => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            processInitiatives(res.data);
          }
        })
        .catch(() => {});
    });
  }, []);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = Math.round(el.scrollLeft);
    const clientWidth = el.clientWidth;
    const scrollWidth = el.scrollWidth;

    const hasOverflow = scrollWidth > clientWidth + 4;
    const canLeft = scrollLeft > 5;
    const canRight = hasOverflow && (scrollLeft + clientWidth < scrollWidth - 5);

    setCanScrollLeft(canLeft);
    setCanScrollRight(canRight || (socialList.length > 3 && scrollLeft < 10));
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });
      resizeObserver.observe(el);
      Array.from(el.children).forEach((child) => resizeObserver?.observe(child));
    }

    const t1 = setTimeout(updateScrollState, 50);
    const t2 = setTimeout(updateScrollState, 200);
    const t3 = setTimeout(updateScrollState, 500);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      if (resizeObserver) resizeObserver.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [socialList]);

  const scrollByAmount = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-social-card]");
    const cardWidth = card ? card.getBoundingClientRect().width + 24 : 360;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
    setTimeout(updateScrollState, 600);
  };

  return (
    <section id="social-initiatives" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F7F3EA] text-[#1A1A1A] relative overflow-hidden select-none border-t border-[#EAE4D6]">
      {/* Subtle warm decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-[#EAE4D6]/40 blur-3xl"
      />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10 space-y-8 sm:space-y-10">
        {/* Modern Split Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 sm:pb-6 border-b border-[#EAE4D6]/80">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#EAE4D6] border border-[#DDD5C4] text-[#8C6D1F] text-xs font-bold uppercase tracking-widest shadow-sm">
              <HeartHandshake className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Philanthropy &amp; Community Stewardship [{socialList.length.toString().padStart(2, "0")}]</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#1A1A1A] tracking-tight leading-[1.2]">
              Our Social Initiatives
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[#555555] max-w-2xl leading-relaxed font-normal">
              Beyond boardroom strategy and technological transformation, our leadership fraternity is dedicated to executive vitality, preventive health diagnostics, and structured philanthropic giving.
            </p>
          </div>

          {/* Action CTAs & Navigation Controls */}
          <div className="flex items-center gap-4 self-start lg:self-end">
            <Link
              href="/initiatives"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#1A1A1A] hover:bg-[#C9A227] text-white hover:text-neutral-950 transition-all duration-300 shadow-md hover:scale-105 shrink-0"
            >
              <span>Explore Social Impact</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Slider navigation controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollByAmount(-1)}
                disabled={!canScrollLeft}
                aria-label="Previous social initiative"
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(1)}
                disabled={!canScrollRight}
                aria-label="Next social initiative"
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modern Full-Image Cards Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {socialList.map((item) => (
              <Link
                key={item.id}
                data-social-card
                href={item.link}
                className="group relative block aspect-[16/11] sm:aspect-[16/10] min-h-[340px] md:min-h-[380px] w-[300px] sm:w-[360px] md:w-[420px] lg:w-[calc((100%-2*2rem)/3)] shrink-0 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-[#EAE4D6] hover:border-[#C9A227] transition-all duration-500 snap-start bg-neutral-950 flex flex-col justify-between p-6 sm:p-7"
              >
                {/* Full-bleed Photo Background */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 group-hover:from-black/90 transition-colors duration-500" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold uppercase tracking-wider text-[#C9A227] shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Content Pill */}
                <div className="relative z-10 space-y-2.5">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-[#C9A227] transition-colors uppercase tracking-wide leading-tight">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 font-normal leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9A227] group-hover:text-white transition-colors">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Left/Right Edge Gradient Fade Overlays */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute top-0 left-0 bottom-4 w-12 sm:w-16 bg-gradient-to-r from-[#F7F3EA] to-transparent z-10 transition-opacity duration-300" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute top-0 right-0 bottom-4 w-12 sm:w-16 bg-gradient-to-l from-[#F7F3EA] to-transparent z-10 transition-opacity duration-300" />
          )}
        </div>
      </div>
    </section>
  );
}



