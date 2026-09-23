import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ExternalLink } from "lucide-react";

export function PodcastFeatureSection() {
  return (
    <section className="py-12 md:py-16 bg-[#181818] text-white border-t border-neutral-800 select-none">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 space-y-8">
        {/* Section Header */}
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C9A227]">
            <span className="w-8 h-[1.5px] bg-[#C9A227]" />
            <span>Executive Dialogue &amp; Media</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.2]">
            Voices of Digital Transformation
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            C-suite insights on AI disruption, sovereign cyber defense, data privacy, and executive resilience.
          </p>
        </div>

        {/* Large Featured Video/Podcast Card (Exec Club Pattern 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Episode Spotlight */}
          <div className="lg:col-span-8 bg-[#202020] rounded-sm overflow-hidden border border-neutral-800 shadow-2xl flex flex-col justify-between group">
            {/* Thumbnail with Tint Overlay & Centered Gold Play Button */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <Image
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=85&w=1400&auto=format&fit=crop"
                alt="AI, Cybersecurity & Digital Trust Podcast"
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover object-center grayscale contrast-125 brightness-75 group-hover:scale-105 group-hover:brightness-90 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Centered Gold Play Button */}
              <a
                href="https://youtube.com/@digitalcxos"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch episode on YouTube"
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 flex items-center justify-center shadow-[0_0_30px_rgba(201,162,39,0.5)] transform group-hover:scale-110 transition-all duration-300">
                  <Play className="w-7 h-7 fill-neutral-950 ml-1 text-neutral-950" />
                </div>
              </a>

              {/* Watch on YouTube Badge */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded bg-black/80 backdrop-blur-sm border border-neutral-700 text-xs font-semibold text-white">
                <svg className="w-4 h-4 fill-red-500" viewBox="0 0 24 24">
                  <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73Z" />
                </svg>
                <span>Watch on YouTube</span>
              </div>
            </div>

            {/* Overlaid Details */}
            <div className="p-6 sm:p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A227]">
                Featured Masterclass Episode
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                AI, Cybersecurity &amp; Digital Trust (&ldquo;AI Changes Everything&rdquo;)
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Featuring <span className="text-white font-semibold">Rajiv Nandwani</span> (Global Cyber Security Director, BCG) &amp; <span className="text-white font-semibold">Anush Tewari</span> (Chief Cybersecurity Advisor, India &amp; South Asia, Microsoft India).
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://youtube.com/@digitalcxos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 transition-colors shadow-lg"
                >
                  <span>Watch Today</span>
                  <span className="font-bold">›</span>
                </a>
                <Link
                  href="/podcast"
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                >
                  Explore All Episodes
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary Episode Card */}
          <div className="lg:col-span-4 bg-[#202020] rounded-sm p-6 sm:p-8 border border-neutral-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Latest Release
              </span>
              <h4 className="text-lg font-serif font-bold text-white">
                AI, Cyber Law &amp; Data Protection
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Navigating the Digital Personal Data Protection Act (DPDP), sovereign compliance, and board governance.
              </p>
              <p className="text-xs text-[#C9A227] font-medium">
                Speakers: Rajiv Nandwani (BCG) &amp; (Dr.) Karnnika A Seth (Cyber Lawyer, Supreme Court of India)
              </p>
            </div>

            <div className="pt-6 border-t border-neutral-800">
              <a
                href="https://youtube.com/@digitalcxos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9A227] hover:text-[#D4AF37] transition-colors"
              >
                <span>Watch Episode</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
