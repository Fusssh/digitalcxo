"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi, ADMIN_API_BASE_URL } from "@/lib/apiClient";
import { leadershipTeam } from "@/lib/data/teamData";
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
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Power,
  Copy,
  AlertTriangle,
  RotateCcw,
  CloudUpload,
  Sparkles
} from "lucide-react";

export interface LeadershipEntry {
  _id: string;
  name: string;
  designation: string;
  shortBio?: string;
  description?: string;
  imageUrl?: string;
  imageKey?: string;
  linkedinUrl?: string;
  displayOrder: number;
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

// 5 Founding constant leadership members
export const DEFAULT_CONSTANT_LEADERS: LeadershipEntry[] = leadershipTeam.map((m, idx) => ({
  _id: m.id || `lead-${idx + 1}`,
  name: m.name,
  designation: m.role,
  shortBio: m.quote || "",
  description: m.bio || "",
  imageUrl: m.image || "/assests/rohit-1.webp",
  linkedinUrl: m.linkedin || "",
  displayOrder: idx + 1,
  isActive: true,
  isDeleted: false
}));

export default function AdminLeadershipManager() {
  const [leaders, setLeaders] = useState<LeadershipEntry[]>(DEFAULT_CONSTANT_LEADERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Search & Filter State
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "deleted">("all");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: DEFAULT_CONSTANT_LEADERS.length,
    totalPages: 1
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<LeadershipEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Helper to merge API list with 5 Constant members
  const mergeLeaders = useCallback((apiList: LeadershipEntry[], term: string, filter: string) => {
    const merged: LeadershipEntry[] = [...apiList];

    // Add any constant member that isn't already present in apiList (matched by name)
    DEFAULT_CONSTANT_LEADERS.forEach((constantLeader) => {
      const exists = merged.some(
        (m) => m.name.toLowerCase().trim() === constantLeader.name.toLowerCase().trim()
      );
      if (!exists) {
        merged.push(constantLeader);
      }
    });

    // Apply filtering
    let filtered = merged;

    if (filter === "active") {
      filtered = filtered.filter((l) => l.isActive && !l.isDeleted);
    } else if (filter === "inactive") {
      filtered = filtered.filter((l) => !l.isActive && !l.isDeleted);
    } else if (filter === "deleted") {
      filtered = filtered.filter((l) => l.isDeleted);
    } else {
      // "all" - don't show deleted by default unless searching
      if (!term.trim()) {
        filtered = filtered.filter((l) => !l.isDeleted);
      }
    }

    if (term.trim()) {
      const lower = term.toLowerCase().trim();
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(lower) ||
          l.designation.toLowerCase().includes(lower) ||
          (l.shortBio && l.shortBio.toLowerCase().includes(lower)) ||
          (l.description && l.description.toLowerCase().includes(lower))
      );
    }

    // Sort by displayOrder ASC, then name
    filtered.sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));

    return filtered;
  }, []);

  // Fetch leadership list with full query params matching Step 2
  const fetchLeaders = useCallback(async () => {
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
      } else if (statusFilter === "deleted") {
        queryParams.includeDeleted = "true";
      }

      const res = await adminApi.get<{ 
        data: LeadershipEntry[];
        pagination?: PaginationInfo;
      }>("/leadership/admin/list", {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` }
      });

      let fetchedList: LeadershipEntry[] = [];
      if (res.data && Array.isArray(res.data)) {
        fetchedList = res.data;
      } else {
        // Fallback to /leadership
        const fallbackRes = await adminApi.get<{ data: LeadershipEntry[] }>("/leadership", {
          params: queryParams,
          headers: { Authorization: `Bearer ${token}` }
        });
        if (fallbackRes.data && Array.isArray(fallbackRes.data)) {
          fetchedList = fallbackRes.data;
        }
      }

      // Merge with constant 5 members so they are NEVER missing
      const mergedList = mergeLeaders(fetchedList, searchTerm, statusFilter);
      setLeaders(mergedList);

      setPagination({
        page,
        limit,
        total: mergedList.length,
        totalPages: Math.max(1, Math.ceil(mergedList.length / limit))
      });
    } catch (err: any) {
      console.error("Error fetching leadership profiles:", err);
      const fallbackList = mergeLeaders([], searchTerm, statusFilter);
      setLeaders(fallbackList);
      setPagination({
        page: 1,
        limit,
        total: fallbackList.length,
        totalPages: Math.max(1, Math.ceil(fallbackList.length / limit))
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTerm, statusFilter, mergeLeaders]);

  useEffect(() => {
    fetchLeaders();
  }, [fetchLeaders]);

  const showToast = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    setSelectedLeader(null);
    setFormData({
      name: "",
      designation: "",
      shortBio: "",
      description: "",
      linkedinUrl: "",
      displayOrder: leaders.length > 0 ? Math.max(...leaders.map(l => l.displayOrder ?? 0)) + 1 : 1,
      isActive: true
    });
    setImageFile(null);
    setImagePreview(null);
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
      displayOrder: leader.displayOrder ?? 0,
      isActive: leader.isActive
    });
    setImageFile(null);
    setImagePreview(leader.imageUrl || null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Step 4 (Create) & Step 5 (Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.designation.trim()) {
      showToast("error", "Name and Designation are required.");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const fd = new FormData();
      
      fd.append("name", formData.name.trim());
      fd.append("designation", formData.designation.trim());
      if (formData.shortBio.trim()) fd.append("shortBio", formData.shortBio.trim());
      if (formData.description.trim()) fd.append("description", formData.description.trim());
      if (formData.linkedinUrl.trim()) fd.append("linkedinUrl", formData.linkedinUrl.trim());
      fd.append("displayOrder", String(formData.displayOrder));
      fd.append("isActive", String(formData.isActive));
      
      if (imageFile) {
        fd.append("image", imageFile);
      }

      // If updating a constant member that doesn't have a MongoDB ObjectId yet, use POST to create it in the cloud DB
      const isLocalTempId = selectedLeader?._id?.startsWith("lead-");
      const isUpdate = selectedLeader && !isLocalTempId;
      const url = isUpdate 
        ? `${ADMIN_API_BASE_URL}/leadership/${selectedLeader._id}`
        : `${ADMIN_API_BASE_URL}/leadership`;
        
      const method = isUpdate ? "PATCH" : "POST";

      const payloadDebug: Record<string, any> = {
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        shortBio: formData.shortBio.trim(),
        description: formData.description.trim(),
        linkedinUrl: formData.linkedinUrl.trim(),
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
        image: imageFile ? { name: imageFile.name, size: imageFile.size, type: imageFile.type } : null
      };

      console.group(`🚀 [LEADERSHIP ${method}] Request to Backend`);
      console.log("📍 Endpoint URL:", url);
      console.log("🔑 Auth Token Present:", Boolean(token), token ? `Bearer ${token.substring(0, 15)}...` : "(MISSING TOKEN)");
      console.log("📦 Form-Data Payload Sent:", payloadDebug);
      console.groupEnd();

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: fd
      });

      const responseText = await res.text();
      let responseData: any = {};
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { rawText: responseText };
      }

      console.group(`📥 [LEADERSHIP ${method} RESPONSE] Status: ${res.status} ${res.statusText}`);
      console.log("📍 URL:", url);
      console.log("🔢 HTTP Status Code:", res.status);
      console.log("📄 Parsed Response Data:", responseData);
      console.groupEnd();

      if (!res.ok) {
        const errorMsg = responseData.message || responseData.error || responseText || `HTTP ${res.status} Error`;
        console.error("❌ Leadership Save Failed:", {
          status: res.status,
          statusText: res.statusText,
          url,
          requestPayload: payloadDebug,
          responseBody: responseData
        });
        throw new Error(errorMsg);
      }

      showToast("success", isUpdate ? "Leadership profile updated successfully!" : "Leadership profile created successfully!");
      setIsModalOpen(false);
      fetchLeaders();
    } catch (err: any) {
      console.error("❌ Exception during Leadership Save:", err);
      showToast("error", err.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Sync default 5 constant members to MongoDB Cloud Run
  const handleSyncConstantMembers = async () => {
    setIsSyncing(true);
    const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
    let successCount = 0;
    let errorCount = 0;

    console.group("🚀 [LEADERSHIP SYNC] Starting batch sync of founding leaders");
    console.log("📍 Target Endpoint:", `${ADMIN_API_BASE_URL}/leadership`);
    console.log("🔑 Auth Token Present:", Boolean(token));

    for (const member of DEFAULT_CONSTANT_LEADERS) {
      try {
        const fd = new FormData();
        fd.append("name", member.name);
        fd.append("designation", member.designation);
        if (member.shortBio) fd.append("shortBio", member.shortBio);
        if (member.description) fd.append("description", member.description);
        if (member.linkedinUrl) fd.append("linkedinUrl", member.linkedinUrl);
        fd.append("displayOrder", String(member.displayOrder));
        fd.append("isActive", "true");

        const res = await fetch(`${ADMIN_API_BASE_URL}/leadership`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: fd
        });

        const resData = await res.json().catch(() => ({}));
        console.log(`👤 Syncing ${member.name} -> HTTP ${res.status}:`, resData);

        if (res.ok) {
          successCount++;
        } else {
          errorCount++;
          console.error(`❌ Failed to sync ${member.name}:`, resData);
        }
      } catch (err) {
        errorCount++;
        console.error(`❌ Network error syncing ${member.name}:`, err);
      }
    }
    console.groupEnd();

    setIsSyncing(false);
    if (successCount > 0) {
      showToast("success", `Successfully synced ${successCount} founding leadership profile(s) to cloud database!`);
      fetchLeaders();
    } else if (errorCount > 0) {
      showToast("error", "Could not sync profiles to backend. Check backend status or auth token in console.");
    } else {
      showToast("success", "Leadership profiles are synchronized!");
    }
  };

  // Quick toggle active status via PATCH
  const handleToggleActive = async (leader: LeadershipEntry) => {
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      
      // If it's a local constant member not yet created on backend, create it with toggled state
      if (leader._id.startsWith("lead-")) {
        const fd = new FormData();
        fd.append("name", leader.name);
        fd.append("designation", leader.designation);
        if (leader.shortBio) fd.append("shortBio", leader.shortBio);
        if (leader.description) fd.append("description", leader.description);
        if (leader.linkedinUrl) fd.append("linkedinUrl", leader.linkedinUrl);
        fd.append("displayOrder", String(leader.displayOrder));
        fd.append("isActive", String(!leader.isActive));

        await fetch(`${ADMIN_API_BASE_URL}/leadership`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });
      } else {
        const fd = new FormData();
        fd.append("isActive", String(!leader.isActive));

        const res = await fetch(`${ADMIN_API_BASE_URL}/leadership/${leader._id}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to update status");
        }
      }

      showToast("success", `Member ${!leader.isActive ? "activated" : "deactivated"} successfully.`);
      fetchLeaders();
    } catch (err: any) {
      showToast("error", err.message || "Could not toggle status.");
    }
  };

  // Step 6 — Soft Delete & Permanent Delete
  const handleDelete = async (id: string, name: string, permanent: boolean = false) => {
    const actionText = permanent 
      ? `PERMANENTLY delete "${name}"? This removes image from cloud storage and permanently destroys the database record.`
      : `soft delete (archive) "${name}"? You can view or restore it later.`;

    if (!window.confirm(`Are you sure you want to ${actionText}`)) return;
    
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      
      if (!id.startsWith("lead-")) {
        const endpoint = `/leadership/${id}${permanent ? "?permanent=true" : ""}`;
        await adminApi.delete(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      showToast("success", permanent ? `Member "${name}" permanently deleted.` : `Member "${name}" archived.`);
      fetchLeaders();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete leadership member.");
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
            <span className="text-xs text-slate-400">• Cloud Run APIs Connected</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Leadership Team & Advisors
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage executive profiles, biographies, photos, and order. All 5 founding members are always preserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncConstantMembers}
            title="Seed/Sync the 5 Founding Leaders to Cloud Database"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#C9A227]/40 text-[#C9A227] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-all disabled:opacity-50"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
            <span>Sync Default 5</span>
          </button>

          <button
            type="button"
            onClick={fetchLeaders}
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
            <span>Add Leadership Member</span>
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
            placeholder="Search by name, role or designation..."
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
            Status:
          </span>
          {(["all", "active", "inactive", "deleted"] as const).map((filter) => (
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
              {filter === "all" ? "All Profiles" : filter === "deleted" ? "Archived / Deleted" : filter}
            </button>
          ))}
        </div>

        {/* Limit Selector */}
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

      {/* Leadership Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
          <p className="text-xs text-slate-400">Loading leadership team from Cloud Run...</p>
        </div>
      ) : leaders.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-white/5 space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-base font-semibold text-slate-300">No leadership profiles found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm ? `No matches found for "${searchTerm}". Try a different search term or clear the filter.` : "Get started by adding executive and board profiles to showcase on the website."}
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 px-4 py-2 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#C9A227] hover:bg-[#C9A227] hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add First Member</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leaders.map((member) => (
            <div
              key={member._id}
              className={`rounded-3xl bg-[#091228] border ${
                member.isDeleted
                  ? "border-red-900/60 bg-red-950/10 opacity-75"
                  : member.isActive 
                    ? "border-white/10 hover:border-[#C9A227]/60" 
                    : "border-amber-500/30 opacity-80"
              } overflow-hidden transition-all flex flex-col justify-between shadow-2xl group hover:-translate-y-1 duration-300`}
            >
              <div>
                {/* Portrait Photo with Overlay Badges */}
                <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={member.imageUrl || "/assests/rohit-1.webp"}
                    alt={member.name}
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assests/rohit-1.webp";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091228] via-transparent to-transparent" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {member.isDeleted ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-900/90 backdrop-blur-md border border-red-500/50 text-[10px] font-bold text-white uppercase shadow-md">
                        Deleted
                      </span>
                    ) : member.isActive ? (
                      <button
                        onClick={() => handleToggleActive(member)}
                        title="Click to deactivate"
                        className="px-2.5 py-1 rounded-full bg-emerald-900/80 hover:bg-emerald-800 backdrop-blur-md border border-emerald-400/50 text-[10px] font-bold text-emerald-200 uppercase shadow-md flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Active</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleActive(member)}
                        title="Click to activate"
                        className="px-2.5 py-1 rounded-full bg-amber-900/80 hover:bg-amber-800 backdrop-blur-md border border-amber-400/50 text-[10px] font-bold text-amber-200 uppercase shadow-md flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Power className="w-3 h-3 text-amber-300" />
                        <span>Inactive</span>
                      </button>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-[#C9A227] shadow-md">
                    Order: {member.displayOrder}
                  </div>
                </div>

                {/* Member Information */}
                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#C9A227] transition-colors leading-snug">
                        {member.name}
                      </h3>
                      <button
                        onClick={() => handleCopyId(member._id)}
                        title="Copy MongoDB ObjectId"
                        className="p-1 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedId === member._id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-[#C9A227] mt-0.5 line-clamp-1">
                      {member.designation}
                    </p>
                  </div>

                  {member.shortBio && (
                    <p className="text-xs text-slate-300 font-medium line-clamp-1 leading-relaxed">
                      {member.shortBio}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {member.description || "No full description provided."}
                  </p>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-4 border-t border-white/5 bg-slate-950/40 flex items-center justify-between text-xs">
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-[#C9A227]" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">No LinkedIn</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#C9A227] hover:text-slate-950 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  {/* Soft Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(member._id, member.name, false)}
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 cursor-pointer transition-colors"
                    title="Soft Delete (Archive profile)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Permanent Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(member._id, member.name, true)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 cursor-pointer border border-red-500/20 transition-colors"
                    title="Permanent Delete (S3 file & DB record)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer matching Step 2 Specs */}
      {!isLoading && leaders.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
          <div className="text-xs text-slate-400">
            Showing <span className="font-semibold text-white">{leaders.length}</span> of{" "}
            <span className="font-semibold text-white">{pagination.total || leaders.length}</span> profiles 
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

      {/* Create / Edit Modal matching Step 4 (POST) and Step 5 (PATCH) */}
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
                <Users className="w-5 h-5 text-[#C9A227]" />
                <span>{selectedLeader ? "Edit Leadership Profile" : "Create Leadership Profile"}</span>
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
              {/* Row 1: Name & Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Designation / Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Executive Officer"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Short Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Short Bio <span className="text-slate-500 font-normal">(1-2 line punchy summary)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Experienced technology strategist & cybersecurity advocate."
                  value={formData.shortBio}
                  onChange={e => setFormData({ ...formData, shortBio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>

              {/* Row 3: Full Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Detailed Biography / Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Full background, past CXO roles, career highlights..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] resize-none transition-colors"
                />
              </div>

              {/* Row 4: LinkedIn & Display Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinUrl}
                    onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Display Order <span className="text-slate-500 font-normal">(0 = First in list)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.displayOrder}
                    onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
              </div>

              {/* Row 5: Photo Upload & Active Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5 items-center">
                {/* Photo Preview & Input */}
                <div className="md:col-span-8 flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-950">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border border-white/10 bg-slate-950 flex items-center justify-center shrink-0 text-slate-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Profile Image <span className="text-slate-500 font-normal">(JPG, PNG, WEBP)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#C9A227]/10 file:text-[#C9A227] hover:file:bg-[#C9A227]/20 file:cursor-pointer"
                    />
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="md:col-span-4 flex md:justify-end">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-slate-950 text-[#C9A227] focus:ring-[#C9A227] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-white">Active Profile</span>
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
                  <span>{selectedLeader ? "Save Changes" : "Create Profile"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
