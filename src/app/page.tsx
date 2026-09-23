import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyDigitalCXOS } from "@/components/home/WhyDigitalCXOS";
import { PullQuoteBlock } from "@/components/home/PullQuoteBlock";
import { BuiltForLeadersPanel } from "@/components/home/BuiltForLeadersPanel";
import { OngoingPlatformSection } from "@/components/home/OngoingPlatformSection";
import { MemberExperienceGrid } from "@/components/home/MemberExperienceGrid";
import { InitiativesTeaser } from "@/components/home/InitiativesTeaser";
import { EventsTeaser } from "@/components/home/EventsTeaser";
import { PodcastTeaser } from "@/components/home/PodcastTeaser";
import { TeamTeaser } from "@/components/home/TeamTeaser";
import { PartnerCtaBand } from "@/components/home/PartnerCtaBand";
import { EventHighlightsSection } from "@/components/home/EventHighlightsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero (Pattern 1 — DARK): Full-bleed duotone photo, serif headline, cream CTA box */}
      <HeroSection />

      {/* 2. "Why Digital CXOS?" (Pattern 2 — LIGHT CREAM): Gold eyebrow, serif dark headline, duotone photo */}


      {/* 3. Pull-Quote Block (Pattern 3 — DARK): Large gold quote mark, bold serif quote, attribution */}
      <PullQuoteBlock />
      <WhyDigitalCXOS />
      {/* 4. "Built for Leaders" (Pattern 4 — DUAL CREAM CARDS OVER DUOTONE BACKDROP): Dual offset cards */}
      <BuiltForLeadersPanel />

      {/* 5. Ongoing Leadership Platform (Pattern 5 — DARK): Centered serif headline, mission/vision/values */}
      <OngoingPlatformSection />

      {/* 6. "What Members Experience" (Pattern 6 — LIGHT CREAM): 4 cards with gold/blue left border + tall photo */}
      <MemberExperienceGrid />

      {/* 7. Enrichment & Social Initiatives */}
      <InitiativesTeaser />
      <TeamTeaser />

      {/* 8. Event Highlights */}

      {/* 8.5. Video Event Highlights */}
      <EventHighlightsSection />
      <EventsTeaser />

      {/* 9. Our latest Podcast Series */}
      <PodcastTeaser />

      {/* 10. Leadership Team Grid (Pattern 8 — LIGHT CREAM): 6 duotone cards with cream caption boxes */}

      {/* 11. Partner CTA Band (Pattern 10 — DARK): Oversized decorative corner chevrons, solid-gold CTA button */}
      <PartnerCtaBand />
    </div>
  );
}
