"use client";

import React, { useState, useEffect } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { initialPodcastsData } from "@/lib/data/podcastData";
import { VideoCard } from "@/components/ui/VideoCard";
import { PodcastEpisode } from "@/types";
import { Mic, Radio, Sparkles } from "lucide-react";

export default function PodcastPage() {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>(initialPodcastsData);

  useEffect(() => {
    fetch("/api/admin/podcasts")
      .then((res) => res.json())
      .then((data) => {
        if (data.podcasts && Array.isArray(data.podcasts)) {
          setPodcasts(data.podcasts);
        }
      })
      .catch(() => {
        // fallback to initialPodcastsData
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#060B18]">
      {/* Page Hero */}
      <PageHero
        title="Our Latest Podcast Series"
        subtitle="Unfiltered executive dialogues examining sovereign cybersecurity defense, AI disruption, DPDP compliance, and enterprise modernization."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Podcast" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        {/* Section Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Mic className="w-3.5 h-3.5" />
              <span>Executive Series</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100">
              Featured Video Episodes
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Streaming on YouTube & Digital CXOS Platform</span>
          </div>
        </div>

        {/* Podcast Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {podcasts.map((ep) => (
            <div key={ep.id} className="h-full flex flex-col">
              <VideoCard
                title={ep.title}
                subtitle={ep.subtitle}
                youtubeId={ep.youtubeId}
                youtubeUrl={ep.youtubeUrl}
                thumbnailUrl={ep.thumbnailUrl}
                guests={ep.guests}
                description={ep.overview}
              />
            </div>
          ))}
        </div>

        {/* Guest Suggestion CTA */}
        <div className="mt-20 rounded-3xl glass-panel-gold p-8 sm:p-12 border border-amber-400/30 text-center max-w-3xl mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold font-serif heading-gold">
            Recommend a CXO Speaker or Topic
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Are you leading a landmark transformation, defending critical infrastructure, or deploying state-of-the-art AI? Join our podcast series to share insights with the national leadership community.
          </p>
          <div className="pt-2">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-amber-300 hover:text-white border border-amber-400/40 transition-colors"
            >
              <span>Submit Speaker Inquiry</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
