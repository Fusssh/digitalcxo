import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyDigitalCXOS } from "@/components/home/WhyDigitalCXOS";
import { PullQuoteBlock } from "@/components/home/PullQuoteBlock";
import { BuiltForLeadersPanel } from "@/components/home/BuiltForLeadersPanel";
import { OngoingPlatformSection } from "@/components/home/OngoingPlatformSection";
import { MemberExperienceGrid } from "@/components/home/MemberExperienceGrid";
import { PodcastFeatureSection } from "@/components/home/PodcastFeatureSection";
import { TeamTeaser } from "@/components/home/TeamTeaser";
import { PartnerCtaBand } from "@/components/home/PartnerCtaBand";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero (Pattern 1 — DARK): Full-bleed duotone photo, serif headline, cream CTA box */}
      <HeroSection />

      {/* 2. "Why Digital CXOS?" (Pattern 2 — LIGHT CREAM): Gold eyebrow, serif dark headline, duotone photo */}
      <WhyDigitalCXOS />

      {/* 3. Pull-Quote Block (Pattern 3 — DARK): Large gold quote mark, bold serif quote, attribution */}
      <PullQuoteBlock />

      {/* 4. "Built for Leaders" (Pattern 4 — DUAL CREAM CARDS OVER DUOTONE BACKDROP): Dual offset cards */}
      <BuiltForLeadersPanel />

      {/* 5. Ongoing Leadership Platform (Pattern 5 — DARK): Centered serif headline, mission/vision/values */}
      <OngoingPlatformSection />

      {/* 6. "What Members Experience" (Pattern 6 — LIGHT CREAM): 4 cards with gold/blue left border + tall photo */}
      <MemberExperienceGrid />

      {/* 7. Podcast Masterclass (Pattern 7 — DARK): Featured video card with gold play button */}
      <PodcastFeatureSection />

      {/* 8. Leadership Team Grid (Pattern 8 — LIGHT CREAM): 6 duotone cards with cream caption boxes */}
      <TeamTeaser />

      {/* 9. Partner CTA Band (Pattern 10 — DARK): Oversized decorative corner chevrons, solid-gold CTA button */}
      <PartnerCtaBand />
    </div>
  );
}
