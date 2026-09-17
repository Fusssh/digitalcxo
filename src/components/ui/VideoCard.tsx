"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink, Film, MapPin, Calendar, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  title: string;
  subtitle?: string;
  youtubeId?: string;
  youtubeUrl?: string;
  videoUrl?: string;
  videoType?: "youtube" | "mp4";
  thumbnailUrl?: string;
  tagline?: string;
  date?: string;
  venue?: string;
  attendeesCount?: string;
  description?: string;
  guests?: { name: string; role: string; organization: string }[];
  className?: string;
}

export function VideoCard({
  title,
  subtitle,
  youtubeId,
  youtubeUrl,
  videoUrl,
  videoType = "youtube",
  thumbnailUrl,
  tagline,
  date,
  venue,
  attendeesCount,
  description,
  guests,
  className
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);

  const effectiveUrl = youtubeUrl || videoUrl;
  let ytId = youtubeId;
  if (!ytId && effectiveUrl && effectiveUrl.includes("youtube.com")) {
    const match = effectiveUrl.match(/(?:v=|\/embed\/|\/watch\?v=|\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (match) ytId = match[1];
  } else if (!ytId && effectiveUrl && effectiveUrl.includes("youtu.be/")) {
    const match = effectiveUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (match) ytId = match[1];
  }

  // Choose a high-quality thumbnail with fallbacks
  const effectiveThumb =
    !imgError && thumbnailUrl
      ? thumbnailUrl
      : ytId && !imgError
      ? `https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop`
      : null;

  const watchUrl = ytId
    ? `https://www.youtube.com/watch?v=${ytId}`
    : videoUrl || "#";

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0D193B]/90 via-[#081129]/95 to-[#050A18]/95 border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] hover:-translate-y-1 flex flex-col h-full",
        className
      )}
    >
      {/* Top Media Banner (16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden shrink-0 border-b border-white/5">
        {isPlaying ? (
          videoType === "mp4" && videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : ytId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
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
            onKeyDown={(e) => e.key === "Enter" && setIsPlaying(true)}
            aria-label={`Play video for ${title}`}
          >
            {/* Real Image or Modern Geometric Mesh Fallback */}
            {effectiveThumb ? (
              <Image
                src={effectiveThumb}
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
                <Film className="w-14 h-14 text-amber-300/40" />
              </div>
            )}

            {/* Gradient Dark Overlay for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-[#050A18]/50 to-transparent opacity-90 transition-opacity group-hover/thumb:opacity-75" />

            {/* Top Bar Badges */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
              {subtitle ? (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/25 text-amber-200 border border-amber-400/40 backdrop-blur-md shadow-sm">
                  {subtitle}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md shadow-sm">
                  Summit Highlight
                </span>
              )}

              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-amber-300 border border-white/10 backdrop-blur-md">
                {videoType === "mp4" ? "MP4 Highlight" : "YouTube Video"}
              </span>
            </div>

            {/* Centered Glowing Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative flex items-center justify-center">
                {/* Glow ring */}
                <div className="absolute w-16 h-16 rounded-full bg-amber-400/20 blur-md group-hover/thumb:bg-amber-400/40 transition-all duration-300 scale-110" />
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-[2px] shadow-[0_0_25px_rgba(230,202,101,0.5)] transition-all duration-300 group-hover/thumb:scale-110 group-hover/thumb:shadow-[0_0_35px_rgba(230,202,101,0.8)]">
                  <div className="w-full h-full rounded-full bg-[#080E24]/90 backdrop-blur flex items-center justify-center pl-1">
                    <Play className="w-6 h-6 text-amber-300 fill-amber-300 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Play Bar Affordance */}
            <div className="absolute bottom-2.5 left-3 right-3 text-[11px] text-slate-300 font-medium flex items-center justify-between pointer-events-none">
              <span className="flex items-center gap-1.5 text-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Click to Watch
              </span>
              {date && (
                <span className="text-slate-400 font-mono text-[10px] bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">
                  {date}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Content (Equalized Heights) */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Tagline */}
          <div className="min-h-[1.25rem]">
            {tagline ? (
              <p className="text-[11px] uppercase tracking-wider font-bold text-amber-400/90 truncate">
                {tagline}
              </p>
            ) : attendeesCount ? (
              <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-400/90 flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-400" />
                <span>{attendeesCount}</span>
              </p>
            ) : null}
          </div>

          {/* Title with synchronized line-clamp and min-height */}
          <h3 className="text-lg font-bold font-serif text-slate-100 group-hover:text-amber-300 transition-colors leading-snug line-clamp-2 min-h-[3.25rem]">
            {title}
          </h3>

          {/* Venue & Date Metadata Bar */}
          <div className="space-y-1.5 pt-1 text-xs">
            {date && (
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{date}</span>
              </div>
            )}
            {venue && (
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{venue}</span>
              </div>
            )}
          </div>

          {/* Description or Guests */}
          {description && (
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 min-h-[2.5rem] pt-1">
              {description}
            </p>
          )}

          {/* Guests if any */}
          {guests && guests.length > 0 && (
            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Featured Speakers:
              </span>
              <div className="space-y-1">
                {guests.slice(0, 2).map((g, idx) => (
                  <div key={idx} className="text-xs truncate">
                    <span className="font-semibold text-slate-200">{g.name}</span>
                    <span className="text-slate-400"> — {g.role}, {g.organization}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Bar (Strictly Pinned) */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Official Video</span>
          </span>

          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 border border-white/10 hover:border-amber-400/40 transition-all group/btn"
          >
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
