"use client";

import React, { useState, useEffect } from "react";
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
  Image as ImageIcon
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PodcastEntry {
  _id: string;
  title: string;
  description?: string;
  host?: string;
  episodeNumber?: number;
  publishDate?: string;
  thumbnailUrl?: string;
  podcastUrl: string;
  externalPlatform?: string;
  duration?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export default function AdminPodcastsManager() {
  const [podcasts, setPodcasts] = useState<PodcastEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

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

  const fetchPodcasts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || "";
      const res = await adminApi.get<{ data: PodcastEntry[] }>('/podcasts/admin/list?limit=50' + (searchTerm ? `&search=${searchTerm}` : ''), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPodcasts(res.data || []);
    } catch (err: any) {
      console.error(err);
      setPodcasts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchPodcasts();
  }, [searchTerm]);

  const openAddModal = () => {
    setSelectedPodcast(null);
    setFormData({
      title: "",
      description: "",
      host: "",
      episodeNumber: "",
      publishDate: new Date().toISOString().slice(0, 10),
      podcastUrl: "",
      externalPlatform: "youtube",
      duration: "",
      displayOrder: 0,
      isFeatured: false,
      isActive: true
    });
    setThumbnailFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (podcast: PodcastEntry) => {
    setSelectedPodcast(podcast);
    setFormData({
      title: podcast.title,
      description: podcast.description || "",
      host: podcast.host || "",
      episodeNumber: podcast.episodeNumber?.toString() || "",
      publishDate: podcast.publishDate ? new Date(podcast.publishDate).toISOString().slice(0, 10) : "",
      podcastUrl: podcast.podcastUrl,
      externalPlatform: podcast.externalPlatform || "youtube",
      duration: podcast.duration || "",
      displayOrder: podcast.displayOrder || 0,
      isFeatured: podcast.isFeatured,
      isActive: podcast.isActive
    });
    setThumbnailFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || "";
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== "" && val !== null) {
          fd.append(key, String(val));
        }
      });
      if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

      const url = selectedPodcast 
        ? `${ADMIN_API_BASE_URL}/podcasts/${selectedPodcast._id}`
        : `${ADMIN_API_BASE_URL}/podcasts`;
        
      const method = selectedPodcast ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: fd
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save podcast");
      }

      setIsModalOpen(false);
      fetchPodcasts();
    } catch (err: any) {
      alert(err.message || "Failed to save podcast.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, permanent: boolean = false) => {
    if (!confirm(`Are you sure you want to ${permanent ? 'PERMANENTLY ' : ''}delete this podcast?`)) return;
    
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || "";
      await adminApi.delete(`/podcasts/${id}${permanent ? '?permanent=true' : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPodcasts();
    } catch (err: any) {
      alert(err.message || "Failed to delete podcast");
    }
  };

  const extractYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:v=|\/embed\/|\/watch\?v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 5</span>
            <span className="text-xs text-slate-400">• YouTube & Media Podcasts</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Our Latest Podcast Series
          </h2>
          <p className="text-xs text-slate-400">
            Admin can add YouTube links, manage podcast metadata, and upload custom thumbnails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, host..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#C9A227]"
            />
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Podcast</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
        </div>
      ) : podcasts.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-white/5">
          No podcasts found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((p) => {
            const youtubeId = extractYouTubeId(p.podcastUrl);
            const thumb = p.thumbnailUrl || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "/assests/rohit-1.webp");

            return (
              <div
                key={p._id}
                className={`rounded-3xl bg-[#091228] border ${p.isActive ? 'border-white/10 hover:border-[#C9A227]/60' : 'border-red-500/30 opacity-75'} overflow-hidden transition-all flex flex-col justify-between shadow-xl group`}
              >
                <div>
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

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-sky-400">
                      Ep. {p.episodeNumber || "N/A"}
                    </div>

                    {p.isFeatured && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-amber-500/80 backdrop-blur-md border border-amber-500/50 text-[10px] font-bold uppercase text-amber-100">
                        Featured
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                      {p.duration || "Auto"}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-[#C9A227]">
                        {p.host ? `Hosted by: ${p.host}` : "Digital CXOS Podcast"}
                      </p>
                      <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5 line-clamp-2">
                        {p.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {p.description || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between text-xs">
                  <button
                    onClick={() => youtubeId && setPreviewVideoUrl(youtubeId)}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Watch Episode</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-amber-300" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(p._id, false)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id, true)}
                      className="p-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-600/40 text-rose-300 cursor-pointer border border-rose-900"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0B132B] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0B132B]/95 backdrop-blur-md z-10">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-[#C9A227]" />
                {selectedPodcast ? "Edit Podcast" : "Create Podcast"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Podcast Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">YouTube / Podcast URL <span className="text-red-400">*</span></label>
                <input
                  type="url"
                  required
                  value={formData.podcastUrl}
                  onChange={e => setFormData({ ...formData, podcastUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Host Name</label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={e => setFormData({ ...formData, host: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Episode Number</label>
                  <input
                    type="number"
                    value={formData.episodeNumber}
                    onChange={e => setFormData({ ...formData, episodeNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Publish Date</label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={e => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227] [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Duration (e.g. 45:30)</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-900/50 border border-white/5 items-center">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Custom Thumbnail (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C9A227]/10 file:text-[#C9A227] hover:file:bg-[#C9A227]/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer mt-4 md:mt-0">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-white/10 bg-slate-900 text-[#C9A227] focus:ring-[#C9A227]"
                    />
                    <span className="text-sm font-semibold text-white">Active / Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-4 md:mt-0">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded border-white/10 bg-slate-900 text-[#C9A227] focus:ring-[#C9A227]"
                    />
                    <span className="text-sm font-semibold text-amber-300">Featured Podcast</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 sticky bottom-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {selectedPodcast ? "Save Changes" : "Create Podcast"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YouTube Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-white/10">
            <button 
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewVideoUrl}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
