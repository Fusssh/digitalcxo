"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi, ADMIN_API_BASE_URL } from "@/lib/apiClient";
import { 
  Video, 
  Search, 
  Trash2, 
  X,
  PlusCircle,
  Edit2,
  Loader2,
  Play,
  CheckCircle2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Star,
  Power,
  Copy,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Calendar,
  Clock,
  Radio
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import CustomDateTimePicker from "@/components/ui/CustomDateTimePicker";

export interface PodcastEntry {
  _id: string;
  title: string;
  description?: string;
  host?: string;
  episodeNumber?: number;
  publishDate?: string;
  thumbnailUrl?: string;
  thumbnailKey?: string;
  podcastUrl: string;
  externalPlatform?: string;
  duration?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminPodcastsManager() {
  const [podcasts, setPodcasts] = useState<PodcastEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter State
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "featured" | "deleted">("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  
  // Pagination State
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
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    host: "",
    episodeNumber: "",
    publishDate: "",
    podcastUrl: "",
    externalPlatform: "youtube",
    duration: "",
    displayOrder: 0,
    isFeatured: false,
    isActive: true
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Podcasts matching Step 2 & Step 7 specifications
  const fetchPodcasts = useCallback(async () => {
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

      if (platformFilter !== "all") {
        queryParams.platform = platformFilter;
      }

      const res = await adminApi.get<{ 
        data: PodcastEntry[];
        pagination?: PaginationInfo;
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      }>("/admin/podcasts", {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` }
      }).catch(async () => {
        return await adminApi.get<{ 
          data: PodcastEntry[]; 
          pagination?: PaginationInfo;
          total?: number;
        }>("/podcasts/admin/list", {
          params: queryParams,
          headers: { Authorization: `Bearer ${token}` }
        });
      });

      const responseData = res as any;
      if (responseData.data && Array.isArray(responseData.data)) {
        setPodcasts(responseData.data);
        if (responseData.pagination) {
          setPagination(responseData.pagination);
        } else if (typeof responseData.total === "number") {
          setPagination({
            page: responseData.page || page,
            limit: responseData.limit || limit,
            total: responseData.total,
            totalPages: responseData.totalPages || Math.max(1, Math.ceil(responseData.total / (responseData.limit || limit)))
          });
        } else {
          setPagination({
            page,
            limit,
            total: responseData.data.length,
            totalPages: Math.max(1, Math.ceil(responseData.data.length / limit))
          });
        }
      } else {
        setPodcasts([]);
      }
    } catch (err: any) {
      console.error("Error fetching podcasts:", err);
      setPodcasts([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTerm, statusFilter, platformFilter]);

  useEffect(() => {
    fetchPodcasts();
  }, [fetchPodcasts]);

  const showToast = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const extractYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:v=|\/embed\/|\/watch\?v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const openAddModal = () => {
    setSelectedPodcast(null);
    setFormData({
      title: "",
      description: "",
      host: "",
      episodeNumber: "",
      publishDate: new Date().toISOString().slice(0, 16),
      podcastUrl: "",
      externalPlatform: "youtube",
      duration: "",
      displayOrder: podcasts.length,
      isFeatured: false,
      isActive: true
    });
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (podcast: PodcastEntry) => {
    setSelectedPodcast(podcast);
    setFormData({
      title: podcast.title || "",
      description: podcast.description || "",
      host: podcast.host || "",
      episodeNumber: podcast.episodeNumber !== undefined ? String(podcast.episodeNumber) : "",
      publishDate: podcast.publishDate ? new Date(podcast.publishDate).toISOString().slice(0, 16) : "",
      podcastUrl: podcast.podcastUrl || "",
      externalPlatform: podcast.externalPlatform || "youtube",
      duration: podcast.duration || "",
      displayOrder: podcast.displayOrder ?? 0,
      isFeatured: !!podcast.isFeatured,
      isActive: podcast.isActive !== undefined ? podcast.isActive : true
    });
    setThumbnailFile(null);
    setThumbnailPreview(podcast.thumbnailUrl || null);
    setIsModalOpen(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const setImagePreviewUrl = (url: string | null) => {
    setThumbnailPreview(url);
  };

  // Step 45 (POST /api/v1/admin/podcasts) & Step 46 (PATCH /api/v1/admin/podcasts/:id)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.podcastUrl.trim()) {
      showToast("error", "Title and Podcast URL are required fields.");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const fd = new FormData();
      
      fd.append("title", formData.title.trim());
      fd.append("podcastUrl", formData.podcastUrl.trim());
      if (formData.description.trim()) fd.append("description", formData.description.trim());
      if (formData.host.trim()) fd.append("host", formData.host.trim());
      if (formData.episodeNumber.trim()) fd.append("episodeNumber", String(Number(formData.episodeNumber)));
      if (formData.publishDate.trim()) fd.append("publishDate", formData.publishDate.trim());
      fd.append("externalPlatform", formData.externalPlatform || "youtube");
      if (formData.duration.trim()) fd.append("duration", formData.duration.trim());
      fd.append("displayOrder", String(formData.displayOrder));
      fd.append("isFeatured", String(formData.isFeatured));
      fd.append("isActive", String(formData.isActive));

      if (thumbnailFile) {
        fd.append("thumbnail", thumbnailFile);
      }

      const primaryUrl = selectedPodcast 
        ? `${ADMIN_API_BASE_URL}/admin/podcasts/${selectedPodcast._id}`
        : `${ADMIN_API_BASE_URL}/admin/podcasts`;
      const fallbackUrl = selectedPodcast
        ? `${ADMIN_API_BASE_URL}/podcasts/${selectedPodcast._id}`
        : `${ADMIN_API_BASE_URL}/podcasts`;
        
      const method = selectedPodcast ? "PATCH" : "POST";

      let res = await fetch(primaryUrl, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: fd
      });

      if (!res.ok && res.status === 404) {
        res = await fetch(fallbackUrl, {
          method,
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: fd
        });
      }

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to save podcast episode");
      }

      showToast("success", selectedPodcast ? "Podcast episode updated successfully!" : "Podcast episode created successfully!");
      setIsModalOpen(false);
      fetchPodcasts();
    } catch (err: any) {
      showToast("error", err.message || "Failed to save podcast.");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick toggle Active
  const handleToggleActive = async (podcast: PodcastEntry) => {
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const fd = new FormData();
      fd.append("isActive", String(!podcast.isActive));

      const res = await fetch(`${ADMIN_API_BASE_URL}/podcasts/${podcast._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: fd
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update active status");
      }

      showToast("success", `Episode ${!podcast.isActive ? "published" : "hidden"} successfully.`);
      fetchPodcasts();
    } catch (err: any) {
      showToast("error", err.message || "Could not update status.");
    }
  };

  // Quick toggle Featured
  const handleToggleFeatured = async (podcast: PodcastEntry) => {
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const fd = new FormData();
      fd.append("isFeatured", String(!podcast.isFeatured));

      const res = await fetch(`${ADMIN_API_BASE_URL}/podcasts/${podcast._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: fd
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update featured status");
      }

      showToast("success", `Episode marked as ${!podcast.isFeatured ? "Featured" : "Standard"}.`);
      fetchPodcasts();
    } catch (err: any) {
      showToast("error", err.message || "Could not update featured status.");
    }
  };

  // Step 6 — Soft Delete & Permanent Delete
  const handleDelete = async (id: string, title: string, permanent: boolean = false) => {
    const actionText = permanent 
      ? `PERMANENTLY delete "${title}"? This permanently removes thumbnail from S3 and destroys the database record.`
      : `soft delete (archive) "${title}"? You can view or restore it later.`;

    if (!window.confirm(`Are you sure you want to ${actionText}`)) return;
    
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const endpoint = `/podcasts/${id}${permanent ? "?permanent=true" : ""}`;
      
      await adminApi.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast("success", permanent ? `Podcast "${title}" permanently deleted.` : `Podcast "${title}" archived.`);
      fetchPodcasts();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete podcast.");
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
            <span className="text-xs text-slate-400">• Cloud Run Podcast APIs</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Our Latest Podcast Series
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage thought leadership video episodes, YouTube embeds, custom thumbnails, and featured carousel priority.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchPodcasts}
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
            <span>Add New Podcast</span>
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
            placeholder="Search by title, host or keywords..."
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
              {filter === "all" ? "All Episodes" : filter === "featured" ? "★ Featured" : filter === "deleted" ? "Archived / Deleted" : filter}
            </button>
          ))}
        </div>

        {/* Rows per page */}
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

      {/* Podcasts Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
          <p className="text-xs text-slate-400">Loading podcasts from Cloud Run...</p>
        </div>
      ) : podcasts.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-white/5 space-y-3">
          <Video className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-base font-semibold text-slate-300">No podcast episodes found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm ? `No results found for "${searchTerm}". Try a different keyword.` : "Publish your first YouTube thought leadership podcast episode to engage CXO leaders."}
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 px-4 py-2 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#C9A227] hover:bg-[#C9A227] hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Episode</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((p) => {
            const youtubeId = extractYouTubeId(p.podcastUrl);
            const thumb = p.thumbnailUrl || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "/assests/rohit-1.webp");

            return (
              <div
                key={p._id}
                className={`rounded-3xl bg-[#091228] border ${
                  p.isDeleted 
                    ? "border-red-900/60 bg-red-950/10 opacity-75"
                    : p.isActive 
                      ? "border-white/10 hover:border-[#C9A227]/60" 
                      : "border-amber-500/30 opacity-80"
                } overflow-hidden transition-all flex flex-col justify-between shadow-2xl group hover:-translate-y-1 duration-300`}
              >
                <div>
                  {/* Video Thumbnail Frame */}
                  <div 
                    onClick={() => youtubeId && setPreviewVideoUrl(youtubeId)}
                    className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer"
                  >
                    <img
                      src={thumb}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Episode Badge */}
                    {p.episodeNumber !== undefined && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-sky-400 shadow-md">
                        Ep. {p.episodeNumber}
                      </div>
                    )}

                    {/* Featured Star Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFeatured(p);
                      }}
                      title={p.isFeatured ? "Featured on homepage (Click to unfeature)" : "Standard episode (Click to feature)"}
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors shadow-md ${
                        p.isFeatured 
                          ? "bg-amber-500/90 text-slate-950 border-amber-300"
                          : "bg-black/75 text-slate-400 border-white/10 hover:text-amber-300"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${p.isFeatured ? "fill-current" : ""}`} />
                      <span>{p.isFeatured ? "Featured" : "Standard"}</span>
                    </button>

                    {/* Duration Badge */}
                    {p.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C9A227]" />
                        <span>{p.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Episode Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-[#C9A227] line-clamp-1">
                          {p.host ? `Hosted by: ${p.host}` : "Digital CXOS Podcast"}
                        </p>
                        <button
                          onClick={() => handleCopyId(p._id)}
                          title="Copy MongoDB ObjectId"
                          className="p-1 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === p._id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors mt-1 line-clamp-2 leading-snug">
                        {p.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {p.description || "No description provided."}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      {p.publishDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(p.publishDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="font-mono">
                        Order: {p.displayOrder}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="p-4 border-t border-white/5 bg-slate-950/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {/* Active toggle button */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(p)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer border ${
                        p.isActive 
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900" 
                          : "bg-amber-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-900"
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{p.isActive ? "Active" : "Inactive"}</span>
                    </button>

                    {youtubeId && (
                      <button
                        type="button"
                        onClick={() => setPreviewVideoUrl(youtubeId)}
                        className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer ml-1"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Watch</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#C9A227] hover:text-slate-950 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {/* Soft Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(p._id, p.title, false)}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 cursor-pointer transition-colors"
                      title="Soft Delete (Archive podcast)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Permanent Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(p._id, p.title, true)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 cursor-pointer border border-red-500/20 transition-colors"
                      title="Permanent Delete (S3 file & DB record)"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer matching Step 2 & Step 7 */}
      {!isLoading && podcasts.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
          <div className="text-xs text-slate-400">
            Showing <span className="font-semibold text-white">{podcasts.length}</span> of{" "}
            <span className="font-semibold text-white">{pagination.total || podcasts.length}</span> episodes 
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

      {/* Add / Edit Modal matching Step 4 (POST) & Step 5 (PATCH) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md" 
            onClick={() => setIsModalOpen(false)} 
          />
          
          <div className="relative z-10 bg-[#0B132B] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0B132B]/95 backdrop-blur-md z-20">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-[#C9A227]" />
                <span>{selectedPodcast ? "Edit Podcast Episode" : "Create Podcast Episode"}</span>
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
              {/* Row 1: Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Podcast Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sovereign AI & Cyber Defense in Enterprise India"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>

              {/* Row 2: Podcast URL & External Platform */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    YouTube / Media URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.podcastUrl}
                    onChange={e => setFormData({ ...formData, podcastUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Platform
                  </label>
                  <select
                    value={formData.externalPlatform}
                    onChange={e => setFormData({ ...formData, externalPlatform: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227] transition-colors"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="spotify">Spotify</option>
                    <option value="apple">Apple Podcasts</option>
                    <option value="vimeo">Vimeo</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Host & Episode Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Host Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rohit Kachroo"
                    value={formData.host || ""}
                    onChange={e => setFormData({ ...formData, host: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Episode Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 12"
                    value={formData.episodeNumber || ""}
                    onChange={e => setFormData({ ...formData, episodeNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
              </div>

              {/* Row 4: Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Episode Summary / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Key topics, takeaways, guest background..."
                  value={formData.description || ""}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] resize-none transition-colors"
                />
              </div>

              {/* Row 5: Publish Date, Duration & Display Order */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <CustomDateTimePicker
                    label="Publish Date & Time"
                    value={formData.publishDate || ""}
                    onChange={(val) => setFormData({ ...formData, publishDate: val })}
                    placeholder="Pick publish date & time..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Duration <span className="text-slate-500 font-normal">(e.g. 45:30)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="45:30"
                    value={formData.duration || ""}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
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
              </div>

              {/* Row 6: Custom Thumbnail & Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5 items-center">
                {/* Thumbnail input & preview */}
                <div className="md:col-span-7 flex items-center gap-4">
                  {thumbnailPreview ? (
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black">
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-10 rounded-lg border border-white/10 bg-black flex items-center justify-center shrink-0 text-slate-500">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Custom Thumbnail <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#C9A227]/10 file:text-[#C9A227] hover:file:bg-[#C9A227]/20 file:cursor-pointer"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="md:col-span-5 flex flex-col gap-2.5 md:items-end">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-slate-950 text-[#C9A227] focus:ring-[#C9A227] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-white">Active / Published</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-slate-950 text-[#C9A227] focus:ring-[#C9A227] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-amber-300">★ Featured Carousel</span>
                  </label>
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
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{selectedPodcast ? "Save Changes" : "Create Podcast"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YouTube Preview Player Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 animate-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors cursor-pointer shadow-xl"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewVideoUrl}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
