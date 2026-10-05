"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi, ADMIN_API_BASE_URL } from "@/lib/apiClient";
import { 
  HeartHandshake, 
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
  Sparkles,
  Layers,
  Eye
} from "lucide-react";

export interface SocialInitiativeEntry {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageKey?: string;
  displayOrder: number;
  isActive: boolean;
  isDeleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const DEFAULT_FALLBACK_INITIATIVES: SocialInitiativeEntry[] = [
  {
    _id: "si-default-1",
    title: "CXOs for Naya Bharat",
    description: "Mobilizing CXO leaders to contribute strategic ideas, digital blueprints, and national technology mentorship.",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
    displayOrder: 1,
    isActive: true,
    isDeleted: false
  },
  {
    _id: "si-default-2",
    title: "Executive Vitality & Wellness Retreats",
    description: "Hosting immersive wellness experiences focused on rejuvenation, mental clarity, and preventive stress resilience.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
    displayOrder: 2,
    isActive: true,
    isDeleted: false
  },
  {
    _id: "si-default-3",
    title: "Founders' Personal Giving Pledge",
    description: "Our founders personally pledge 3% of annual revenue to support meaningful social equity and digital education initiatives.",
    imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop",
    displayOrder: 3,
    isActive: true,
    isDeleted: false
  }
];

export default function AdminSocialInitiativesManager() {
  const [initiatives, setInitiatives] = useState<SocialInitiativeEntry[]>(DEFAULT_FALLBACK_INITIATIVES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Search & Filter State
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "deleted">("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: DEFAULT_FALLBACK_INITIATIVES.length,
    totalPages: 1
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<SocialInitiativeEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    displayOrder: 0,
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick Notification Helper
  const showFeedback = (msg: string, isErr = false) => {
    if (isErr) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 6000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // =========================================================================
  // API Fetcher: GET /api/v1/social-initiatives (Step 49 Admin List)
  // =========================================================================
  const fetchInitiatives = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", page.toString());
      queryParams.set("limit", limit.toString());
      
      if (searchTerm.trim()) {
        queryParams.set("search", searchTerm.trim());
      }
      
      if (statusFilter === "active") {
        queryParams.set("isActive", "true");
      } else if (statusFilter === "inactive") {
        queryParams.set("isActive", "false");
      } else if (statusFilter === "deleted") {
        queryParams.set("includeDeleted", "true");
      }

      const res = await adminApi.get<{
        success: boolean;
        data: SocialInitiativeEntry[];
        pagination?: PaginationInfo;
      }>(`/social-initiatives?${queryParams.toString()}`);

      if (res && res.data && Array.isArray(res.data)) {
        setInitiatives(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        } else {
          setPagination({
            page,
            limit,
            total: res.data.length,
            totalPages: Math.ceil(res.data.length / limit) || 1
          });
        }
      }
    } catch (err: any) {
      console.warn("Could not fetch remote social initiatives, using fallback data:", err.message);
      // Fallback local filtering
      let filtered = [...DEFAULT_FALLBACK_INITIATIVES];
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(q) || 
          (item.description && item.description.toLowerCase().includes(q))
        );
      }
      if (statusFilter === "active") filtered = filtered.filter(item => item.isActive);
      if (statusFilter === "inactive") filtered = filtered.filter(item => !item.isActive);
      
      setInitiatives(filtered);
      setPagination({
        page: 1,
        limit,
        total: filtered.length,
        totalPages: 1
      });
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [page, limit, searchTerm, statusFilter]);

  useEffect(() => {
    fetchInitiatives();
  }, [fetchInitiatives]);

  // Handle Manual Refresh
  const handleRefresh = () => {
    setIsSyncing(true);
    fetchInitiatives();
  };

  // Copy Initiative ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setSelectedInitiative(null);
    setFormData({
      title: "",
      description: "",
      displayOrder: (initiatives.length > 0 ? Math.max(...initiatives.map(i => i.displayOrder || 0)) + 1 : 1),
      isActive: true
    });
    setSelectedFile(null);
    setFilePreview(null);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  // Open Edit Modal (Step 50: GET /api/v1/social-initiatives/:id or current item)
  const openEditModal = async (item: SocialInitiativeEntry) => {
    setSelectedInitiative(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive ?? true
    });
    setSelectedFile(null);
    setFilePreview(item.imageUrl || null);
    setErrorMessage("");
    setIsModalOpen(true);

    // Fetch full single item from API if it has an ObjectId
    if (item._id && item._id.length === 24) {
      try {
        const res = await adminApi.get<{ data: SocialInitiativeEntry }>(`/social-initiatives/${item._id}`);
        if (res.data) {
          setFormData({
            title: res.data.title,
            description: res.data.description || "",
            displayOrder: res.data.displayOrder || 0,
            isActive: res.data.isActive ?? true
          });
          if (res.data.imageUrl) setFilePreview(res.data.imageUrl);
        }
      } catch (err) {
        console.warn("Failed to load individual social initiative record:", err);
      }
    }
  };

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      showFeedback("Image file must be under 10 MB.", true);
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      showFeedback("Only JPEG, PNG, WEBP, GIF, and SVG images are supported.", true);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // =========================================================================
  // Save Handler: POST /social-initiatives (Step 51) / PATCH /:id (Step 52)
  // =========================================================================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showFeedback("Title is required.", true);
      return;
    }

    if (!selectedInitiative && !selectedFile) {
      showFeedback("An initiative banner image is required for creation.", true);
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const isEditing = !!selectedInitiative;
      const targetId = selectedInitiative?._id;
      const token = typeof window !== "undefined" ? localStorage.getItem("digitalcxo_admin_token") || "" : "";

      console.log(`🚀 [SOCIAL ${isEditing ? "PATCH" : "POST"}] Request to Backend`);

      if (selectedFile) {
        // Multipart Form-Data
        const data = new FormData();
        data.append("title", formData.title.trim());
        data.append("description", formData.description.trim());
        data.append("displayOrder", formData.displayOrder.toString());
        data.append("isActive", formData.isActive.toString());
        data.append("image", selectedFile);

        const endpoint = isEditing 
          ? `${ADMIN_API_BASE_URL}/social-initiatives/${targetId}` 
          : `${ADMIN_API_BASE_URL}/social-initiatives`;

        const response = await fetch(endpoint, {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: data
        });

        const resData = await response.json().catch(() => ({}));

        console.log(`📥 [SOCIAL RESPONSE] Status: ${response.status}`, resData);

        if (!response.ok || !resData.success) {
          throw new Error(resData.message || `Request failed with status ${response.status}`);
        }

        showFeedback(isEditing ? "Social initiative updated successfully!" : "Social initiative created successfully!");
      } else {
        // JSON payload for PATCH without image file update
        const payload: Record<string, any> = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          displayOrder: Number(formData.displayOrder),
          isActive: formData.isActive
        };

        const res = await adminApi.patch<{ success: boolean; message?: string }>(
          `/social-initiatives/${targetId}`,
          payload
        );

        if (!res.success && res.success !== undefined) {
          throw new Error(res.message || "Failed to update social initiative.");
        }

        showFeedback("Social initiative updated successfully!");
      }

      setIsModalOpen(false);
      fetchInitiatives();
    } catch (err: any) {
      console.error("❌ Social Initiative Save Failed:", err);
      showFeedback(err.message || "Failed to save social initiative.", true);
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================================
  // Delete Handler: DELETE /api/v1/social-initiatives/:id (Step 53)
  // =========================================================================
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      console.log(`🚀 [SOCIAL DELETE] Requesting deletion for ${deleteTarget.id}`);
      const res = await adminApi.delete<{ success: boolean; message?: string }>(
        `/social-initiatives/${deleteTarget.id}`
      );

      if (!res.success && res.success !== undefined) {
        throw new Error(res.message || "Failed to delete social initiative.");
      }

      showFeedback("Social initiative removed successfully.");
      setDeleteTarget(null);
      fetchInitiatives();
    } catch (err: any) {
      console.error("❌ Social Initiative Deletion Failed:", err);
      showFeedback(err.message || "Failed to delete social initiative.", true);
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Active Status Toggle (Step 52 PATCH)
  const handleToggleStatus = async (item: SocialInitiativeEntry) => {
    try {
      const newStatus = !item.isActive;
      // Optimistic update
      setInitiatives(prev => prev.map(i => i._id === item._id ? { ...i, isActive: newStatus } : i));

      await adminApi.patch(`/social-initiatives/${item._id}`, { isActive: newStatus });
      showFeedback(`Initiative marked as ${newStatus ? "Active" : "Inactive"}.`);
    } catch (err: any) {
      console.error("Status toggle error:", err);
      showFeedback(err.message || "Failed to update active status.", true);
      fetchInitiatives();
    }
  };

  const activeCount = initiatives.filter(i => i.isActive && !i.isDeleted).length;
  const totalCount = pagination.total || initiatives.length;

  return (
    <div className="space-y-6">
      {/* Alert Banners */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start justify-between gap-3 text-red-300 text-xs shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage("")} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-300 text-xs shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage("")} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] font-mono">
              Philanthropy &amp; Social Impact
            </span>
            <span className="text-xs text-slate-400">• Step 48 - 53 APIs</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1 flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 text-[#C9A227]" />
            <span>Our Social Initiatives Management</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl mt-0.5">
            Manage high-impact community causes, executive vitality campaigns, and philanthropic commitments shown across the public portal carousel.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#C9A227]" : ""}`} />
            <span>Sync Cloud Data</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:shadow-[#C9A227]/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Initiative</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#091228] border border-white/10 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Total Initiatives
            </span>
            <span className="text-2xl font-serif font-bold text-white mt-0.5 block">{totalCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
            <HeartHandshake className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091228] border border-white/10 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Active on Public Website
            </span>
            <span className="text-2xl font-serif font-bold text-emerald-400 mt-0.5 block">{activeCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Power className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091228] border border-white/10 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Inactive / Drafts
            </span>
            <span className="text-2xl font-serif font-bold text-slate-400 mt-0.5 block">
              {Math.max(0, totalCount - activeCount)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/30 flex items-center justify-center text-slate-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#091228] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search initiatives by title or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters + View Mode */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs">
            {(["all", "active", "inactive"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setStatusFilter(filter);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === filter
                    ? "bg-[#C9A227] text-slate-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "cards" ? "bg-white/15 text-[#C9A227]" : "text-slate-400 hover:text-white"
              }`}
              title="Card Grid View"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white/15 text-[#C9A227]" : "text-slate-400 hover:text-white"
              }`}
              title="Detailed Table View"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-24 rounded-3xl bg-[#091228] border border-white/10 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Synchronizing social initiatives...</p>
        </div>
      ) : initiatives.length === 0 ? (
        <div className="py-20 rounded-3xl bg-[#091228] border border-white/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-white">No Social Initiatives Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm ? "No initiatives match your search query." : "No social initiatives have been created yet."}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Initiative</span>
          </button>
        </div>
      ) : viewMode === "cards" ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/60 overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl group"
            >
              <div>
                {/* Banner Photo */}
                <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091228] via-black/20 to-black/30" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#C9A227] font-mono">
                      Order #{item.displayOrder ?? 0}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border transition-all cursor-pointer ${
                        item.isActive
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-red-500/20 text-red-300 border-red-500/40"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-[#C9A227] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {item.description || "No description provided for this initiative."}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between text-xs">
                {/* ID Copier */}
                <button
                  type="button"
                  onClick={() => handleCopyId(item._id)}
                  className="text-[11px] font-mono text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy ID"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedId === item._id ? "Copied!" : item._id.slice(0, 8) + "..."}</span>
                </button>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#C9A227] hover:text-slate-950 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: item._id, title: item.title })}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 cursor-pointer border border-red-500/20 transition-colors"
                    title="Delete Initiative"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#091228] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] text-slate-400 font-bold uppercase bg-slate-900/80 border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Initiative</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {initiatives.map((item) => (
                  <tr key={item._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-white/10">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-snug">{item.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-md">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#C9A227] font-bold">
                      #{item.displayOrder ?? 0}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                          item.isActive
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-red-500/20 text-red-300 border border-red-500/40"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {item._id.slice(0, 10)}...
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C9A227] hover:text-slate-950 text-white font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ id: item._id, title: item.title })}
                          className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {!isLoading && initiatives.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
          <div className="text-xs text-slate-400">
            Showing <span className="font-semibold text-white">{initiatives.length}</span> of{" "}
            <span className="font-semibold text-white">{pagination.total || initiatives.length}</span> initiatives 
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

      {/* =========================================================================
          Create / Edit Modal (Step 51 POST / Step 52 PATCH)
      ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md" 
            onClick={() => setIsModalOpen(false)} 
          />
          
          <div className="relative z-10 bg-[#0B132B] border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0B132B]/95 backdrop-blur-md z-20">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#C9A227]" />
                <span>{selectedInitiative ? "Edit Social Initiative" : "Create Social Initiative"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 text-xs">
              {/* Title (max 120 chars) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold">
                    Initiative Title <span className="text-red-400">*</span>
                  </label>
                  <span className={`text-[10px] font-mono ${formData.title.length > 120 ? "text-red-400" : "text-slate-500"}`}>
                    {formData.title.length}/120
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. CXOs for Naya Bharat"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              {/* Description (max 500 chars) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold">Short Narrative / Description</label>
                  <span className={`text-[10px] font-mono ${formData.description.length > 500 ? "text-red-400" : "text-slate-500"}`}>
                    {formData.description.length}/500
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the cause, target community, leadership involvement, and social goals..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] resize-none"
                />
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="text-slate-300 font-semibold mb-1.5 block">
                  Campaign Banner Image {!selectedInitiative && <span className="text-red-400">*</span>}
                </label>
                
                <div className="space-y-3">
                  {filePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] w-full bg-slate-900 group">
                      <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="px-3 py-1.5 rounded-xl bg-[#C9A227] text-slate-950 font-bold cursor-pointer hover:bg-[#D4AF37] transition-colors">
                          Change Photo
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-white/15 hover:border-[#C9A227]/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all text-center">
                      <CloudUpload className="w-8 h-8 text-[#C9A227]" />
                      <div>
                        <p className="text-slate-200 font-semibold">Click to upload initiative photo</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">JPEG, PNG, WEBP, SVG or GIF (Max 10 MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Display Order & Active Status */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-slate-300 font-semibold mb-1.5 block">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold mb-1.5 block">Status</label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs border transition-all cursor-pointer ${
                      formData.isActive
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-red-500/20 text-red-300 border-red-500/40"
                    }`}
                  >
                    {formData.isActive ? "Active (Visible)" : "Inactive (Hidden)"}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{selectedInitiative ? "Save Changes" : "Create Initiative"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          Delete Confirmation Modal (Step 53 DELETE)
      ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md" 
            onClick={() => setDeleteTarget(null)} 
          />
          <div className="relative z-10 bg-[#0B132B] border border-red-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-serif font-bold text-white">Permanently Remove Initiative?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete <span className="font-semibold text-white">"{deleteTarget.title}"</span>? This will permanently purge the record and file from cloud storage.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
