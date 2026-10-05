"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Play, 
  Sparkles, 
  Images, 
  Share2, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Film
} from "lucide-react";
import { adminApi } from "@/lib/apiClient";
import { formatDate } from "@/lib/utils";

interface GalleryItem {
  url: string;
  key?: string;
  caption?: string;
  _id?: string;
}

interface EventDetail {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  eventDate?: string;
  location?: string;
  coverImageUrl?: string;
  coverImageKey?: string;
  bannerImageUrl?: string;
  bannerImageKey?: string;
  videoUrl?: string;
  videoKey?: string;
  gallery?: GalleryItem[];
  displayOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slugOrId = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Gallery Lightbox Modal
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slugOrId) return;

    setIsLoading(true);
    setError(null);

    // Step 2: Get Public Event by Slug or ID (GET /events/public/:slugOrId with fallback to /events/:slugOrId)
    adminApi.get<{ data: EventDetail }>(`/events/public/${slugOrId}`)
      .then((res) => {
        if (res.data) {
          setEvent(res.data);
        } else {
          throw new Error("Event details empty");
        }
      })
      .catch(() => {
        // Fallback to /events/:slugOrId
        return adminApi.get<{ data: EventDetail }>(`/events/${slugOrId}`)
          .then((res) => {
            if (res.data) {
              setEvent(res.data);
            } else {
              setError("Event not found");
            }
          })
          .catch(() => {
            setError("Event not found or has been removed.");
          });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slugOrId]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeGalleryIndex === null || !event?.gallery?.length) return;
    setActiveGalleryIndex((activeGalleryIndex - 1 + event.gallery.length) % event.gallery.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeGalleryIndex === null || !event?.gallery?.length) return;
    setActiveGalleryIndex((activeGalleryIndex + 1) % event.gallery.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060B18] pt-32 pb-20 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide uppercase text-amber-400">Loading Event Highlights...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#060B18] pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center glass-panel rounded-3xl p-10 border border-white/10">
          <Sparkles className="w-12 h-12 text-amber-400/50 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Event Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">{error || "We could not find the requested conclave or event."}</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Events</span>
          </Link>
        </div>
      </div>
    );
  }

  const effectiveVideoUrl = event.videoUrl;
  const isMp4 = effectiveVideoUrl?.includes(".mp4") || effectiveVideoUrl?.includes("firebasestorage") || effectiveVideoUrl?.includes("googleapis.com");
  const ytMatch = effectiveVideoUrl?.match(/(?:v=|\/embed\/|\/watch\?v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const ytId = ytMatch ? ytMatch[1] : null;

  return (
    <div className="min-h-screen bg-[#060B18] text-white pt-24 pb-24 selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header & Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Conclaves &amp; Summits</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copied ? "Link Copied!" : "Share Event"}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title Header Card */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-b from-[#0D193B]/90 via-[#081129]/95 to-[#050A18]/95 border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-400/5 blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {event.isFeatured && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Featured Conclave
                </span>
              )}
              {event.eventDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 text-slate-300 border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{new Date(event.eventDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </span>
              )}
              {event.location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 text-slate-300 border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{event.location}</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              {event.title}
            </h1>

            {event.description && (
              <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed whitespace-pre-line pt-2">
                {event.description}
              </p>
            )}
          </div>
        </div>

        {/* Media Highlights — Video & Cover Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video or Cover Player */}
          <div className="lg:col-span-12 rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl relative aspect-video">
            {effectiveVideoUrl ? (
              isVideoPlaying ? (
                isMp4 ? (
                  <video
                    src={effectiveVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : ytId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                    title={event.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={effectiveVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div 
                  className="relative w-full h-full cursor-pointer group select-none"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Image
                    src={event.coverImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-black/40 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(251,191,36,0.6)] group-hover:scale-110 group-hover:bg-amber-300 transition-all duration-300 pl-1">
                      <Play className="w-9 h-9 fill-current" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-md">
                      Watch Event Highlights
                    </span>
                  </div>
                </div>
              )
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={event.coverImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop"}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-transparent" />
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        {event.gallery && event.gallery.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Images className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Event Photo Gallery
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-resolution conclave moments and networking snapshots ({event.gallery.length} photos)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.gallery.map((img, idx) => (
                <div
                  key={img._id || idx}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer hover:border-amber-400/50 hover:shadow-xl transition-all duration-300"
                >
                  <Image
                    src={img.url}
                    alt={img.caption || `Gallery photo ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-black/70 px-3 py-1.5 rounded-lg border border-amber-400/30">
                      Enlarge
                    </span>
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-[11px] text-slate-300 truncate">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join / Contact CTA */}
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-amber-500/10 via-[#0B1535] to-amber-500/10 border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-serif font-bold text-white">
              Interested in attending our next executive conclave?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Connect with fellow CXOs and enterprise decision-makers across industry sectors at upcoming private roundtables.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-transform hover:scale-105 shadow-xl"
          >
            Request Invitation
          </Link>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal for Gallery */}
      {activeGalleryIndex !== null && event?.gallery && (
        <div 
          className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-300 select-none"
          onClick={() => setActiveGalleryIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveGalleryIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={event.gallery[activeGalleryIndex].url}
              alt={event.gallery[activeGalleryIndex].caption || "Gallery Preview"}
              fill
              className="object-contain"
            />
          </div>

          {/* Navigation Controls */}
          {event.gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 text-center text-xs text-slate-400">
            <span>{activeGalleryIndex + 1} of {event.gallery.length}</span>
            {event.gallery[activeGalleryIndex].caption && (
              <p className="text-white text-sm mt-1">{event.gallery[activeGalleryIndex].caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
