import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { SectorsSection } from "@/components/home/SectorsSection";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { ValuesPillars } from "@/components/home/ValuesPillars";
import { TeamTeaser } from "@/components/home/TeamTeaser";
import { InitiativesTeaser } from "@/components/home/InitiativesTeaser";
import { EventsTeaser } from "@/components/home/EventsTeaser";
import { PodcastTeaser } from "@/components/home/PodcastTeaser";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero: More Than a Network — A Strategic Movement */}
      <HeroSection />

      {/* 2. Sectors: Driving Digital Transformation Across Sectors */}
      <SectorsSection />

      {/* 3. About Us Teaser */}
      <AboutTeaser />

      {/* 4. Mission, Vision & Core Values */}
      <ValuesPillars />

      {/* 5. Meet Our Leadership Team */}
      <TeamTeaser />

      {/* 6. Our Social Initiatives */}
      <InitiativesTeaser />

      {/* 7. Event Highlights */}
      <EventsTeaser />

      {/* 8. Our Latest Podcast Series */}
      <PodcastTeaser />
    </div>
  );
}
