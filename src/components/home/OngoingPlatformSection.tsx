import React from "react";

export function OngoingPlatformSection() {
  return (
    <section className="py-24 md:py-32 bg-[#181818] text-white border-t border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        {/* Centered Serif Headline (Screenshot 5) */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.2]">
          An Ongoing Leadership Platform — Not Just Access to Events
        </h2>

        {/* 3 Centered Paragraphs (Mission, Vision, Core Values verbatim) */}
        <div className="space-y-8 text-base sm:text-lg text-neutral-200 leading-relaxed max-w-3xl mx-auto">
          <p>
            <span className="block text-xs uppercase tracking-widest font-bold text-[#C9A227] mb-2">
              Our Mission
            </span>
            &ldquo;To empower the global IT and C-suite leadership community to accelerate digital transformation, strengthen cybersecurity and enhance technological impact building resilient enterprises that contribute to India&apos;s digital future.&rdquo;
          </p>

          <p>
            <span className="block text-xs uppercase tracking-widest font-bold text-[#C9A227] mb-2">
              Our Vision
            </span>
            &ldquo;To empower visionary technology leaders with a dynamic platform that accelerates digital transformation, nurtures secure innovation and improves enterprise technology driving sustainable growth, resilience and strategic clarity across industries.&rdquo;
          </p>

          <p className="text-neutral-300 text-sm sm:text-base border-t border-neutral-800 pt-6">
            <span className="block text-xs uppercase tracking-widest font-bold text-[#C9A227] mb-2">
              Core Values
            </span>
            &ldquo;We are guided by trust, confidentiality, strategic relevance, ethical leadership and a shared commitment to shaping secure, responsible and forward-looking digital enterprises for the country&apos;s progress.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
