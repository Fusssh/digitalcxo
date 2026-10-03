"use client";

import React, { useState, useEffect } from "react";
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
  Globe
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EventEntry {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  location?: string;
  coverImageUrl?: string;
  videoUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminEventsManager() {
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    eventDate: "",
    location: "",
    displayOrder: 0,
    isFeatured: false,
    isActive: true
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || "DEMO_TOKEN";
      // Fetch public events for now since there's no specific admin list API mentioned besides just getting events
      // Wait, let's use the public list since it gives all events
      const res = await adminApi.get<{ data: EventEntry[] }>('/public/events?limit=50');
      setEvents(res.data || []);
    } catch (err: any) {
      console.error(err);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setSelectedEvent(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      eventDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm
      location: "",
      displayOrder: 0,
      isFeatured: false,
      isActive: true
    });
    setCoverImage(null);
    setVideoFile(null);
    setGalleryImages([]);
    setIsModalOpen(true);
  };

  const openEditModal = (evt: EventEntry) => {
    setSelectedEvent(evt);
    setFormData({
      title: evt.title,
      slug: evt.slug,
      description: evt.description || "",
      eventDate: "", // Requires fetching full details for exact date if needed, keeping simple here
      location: evt.location || "",
      displayOrder: 0,
      isFeatured: evt.isFeatured,
      isActive: evt.isActive
    });
    setCoverImage(null);
    setVideoFile(null);
    setGalleryImages([]);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || "";
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        fd.append(key, String(val));
      });
      if (coverImage) fd.append("coverImage", coverImage);
      if (videoFile) fd.append("video", videoFile);
      galleryImages.forEach(file => fd.append("galleryImages", file));

      const url = selectedEvent 
        ? `${ADMIN_API_BASE_URL}/events/${selectedEvent._id}`
        : `${ADMIN_API_BASE_URL}/events`;
        
      const method = selectedEvent ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: fd
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save event");
      }

      setIsModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      alert(err.message || "Failed to save event.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, permanent: boolean = false) => {
    if (!confirm(`Are you sure you want to ${permanent ? 'PERMANENTLY ' : ''}delete this event?`)) return;
    
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || "";
      await adminApi.delete(`/events/${id}${permanent ? '?permanent=true' : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err: any) {
      alert(err.message || "Failed to delete event");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 6</span>
            <span className="text-xs text-slate-400">• Upcoming & Past Conclaves</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Events & Conclaves Management
          </h2>
          <p className="text-xs text-slate-400">
            Create upcoming executive summits or record past closed-door roundtables with video highlights and agendas.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-white/5">
          No events found. Create one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt._id}
              className="rounded-3xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/60 overflow-hidden transition-all flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={evt.coverImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091228] via-black/20 to-black/30" />
                  
                  {evt.isFeatured && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/50 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      Featured
                    </div>
                  )}
                  
                  {!evt.isActive && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/50 text-[10px] font-bold uppercase tracking-wider text-red-300">
                      Draft / Inactive
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#C9A227] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {evt.location || "Location TBD"}
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {evt.description}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-mono">Created: {formatDate(evt.createdAt)}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(evt)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-amber-300" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(evt._id, false)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                    title="Soft Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(evt._id, true)}
                    className="p-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-600/40 text-rose-300 cursor-pointer border border-rose-900"
                    title="Permanent Delete"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0B132B] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0B132B]/95 backdrop-blur-md z-10">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C9A227]" />
                {selectedEvent ? "Edit Event" : "Create New Event"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Event Title <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-sm text-slate-400 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Location / Venue</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Event Date</label>
                  <input
                    type="datetime-local"
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227] [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setCoverImage(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C9A227]/10 file:text-[#C9A227] hover:file:bg-[#C9A227]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 flex items-center gap-1"><VideoIcon className="w-4 h-4"/> Highlight Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={e => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-400 hover:file:bg-sky-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-slate-900 text-[#C9A227] focus:ring-[#C9A227]"
                  />
                  <span className="text-sm font-semibold text-white">Featured Event</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-slate-900 text-[#C9A227] focus:ring-[#C9A227]"
                  />
                  <span className="text-sm font-semibold text-white">Active / Published</span>
                </label>
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
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  {selectedEvent ? "Save Changes" : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
