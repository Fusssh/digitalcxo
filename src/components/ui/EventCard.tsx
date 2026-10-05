"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Building,
  Play
} from "lucide-react";
import { EventItem } from "@/types";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EventItem;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // High quality default placeholder image if none provided or fails
  const bannerImage = !imgError && event.thumbnailUrl
    ? event.thumbnailUrl
    : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop";

  // Fallback to a default video if none provided so the play button always works
  const effectiveUrl = event.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const ytId = effectiveUrl.match(/(?:v=|\/embed\/|\/watch\?v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
  const isMp4 = event.videoType === "mp4" || effectiveUrl.endsWith(".mp4");

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0D193B]/90 via-[#081129]/95 to-[#050A18]/95 border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] hover:-translate-y-1 flex flex-col h-full",
        className
      )}
    >
      {/* 16:9 Media Header Banner (Matches Past Events Geometry) */}
      <div className="relative aspect-video w-full bg-[#081026] overflow-hidden shrink-0">
        {isPlaying ? (
          isMp4 ? (
            <video
              src={effectiveUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : ytId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
              title={event.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              Video stream unavailable
            </div>
          )
        ) : (
          <div
            className="relative w-full h-full cursor-pointer group/thumb select-none"
            onClick={() => setIsPlaying(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsPlaying(true);
              }
            }}
          >
            {!imgError ? (
              <Image
                src={bannerImage}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover/thumb:scale-105"
                onError={() => setImgError(true)}
                priority={false}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0B1535] via-[#101F4E] to-[#080D1F] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
                <Sparkles className="w-12 h-12 text-amber-300/30" />
              </div>
            )}

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-[#050A18]/50 to-transparent opacity-90 transition-opacity group-hover/thumb:opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover/thumb:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>

            {/* Floating Calendar Pill on Banner Bottom */}
            <div className="absolute bottom-2.5 left-3 z-10 flex items-center pointer-events-none">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[11px] font-semibold">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{event.date}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Details Body */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2.5">
          {event.venue && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}

          <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
            {event.title}
          </h3>

          {(event.description || event.tagline) && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {event.description || event.tagline}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
          <Link
            href={`/events/${event.slug || event.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors group/link"
          >
            <span>View Event &amp; Gallery</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>

          {event.gallery && event.gallery.length > 0 && (
            <span className="text-[11px] text-slate-500 font-medium">
              {event.gallery.length} Photos
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
