"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { initialEventsData } from "@/lib/data/eventsData";
import { EventCard } from "@/components/ui/EventCard";
import { VideoCard } from "@/components/ui/VideoCard";
import { EventItem } from "@/types";
import { Calendar, MapPin, Users, Sparkles, CheckCircle2, Clock, Film } from "lucide-react";
import { cn } from "@/lib/utils";

function EventsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "upcoming" ? "upcoming" : "past";
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">(initialTab);
  const [eventsList, setEventsList] = useState<EventItem[]>(initialEventsData);

  useEffect(() => {
    // Check if there are admin-added events from api
    fetch("/api/admin/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.events && Array.isArray(data.events) && data.events.length > 0) {
          setEventsList(data.events);
        }
      })
      .catch(() => {
        // fallback to initialEventsData
      });
  }, []);

  const upcomingEvents = eventsList.filter((e) => e.type === "upcoming");
  const pastEvents = eventsList.filter((e) => e.type === "past");
  const filteredEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="min-h-screen bg-[#060B18]">
      {/* Page Hero */}
      <PageHero
        title={activeTab === "past" ? "Our Past Amazing Summits & Conclaves" : "Upcoming CXO Conclaves"}
        subtitle="Exclusive closed-door conclaves, residential strategy retreats, and high-impact boardroom roundtables for enterprise decision-makers."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: activeTab === "past" ? "Past Events" : "Upcoming Events" },
        ]}
      />

      {/* Modern Luxury Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0A132C]/90 border border-white/10 backdrop-blur-md shadow-inner">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer",
                activeTab === "upcoming"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              )}
            >
              <Clock className={cn("w-4 h-4", activeTab === "upcoming" ? "text-slate-950" : "text-emerald-400")} />
              <span>Upcoming Conclaves</span>
              <span className={cn(
                "ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono",
                activeTab === "upcoming" ? "bg-slate-950/30 text-slate-950" : "bg-white/10 text-slate-300"
              )}>
                {upcomingEvents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer",
                activeTab === "past"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              )}
            >
              <Film className={cn("w-4 h-4", activeTab === "past" ? "text-slate-950" : "text-amber-400")} />
              <span>Past Summits & Videos</span>
              <span className={cn(
                "ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono",
                activeTab === "past" ? "bg-slate-950/30 text-slate-950" : "bg-white/10 text-slate-300"
              )}>
                {pastEvents.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Curated for CIOs, CTOs, CISOs & Enterprise Leaders</span>
          </div>
        </div>
      </div>

      {/* Events Grid (Strict Uniform Proportions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl p-8 border border-white/10">
            <p className="text-slate-400 text-sm">No events found under this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="h-full flex flex-col">
                {activeTab === "upcoming" ? (
                  <EventCard event={evt} />
                ) : (
                  <VideoCard
                    title={evt.title}
                    tagline={evt.tagline}
                    date={evt.date}
                    venue={evt.venue}
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
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060B18] pt-40 text-center text-slate-400">Loading Events...</div>}>
      <EventsContent />
    </Suspense>
  );
}
