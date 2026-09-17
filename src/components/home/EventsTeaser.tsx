import React from "react";
import Link from "next/link";
import { initialEventsData } from "@/lib/data/eventsData";
import { EventCard } from "@/components/ui/EventCard";
import { VideoCard } from "@/components/ui/VideoCard";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

export function EventsTeaser() {
  const upcomingEvent = initialEventsData.find((e) => e.type === "upcoming") || initialEventsData[0];
  const pastEvents = initialEventsData.filter((e) => e.type === "past").slice(0, 2);
  const featuredEvents = [upcomingEvent, ...pastEvents];

  return (
    <section className="py-24 bg-[#060B18] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Conclaves & Summits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif heading-gold">
              Event Highlights & Upcoming Conclaves
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Exclusive closed-door conclaves, residential summits, and thought leadership forums uniting India&apos;s visionary enterprise CXOs.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500 hover:to-amber-600 text-amber-300 hover:text-slate-950 border border-amber-400/30 hover:border-amber-400 transition-all duration-300 self-start md:self-auto group shadow-lg"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Balanced Equal-Height Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {featuredEvents.map((evt) => (
            <div key={evt.id} className="h-full flex flex-col">
              {evt.type === "upcoming" ? (
                <EventCard event={evt} />
              ) : (
                <VideoCard
                  title={evt.title}
                  date={evt.date}
                  venue={evt.venue}
                  tagline={evt.tagline}
                  videoType={evt.videoType}
                  videoUrl={evt.videoUrl}
                  thumbnailUrl={evt.thumbnailUrl}
                  attendeesCount={evt.attendeesCount}
                  description={evt.description}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
