import React from "react";
import Link from "next/link";
import { initialPodcastsData } from "@/lib/data/podcastData";
import { VideoCard } from "@/components/ui/VideoCard";
import { ArrowRight, Mic } from "lucide-react";

export function PodcastTeaser() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#060B18] via-[#09122A] to-[#040813] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Mic className="w-3.5 h-3.5" />
              <span>Thought Leadership Media</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif heading-gold uppercase tracking-wider">
              Our Latest Podcast Series
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              C-suite dialogues on AI disruption, cyber sovereign defense, DPDP regulations, and boardroom strategy with global thought leaders.
            </p>
          </div>

          <Link
            href="/podcast"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 hover:text-amber-200 border border-amber-400/30 transition-all self-start md:self-auto group"
          >
            <span>Listen & Watch Full Series</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Podcast Cards (Limited to 2 for homepage teaser) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {initialPodcastsData.slice(0, 2).map((pod) => (
            <div key={pod.id} className="relative w-full aspect-video rounded-sm overflow-hidden bg-black shadow-2xl border border-white/5 group hover:border-amber-400/50 transition-colors">
              <iframe
                src={`https://www.youtube.com/embed/${pod.youtubeId}?rel=0`}
                title={pod.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
