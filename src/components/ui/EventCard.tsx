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
  Building
} from "lucide-react";
import { EventItem } from "@/types";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EventItem;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const [imgError, setImgError] = useState(false);

  // High quality default placeholder image if none provided or fails
  const bannerImage = !imgError && event.thumbnailUrl
    ? event.thumbnailUrl
    : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop";

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0D193B]/90 via-[#081129]/95 to-[#050A18]/95 border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] hover:-translate-y-1 flex flex-col h-full",
        className
      )}
    >
      {/* 16:9 Media Header Banner (Matches Past Events Geometry) */}
      <div className="relative aspect-video w-full bg-[#081026] overflow-hidden shrink-0 border-b border-white/5">
        {!imgError ? (
          <Image
            src={bannerImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-[#050A18]/50 to-transparent opacity-90 transition-opacity group-hover:opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Scheduled Conclave</span>
          </span>

          {event.attendeesCount && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-amber-300 border border-white/10 backdrop-blur-md flex items-center gap-1">
              <Users className="w-3 h-3 text-amber-400" />
              <span>{event.attendeesCount}</span>
            </span>
          )}
        </div>

        {/* Floating Calendar Pill on Banner Bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[11px] font-semibold">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{event.date}</span>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
            India Chapter
          </span>
        </div>
      </div>

      {/* Card Content (Equalized Heights) */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Tagline */}
          <div className="min-h-[1.25rem]">
            <p className="text-[11px] uppercase tracking-wider font-bold text-amber-400/90 truncate">
              {event.tagline}
            </p>
          </div>

          {/* Title with synchronized line-clamp and min-height */}
          <h3 className="text-lg font-bold font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-snug line-clamp-2 min-h-[3.25rem]">
            {event.title}
          </h3>

          {/* Venue Bar */}
          <div className="space-y-1.5 pt-1 text-xs">
            {event.venue && (
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 min-h-[2.5rem] pt-1">
              {event.description}
            </p>
          )}
        </div>

        {/* Pinned Bottom Action Row */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Invitation Only</span>
          </div>

          <Link
            href="/membership2"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500 hover:to-amber-600 text-amber-300 hover:text-slate-950 border border-amber-400/40 hover:border-amber-400 transition-all duration-300 shadow-sm group/btn"
          >
            <span>Request Invite</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
