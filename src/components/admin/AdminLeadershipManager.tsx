"use client";

import React, { useState, useEffect } from "react";
import { adminApi, ADMIN_API_BASE_URL } from "@/lib/apiClient";
import { 
  Users, 
  Search, 
  Trash2, 
  X,
  PlusCircle,
  Edit2,
  Loader2,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";

interface LeadershipEntry {
  _id: string;
  name: string;
  designation: string;
  shortBio?: string;
  description?: string;
  imageUrl?: string;
  linkedinUrl?: string;
  displayOrder: number;
  isActive: boolean;
  isDeleted?: boolean;
}

export default function AdminLeadershipManager() {
  const [leaders, setLeaders] = useState<LeadershipEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination & Filters (Backend supports pagination, but we will fetch enough to show grid)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<LeadershipEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    shortBio: "",
    description: "",
    linkedinUrl: "",
    displayOrder: 0,
    isActive: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchLeaders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || "DEMO_TOKEN";
      const res = await adminApi.get<{ data: LeadershipEntry[] }>('/leadership/admin/list?limit=50' + (searchTerm ? `&search=${searchTerm}` : ''), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaders(res.data || []);
    } catch (err: any) {
      console.error(err);
      setLeaders([]);
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
    fetchLeaders();
  }, [searchTerm]);

  const openAddModal = () => {
    setSelectedLeader(null);
    setFormData({
      name: "",
      designation: "",
      shortBio: "",
      description: "",
      linkedinUrl: "",
      displayOrder: 0,
      isActive: true
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (leader: LeadershipEntry) => {
    setSelectedLeader(leader);
    setFormData({
      name: leader.name,
      designation: leader.designation,
      shortBio: leader.shortBio || "",
      description: leader.description || "",
      linkedinUrl: leader.linkedinUrl || "",
      displayOrder: leader.displayOrder || 0,
      isActive: leader.isActive
    });
    setImageFile(null);
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
      if (imageFile) fd.append("image", imageFile);

      const url = selectedLeader 
        ? `${ADMIN_API_BASE_URL}/leadership/${selectedLeader._id}`
        : `${ADMIN_API_BASE_URL}/leadership`;
        
      const method = selectedLeader ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: fd
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save leadership profile");
      }

      setIsModalOpen(false);
      fetchLeaders();
    } catch (err: any) {
      alert(err.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, permanent: boolean = false) => {
    if (!confirm(`Are you sure you want to ${permanent ? 'PERMANENTLY ' : ''}delete this member?`)) return;
    
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || "";
      await adminApi.delete(`/leadership/${id}${permanent ? '?permanent=true' : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeaders();
    } catch (err: any) {
      alert(err.message || "Failed to delete member");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 2</span>
            <span className="text-xs text-slate-400">• All Fields Editable</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Meet Our Leadership Team & Advisors
          </h2>
          <p className="text-xs text-slate-400">
            Full control of all fields: Name, Designation, Bio, LinkedIn, Photo Image URL, and active status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or role..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#C9A227]"
            />
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Member</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
        </div>
      ) : leaders.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-white/5">
          No leadership profiles found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leaders.map((member) => (
            <div
              key={member._id}
              className={`rounded-3xl bg-[#091228] border ${member.isActive ? 'border-white/10 hover:border-[#C9A227]/60' : 'border-red-500/30 opacity-75'} overflow-hidden transition-all flex flex-col justify-between shadow-xl group`}
            >
              <div>
                {/* Portrait Photo */}
                <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={member.imageUrl || "/assests/rohit-1.webp"}
                    alt={member.name}
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assests/rohit-1.webp";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091228] via-transparent to-transparent" />
                  
                  {!member.isActive && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-900/80 backdrop-blur-md border border-red-500/50 text-[10px] font-bold text-white uppercase">
                      Inactive
                    </div>
                  )}

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#C9A227]">
                    Order: {member.displayOrder}
                  </div>
                </div>

                {/* Member Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#C9A227] mt-0.5 line-clamp-1">
                      {member.designation}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {member.shortBio || member.description || "No biography provided."}
                  </p>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between text-xs">
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-[#C9A227]" />
                  </a>
                ) : <span className="text-[11px] text-slate-500">No LinkedIn</span>}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-amber-300" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(member._id, false)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                    title="Soft Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id, true)}
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
                <Users className="w-5 h-5 text-[#C9A227]" />
                {selectedLeader ? "Edit Leadership Profile" : "Create Leadership Profile"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Designation <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Short Bio</label>
                <input
                  type="text"
                  value={formData.shortBio}
                  onChange={e => setFormData({ ...formData, shortBio: e.target.value })}
                  placeholder="Brief 1-line summary"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Full Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed leadership background..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Display Order (0 = First)</label>
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
                  <label className="text-xs font-semibold text-slate-400 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C9A227]/10 file:text-[#C9A227] hover:file:bg-[#C9A227]/20"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mt-4 md:mt-0">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-white/10 bg-slate-900 text-[#C9A227] focus:ring-[#C9A227]"
                    />
                    <span className="text-sm font-semibold text-white">Active Profile</span>
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
                  {selectedLeader ? "Save Changes" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
