"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi, ADMIN_API_BASE_URL } from "@/lib/apiClient";
import { 
  Calendar, 
  Search, 
  Trash2, 
  X,
  PlusCircle,
  Edit2,
  Loader2,
  MapPin,
  CheckCircle2,
  Image as ImageIcon,
  Video as VideoIcon,
  Globe,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Star,
  Power,
  Copy,
  AlertTriangle,
  RotateCcw,
  Images,
  ExternalLink,
  Clock,
  Film
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import CustomDateTimePicker from "@/components/ui/CustomDateTimePicker";

export interface GalleryItem {
  url: string;
  key?: string;
  caption?: string;
  _id?: string;
}

export interface EventEntry {
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
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminEventsManager() {
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filters
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "featured" | "deleted">("all");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<{ type: "image" | "video"; url: string; title: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    eventDate: "",
    location: "",
    coverImageUrl: "",
    videoUrl: "",
    displayOrder: 0,
    isFeatured: false,
    isActive: true
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoInputMode, setVideoInputMode] = useState<"file" | "url">("file");
  const [coverInputMode, setCoverInputMode] = useState<"file" | "url">("file");
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Events from API (Step 1, Step 3, Step 4)
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      
      const queryParams: Record<string, string> = {
        page: String(page),
        limit: String(limit)
      };

      if (searchTerm.trim()) {
        queryParams.search = searchTerm.trim();
      }

      if (statusFilter === "active") {
        queryParams.isActive = "true";
      } else if (statusFilter === "inactive") {
        queryParams.isActive = "false";
      } else if (statusFilter === "featured") {
        queryParams.isFeatured = "true";
      } else if (statusFilter === "deleted") {
        queryParams.includeDeleted = "true";
      }

      const res = await adminApi.get<{ 
        data: EventEntry[];
        pagination?: PaginationInfo;
      }>("/admin/events", {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` }
      }).catch(async () => {
        // Fallback to /events with params
        return await adminApi.get<{ data: EventEntry[]; pagination?: PaginationInfo }>("/events", {
          params: queryParams,
          headers: { Authorization: `Bearer ${token}` }
        });
      });

      if (res.data && Array.isArray(res.data)) {
        setEvents(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        } else {
          setPagination({
            page,
            limit,
            total: res.data.length,
            totalPages: Math.max(1, Math.ceil(res.data.length / limit))
          });
        }
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTerm, statusFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const showToast = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    setSelectedEvent(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      eventDate: new Date().toISOString().slice(0, 16),
      location: "",
      coverImageUrl: "",
      videoUrl: "",
      displayOrder: events.length,
      isFeatured: false,
      isActive: true
    });
    setCoverImageFile(null);
    setCoverPreview(null);
    setBannerImageFile(null);
    setVideoFile(null);
    setVideoPreview(null);
    setVideoInputMode("file");
    setCoverInputMode("file");
    setGalleryImageFiles([]);
    setGalleryPreviews([]);
    setIsModalOpen(true);
  };

  const openEditModal = (evt: EventEntry) => {
    setSelectedEvent(evt);
    setFormData({
      title: evt.title || "",
      slug: evt.slug || "",
      description: evt.description || "",
      eventDate: evt.eventDate ? new Date(evt.eventDate).toISOString().slice(0, 16) : "",
      location: evt.location || "",
      coverImageUrl: evt.coverImageUrl || "",
      videoUrl: evt.videoUrl || "",
      displayOrder: evt.displayOrder ?? 0,
      isFeatured: !!evt.isFeatured,
      isActive: evt.isActive !== undefined ? evt.isActive : true
    });
    setCoverImageFile(null);
    setCoverPreview(evt.coverImageUrl || null);
    setBannerImageFile(null);
    setVideoFile(null);
    setVideoPreview(evt.videoUrl || null);
    setVideoInputMode(evt.videoUrl && !evt.videoKey ? "url" : "file");
    setCoverInputMode(evt.coverImageUrl && !evt.coverImageKey ? "url" : "file");
    setGalleryImageFiles([]);
    setGalleryPreviews(evt.gallery?.map(g => g.url) || []);
    setIsModalOpen(true);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImageFile(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    setGalleryImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(previews);
  };

  // Step 5 (POST /events) & Step 6 (PATCH /events/:id)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("error", "Event title is a required field.");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const fd = new FormData();
      
      fd.append("title", formData.title.trim());
      if (formData.slug.trim()) fd.append("slug", formData.slug.trim());
      if (formData.description.trim()) fd.append("description", formData.description.trim());
      if (formData.eventDate.trim()) fd.append("eventDate", new Date(formData.eventDate).toISOString());
      if (formData.location.trim()) fd.append("location", formData.location.trim());
      fd.append("displayOrder", String(formData.displayOrder));
      fd.append("isFeatured", String(formData.isFeatured));
      fd.append("isActive", String(formData.isActive));

      if (coverImageFile) {
        fd.append("coverImage", coverImageFile);
      } else if (formData.coverImageUrl.trim()) {
        fd.append("coverImageUrl", formData.coverImageUrl.trim());
      }

      if (bannerImageFile) {
        fd.append("bannerImage", bannerImageFile);
      }

      if (videoFile) {
        fd.append("video", videoFile);
        fd.append("videoFile", videoFile);
      } else if (formData.videoUrl.trim() || selectedEvent) {
        // Send videoUrl if provided or empty string to clear when updating
        fd.append("videoUrl", formData.videoUrl.trim());
      }

      galleryImageFiles.forEach(file => {
        fd.append("galleryImages", file);
      });

      let url = selectedEvent 
        ? `${ADMIN_API_BASE_URL}/admin/events/${selectedEvent._id}`
        : `${ADMIN_API_BASE_URL}/admin/events`;
        
      const method = selectedEvent ? "PATCH" : "POST";

      let res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: fd
      });

      // Fallback if /admin/events returned 404
      if (res.status === 404) {
        const fallbackUrl = selectedEvent
          ? `${ADMIN_API_BASE_URL}/events/${selectedEvent._id}`
          : `${ADMIN_API_BASE_URL}/events`;
        res = await fetch(fallbackUrl, {
          method,
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });
      }

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to save event");
      }

      showToast("success", selectedEvent ? "Event updated successfully!" : "Event created successfully!");
      setIsModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      showToast("error", err.message || "Failed to save event.");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick toggle Active/Draft
  const handleToggleActive = async (evt: EventEntry) => {
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const fd = new FormData();
      fd.append("isActive", String(!evt.isActive));

      let res = await fetch(`${ADMIN_API_BASE_URL}/admin/events/${evt._id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      if (res.status === 404) {
        res = await fetch(`${ADMIN_API_BASE_URL}/events/${evt._id}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to toggle status");
      }

      showToast("success", `Event ${!evt.isActive ? "published" : "hidden"} successfully.`);
      fetchEvents();
    } catch (err: any) {
      showToast("error", err.message || "Could not update status.");
    }
  };

  // Quick toggle Featured
  const handleToggleFeatured = async (evt: EventEntry) => {
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const fd = new FormData();
      fd.append("isFeatured", String(!evt.isFeatured));

      let res = await fetch(`${ADMIN_API_BASE_URL}/admin/events/${evt._id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      if (res.status === 404) {
        res = await fetch(`${ADMIN_API_BASE_URL}/events/${evt._id}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to toggle featured status");
      }

      showToast("success", `Event marked as ${!evt.isFeatured ? "Featured" : "Standard"}.`);
      fetchEvents();
    } catch (err: any) {
      showToast("error", err.message || "Could not update featured status.");
    }
  };

  // Step 7 (Soft Delete) & Step 8 (Permanent Delete) - Step 41
  const handleDelete = async (id: string, title: string, permanent: boolean = false) => {
    const actionText = permanent 
      ? `PERMANENTLY delete "${title}"? This removes cover image, video, and gallery files from cloud storage and permanently destroys the database record.`
      : `soft delete (archive) "${title}"? You can restore it later.`;

    if (!window.confirm(`Are you sure you want to ${actionText}`)) return;
    
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const endpoint = `/admin/events/${id}${permanent ? "?permanent=true" : ""}`;
      
      await adminApi.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(async () => {
        // Fallback to /events/:id
        await adminApi.delete(`/events/${id}${permanent ? "?permanent=true" : ""}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      });
      
      showToast("success", permanent ? `Event "${title}" permanently deleted.` : `Event "${title}" archived.`);
      fetchEvents();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete event.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div 
          className={`fixed top-6 right-6 z-[1000] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-semibold animate-in fade-in slide-in-from-top-3 duration-300 ${
            feedbackMsg.type === "success" 
              ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/50 backdrop-blur-md" 
              : "bg-red-950/90 text-red-300 border-red-500/50 backdrop-blur-md"
          }`}
        >
          {feedbackMsg.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Management Portal</span>
            <span className="text-xs text-slate-400">• Cloud Run Events APIs</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Events, Summits &amp; Conclaves
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage upcoming conclaves, past summits, video highlights, and multi-image photo galleries with cloud storage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchEvents}
            title="Refresh list"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Search, Filter Tabs & Limit Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, location or keywords..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
          />
          {searchInput && (
            <button 
              onClick={() => setSearchInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
            Filter:
          </span>
          {(["all", "active", "featured", "inactive", "deleted"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setStatusFilter(filter);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === filter
                  ? "bg-[#C9A227] text-slate-950 shadow-md font-bold"
                  : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-white/5"
              }`}
            >
              {filter === "all" ? "All Events" : filter === "featured" ? "★ Featured" : filter === "deleted" ? "Archived / Deleted" : filter}
            </button>
          ))}
        </div>

        {/* Rows Selector */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-[11px] font-semibold text-slate-400">Rows:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#C9A227]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
          <p className="text-xs text-slate-400">Loading events from Cloud Run...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-white/5 space-y-3">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-base font-semibold text-slate-300">No events found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm ? `No results found for "${searchTerm}". Try a different keyword.` : "Publish your first flagship conclave or executive roundtable."}
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 px-4 py-2 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#C9A227] hover:bg-[#C9A227] hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Event</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt._id}
              className={`rounded-3xl bg-[#091228] border ${
                evt.isDeleted 
                  ? "border-red-900/60 bg-red-950/10 opacity-75"
                  : evt.isActive 
                    ? "border-white/10 hover:border-[#C9A227]/60" 
                    : "border-amber-500/30 opacity-80"
              } overflow-hidden transition-all flex flex-col justify-between shadow-2xl group hover:-translate-y-1 duration-300`}
            >
              <div>
                {/* Media Banner Frame */}
                <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={evt.coverImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091228] via-transparent to-black/30" />
                  
                  {/* Top Left Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {evt.isDeleted ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-900/90 backdrop-blur-md border border-red-500/50 text-[10px] font-bold text-white uppercase shadow-md">
                        Deleted
                      </span>
                    ) : evt.isActive ? (
                      <button
                        onClick={() => handleToggleActive(evt)}
                        title="Click to deactivate / draft"
                        className="px-2.5 py-1 rounded-full bg-emerald-900/80 hover:bg-emerald-800 backdrop-blur-md border border-emerald-400/50 text-[10px] font-bold text-emerald-200 uppercase shadow-md flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Active</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleActive(evt)}
                        title="Click to publish / activate"
                        className="px-2.5 py-1 rounded-full bg-amber-900/80 hover:bg-amber-800 backdrop-blur-md border border-amber-400/50 text-[10px] font-bold text-amber-200 uppercase shadow-md flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Power className="w-3 h-3 text-amber-300" />
                        <span>Draft</span>
                      </button>
                    )}
                  </div>

                  {/* Top Right Featured Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(evt)}
                    title={evt.isFeatured ? "Featured event (Click to unfeature)" : "Standard event (Click to feature)"}
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors shadow-md ${
                      evt.isFeatured 
                        ? "bg-amber-500/90 text-slate-950 border-amber-300"
                        : "bg-black/75 text-slate-400 border-white/10 hover:text-amber-300"
                    }`}
                  >
                    <Star className={`w-3 h-3 ${evt.isFeatured ? "fill-current" : ""}`} />
                    <span>{evt.isFeatured ? "Featured" : "Standard"}</span>
                  </button>

                  {/* Media Indicator Pills */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    {evt.videoUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewMediaUrl({ type: "video", url: evt.videoUrl!, title: evt.title })}
                        className="px-2.5 py-0.5 rounded-full bg-black/80 hover:bg-red-600 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1 shadow-md transition-colors cursor-pointer"
                      >
                        <Film className="w-3 h-3 text-[#C9A227]" />
                        <span>Video</span>
                      </button>
                    )}

                    {evt.gallery && evt.gallery.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                        <Images className="w-3 h-3 text-sky-400" />
                        <span>{evt.gallery.length} Photos</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                        {evt.title}
                      </h3>
                      <button
                        onClick={() => handleCopy(evt._id, evt._id)}
                        title="Copy MongoDB ObjectId"
                        className="p-1 rounded text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
                      >
                        {copiedId === evt._id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 mt-2">
                      <p className="font-semibold text-[#C9A227] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{evt.location || "Location TBD"}</span>
                      </p>
                      {evt.eventDate && (
                        <p className="flex items-center gap-1 text-slate-400 font-medium">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{new Date(evt.eventDate).toLocaleDateString()}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {evt.description || "No event description provided."}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-white/5 font-mono">
                    <span className="truncate max-w-[180px]" title={evt.slug}>
                      /{evt.slug || "slug-tbd"}
                    </span>
                    <span>Order: {evt.displayOrder}</span>
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-4 border-t border-white/5 bg-slate-950/40 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatDate(evt.createdAt)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(evt)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#C9A227] hover:text-slate-950 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  {/* Soft Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(evt._id, evt.title, false)}
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 cursor-pointer transition-colors"
                    title="Soft Delete (Archive event)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Permanent Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(evt._id, evt.title, true)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 cursor-pointer border border-red-500/20 transition-colors"
                    title="Permanent Delete (Removes media from cloud & DB)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer matching Step 1 & Step 4 */}
      {!isLoading && events.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
          <div className="text-xs text-slate-400">
            Showing <span className="font-semibold text-white">{events.length}</span> of{" "}
            <span className="font-semibold text-white">{pagination.total || events.length}</span> events 
            (Page {pagination.page || page} of {pagination.totalPages || 1})
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1.5 rounded-xl bg-slate-950 text-xs font-bold text-[#C9A227] border border-white/10">
              {page}
            </span>

            <button
              type="button"
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Modal matching Step 5 (POST) & Step 6 (PATCH) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md" 
            onClick={() => setIsModalOpen(false)} 
          />
          
          <div className="relative z-10 bg-[#0B132B] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0B132B]/95 backdrop-blur-md z-20">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C9A227]" />
                <span>{selectedEvent ? "Edit Conclave / Event" : "Create New Conclave"}</span>
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Event Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Leadership Summit 2026"
                    value={formData.title || ""}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({ 
                        ...formData, 
                        title: val, 
                        slug: !selectedEvent ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : formData.slug 
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="annual-leadership-summit-2026"
                    value={formData.slug || ""}
                    onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Location & Event Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bhubaneswar, Odisha / ITC Grand Chola"
                    value={formData.location || ""}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <CustomDateTimePicker
                    label="Event Date & Time"
                    value={formData.eventDate || ""}
                    onChange={(val) => setFormData({ ...formData, eventDate: val })}
                    placeholder="Pick summit date & time..."
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Event Description &amp; Theme
                </label>
                <textarea
                  rows={3}
                  placeholder="Key agenda topics, summit overview, executive invitees..."
                  value={formData.description || ""}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] resize-none transition-colors"
                />
              </div>

              {/* Row 4: Display Order & Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.displayOrder ?? 0}
                    onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-slate-950 text-[#C9A227] focus:ring-[#C9A227] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-white">Active / Published</span>
                  </label>
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-slate-950 text-[#C9A227] focus:ring-[#C9A227] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-amber-300">★ Featured Summit</span>
                  </label>
                </div>
              </div>

              {/* Row 5: Media Uploads (Cover Image, Highlight Video, Gallery) */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Media &amp; Cloud Storage Assets</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cover Image */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Cover Image <span className="text-slate-500 font-normal">(Banner)</span>
                      </label>
                      <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-white/10 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setCoverInputMode("file")}
                          className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                            coverInputMode === "file" ? "bg-[#C9A227] text-slate-950" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverInputMode("url")}
                          className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                            coverInputMode === "url" ? "bg-[#C9A227] text-slate-950" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Web URL
                        </button>
                      </div>
                    </div>

                    {coverInputMode === "file" ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#C9A227]/10 file:text-[#C9A227] hover:file:bg-[#C9A227]/20 file:cursor-pointer"
                      />
                    ) : (
                      <input
                        type="url"
                        placeholder="https://example.com/cover-image.jpg"
                        value={formData.coverImageUrl || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, coverImageUrl: e.target.value });
                          setCoverPreview(e.target.value || null);
                          setCoverImageFile(null);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227]"
                      />
                    )}

                    {coverPreview && (
                      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 mt-2 bg-black">
                        <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Highlight Video */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Highlight Video <span className="text-slate-500 font-normal">(MP4 / Video Link)</span>
                      </label>
                      <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-white/10 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setVideoInputMode("file")}
                          className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                            videoInputMode === "file" ? "bg-sky-400 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoInputMode("url")}
                          className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                            videoInputMode === "url" ? "bg-sky-400 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Direct Video URL
                        </button>
                      </div>
                    </div>

                    {videoInputMode === "file" ? (
                      <input
                        type="file"
                        accept="video/*,video/mp4,video/webm,video/quicktime,video/avi,video/mpeg,video/ogg,.mp4,.webm,.mov,.avi,.mkv"
                        onChange={handleVideoChange}
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-400 hover:file:bg-sky-500/20 file:cursor-pointer"
                      />
                    ) : (
                      <input
                        type="url"
                        placeholder="https://example.com/videos/event-highlight.mp4"
                        value={formData.videoUrl || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, videoUrl: e.target.value });
                          setVideoPreview(e.target.value || null);
                          setVideoFile(null);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                      />
                    )}

                    {videoPreview && (
                      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 mt-2 bg-black">
                        <video src={videoPreview} controls className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery Images (Multiple) */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Photo Gallery Images <span className="text-slate-500 font-normal">(Max 10 files)</span></span>
                    {galleryPreviews.length > 0 && (
                      <span className="text-[11px] text-[#C9A227] font-mono">{galleryPreviews.length} selected</span>
                    )}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 file:cursor-pointer"
                  />

                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-2">
                      {galleryPreviews.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-black">
                          <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-[#0B132B]/95 backdrop-blur-md pb-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-300 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 flex items-center gap-2 disabled:opacity-50 transition-all shadow-xl cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  <span>{selectedEvent ? "Save Changes" : "Publish Event"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video / Image Fullscreen Preview Modal */}
      {previewMediaUrl && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
              <h4 className="text-sm font-bold text-white truncate max-w-lg">{previewMediaUrl.title}</h4>
              <button 
                type="button"
                onClick={() => setPreviewMediaUrl(null)}
                className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {previewMediaUrl.type === "video" ? (
                <video src={previewMediaUrl.url} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <img src={previewMediaUrl.url} alt={previewMediaUrl.title} className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
