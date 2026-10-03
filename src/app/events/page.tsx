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
  const currentTab = searchParams.get("tab") === "upcoming" ? "upcoming" : "past";
  const [eventsList, setEventsList] = useState<EventItem[]>(initialEventsData);

  useEffect(() => {
    import("@/lib/apiClient").then(({ adminApi }) => {
      adminApi.get<{ data: any[] }>("/public/events?limit=50")
        .then((res) => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            const mappedEvents = res.data.map(evt => ({
              id: evt._id,
              title: evt.title,
              date: evt.createdAt ? new Date(evt.createdAt).toLocaleDateString() : "TBD",
              venue: evt.location || "TBD",
              tagline: evt.description || "",
              type: "upcoming", // All public active events default to upcoming for this layout unless we have a date check
              thumbnailUrl: evt.coverImageUrl,
              videoUrl: evt.videoUrl,
              description: evt.description
            })) as EventItem[];
            setEventsList(mappedEvents);
          }
        })
        .catch(() => {
          // fallback to initialEventsData
        });
    });
  }, []);

  const upcomingEvents = eventsList.filter((e) => e.type === "upcoming");
  const pastEvents = eventsList.filter((e) => e.type === "past");
  const filteredEvents = currentTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="min-h-screen bg-[#060B18]">
      {/* Page Hero */}
      <PageHero
        title={currentTab === "past" ? "Our Past Amazing Summits & Conclaves" : "Upcoming CXO Conclaves"}
        subtitle="Exclusive closed-door conclaves, residential strategy retreats, and high-impact boardroom roundtables for enterprise decision-makers."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: currentTab === "past" ? "Past Events" : "Upcoming Events" },
        ]}
      />

      {/* Events Grid (Strict Uniform Proportions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl p-8 border border-white/10">
            <p className="text-slate-400 text-sm">No events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="h-full flex flex-col">
                {evt.type === "upcoming" ? (
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
