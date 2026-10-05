"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi, ADMIN_API_BASE_URL } from "@/lib/apiClient";
import { 
  Users, 
  Search, 
  Trash2, 
  X, 
  Loader2, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Filter, 
  Download, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Copy,
  Clock,
  Briefcase,
  FileText,
  ShieldCheck,
  Award
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface JoinUsApplication {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  applicationType: "CXO" | "PARTNER" | "CAREER" | "OTHER";
  resumeUrl?: string;
  resumeKey?: string;
  formData: Record<string, any>;
  status: "NEW" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "ACCEPTED";
  adminNotes?: string;
  emailStatus?: string;
  emailError?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminJoinUsManager() {
  const [applications, setApplications] = useState<JoinUsApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [typeFilter, setTypeFilter] = useState<"ALL" | "CXO" | "PARTNER">("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // Selected & Actions
  const [selectedApp, setSelectedApp] = useState<JoinUsApplication | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const showToast = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Step 3: GET /api/v1/admin/join-us
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const queryParams: Record<string, string> = {
        page: String(page),
        limit: String(limit)
      };

      if (typeFilter !== "ALL") {
        queryParams.type = typeFilter;
      }

      if (statusFilter !== "ALL") {
        queryParams.status = statusFilter;
      }

      if (searchTerm.trim()) {
        queryParams.search = searchTerm.trim();
      }

      const res = await adminApi.get<{
        data: JoinUsApplication[];
        pagination?: PaginationInfo;
      }>("/admin/join-us", {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && Array.isArray(res.data)) {
        setApplications(res.data);
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
        setApplications([]);
      }
    } catch (err: any) {
      console.error("Error fetching join-us applications:", err);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, typeFilter, statusFilter, searchTerm]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Step 4: GET /api/v1/admin/join-us/:id
  const handleViewDossier = async (app: JoinUsApplication) => {
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const res = await adminApi.get<{ data: JoinUsApplication }>(`/admin/join-us/${app._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setSelectedApp(res.data);
        setAdminNotes(res.data.adminNotes || "");
      } else {
        setSelectedApp(app);
        setAdminNotes(app.adminNotes || "");
      }
    } catch {
      setSelectedApp(app);
      setAdminNotes(app.adminNotes || "");
    }
  };

  // Step 5: PATCH /api/v1/admin/join-us/:id/status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const res = await adminApi.patch<{ data: JoinUsApplication }>(
        `/admin/join-us/${id}/status`,
        { status: newStatus, adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("success", `Application status updated to ${newStatus}`);
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus as any, adminNotes });
      }
      fetchApplications();
    } catch (err: any) {
      showToast("error", err.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Step 6: DELETE /api/v1/admin/join-us/:id
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete application from "${name}"?`)) return;

    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      await adminApi.delete(`/admin/join-us/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast("success", "Application deleted successfully");
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp(null);
      }
      fetchApplications();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete application");
    }
  };

  // Step 7: POST /api/v1/admin/join-us/bulk-delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedIds.length} selected applications?`)) return;

    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      await adminApi.post(
        "/admin/join-us/bulk-delete",
        { ids: selectedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("success", `${selectedIds.length} applications deleted.`);
      setSelectedIds([]);
      fetchApplications();
    } catch (err: any) {
      showToast("error", err.message || "Failed bulk delete.");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(applications.map(a => a._id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Export CSV
  const exportCsv = () => {
    if (applications.length === 0) return;
    const headers = ["ID", "Type", "Name", "Email", "Phone", "Company", "Designation", "Status", "Date"];
    const rows = applications.map(a => [
      a._id,
      a.applicationType,
      `"${a.firstName} ${a.lastName}"`,
      a.email,
      a.phone,
      `"${a.company || ""}"`,
      `"${a.designation || ""}"`,
      a.status,
      a.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `digitalcxos_applications_${typeFilter.toLowerCase()}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
      case "Approved":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "SHORTLISTED":
        return "bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/40";
      case "REVIEWED":
        return "bg-sky-500/20 text-sky-300 border-sky-500/40";
      case "REJECTED":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "NEW":
      default:
        return "bg-amber-400/20 text-amber-300 border-amber-400/40";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Feedback */}
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
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Fraternity &amp; Partnerships</span>
            <span className="text-xs text-slate-400">• Cloud Run /api/v1/admin/join-us</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Membership &amp; Partner Submissions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review, shortlist, update status, and manage verified CXO and Enterprise Partner intake applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={exportCsv}
            className="px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchApplications}
            title="Refresh submissions"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#C9A227]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs">
          {(["ALL", "CXO", "PARTNER"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTypeFilter(t);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                typeFilter === t
                  ? "bg-[#C9A227] text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t === "ALL" ? "All Intakes" : t === "CXO" ? "CXO Members" : "Enterprise Partners"}
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-xl justify-end">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, company, email..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#C9A227]"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="REVIEWED">REVIEWED</option>
            <option value="SHORTLISTED">SHORTLISTED</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#091228] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#050C1F] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={applications.length > 0 && selectedIds.length === applications.length}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 rounded border-white/20 bg-slate-950 text-[#C9A227] focus:ring-[#C9A227] cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Applicant &amp; Title</th>
                <th className="px-4 py-3">Designation &amp; Organization</th>
                <th className="px-4 py-3">Contact Details</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-slate-400">
                    <Loader2 className="w-7 h-7 text-[#C9A227] animate-spin mx-auto mb-2" />
                    <span>Loading verified applications...</span>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <span>No applications found matching query criteria.</span>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(app._id)}
                        onChange={() => toggleSelect(app._id)}
                        className="w-3.5 h-3.5 rounded border-white/20 bg-slate-950 text-[#C9A227] focus:ring-[#C9A227] cursor-pointer"
                      />
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
                        app.applicationType === "CXO" 
                          ? "bg-amber-400/10 text-amber-300 border-amber-400/30" 
                          : "bg-sky-400/10 text-sky-300 border-sky-400/30"
                      }`}>
                        {app.applicationType}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-white">
                          {app.formData?.title ? `${app.formData.title} ` : ""}{app.firstName} {app.lastName}
                        </p>
                        <button
                          onClick={() => handleCopy(app._id, app._id)}
                          title="Copy ObjectId"
                          className="p-1 rounded text-slate-600 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === app._id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {app.formData?.city ? `${app.formData.city}, ${app.formData.state || app.formData.country || ""}` : app.formData?.hqLocation || "India"}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-amber-300">{app.designation}</p>
                      <p className="text-slate-300 text-[11px]">{app.company}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-slate-200">{app.email}</p>
                      <p className="text-slate-400 text-[11px] font-mono">{app.phone}</p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-slate-400 font-mono">
                      {formatDate(app.createdAt)}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewDossier(app)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#C9A227] hover:text-slate-950 text-white font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </button>

                        <button
                          onClick={() => handleDelete(app._id, `${app.firstName} ${app.lastName}`)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>
            Page <strong className="text-white">{pagination.page}</strong> of <strong className="text-white">{pagination.totalPages}</strong> ({pagination.total} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-white/10 text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-white/10 text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dossier Detail View Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setSelectedApp(null)} />
          
          <div className="relative z-10 bg-[#0B132B] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0B132B]/95 backdrop-blur-md z-20">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                  selectedApp.applicationType === "CXO" 
                    ? "bg-amber-400/20 text-amber-300 border-amber-400/40" 
                    : "bg-sky-400/20 text-sky-300 border-sky-400/40"
                }`}>
                  {selectedApp.applicationType} DOSSIER
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {selectedApp._id}</span>
              </div>

              <button 
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Profile Overview Card */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    {selectedApp.formData?.title ? `${selectedApp.formData.title} ` : ""}{selectedApp.firstName} {selectedApp.lastName}
                  </h3>
                  <p className="text-sm font-semibold text-[#C9A227] mt-0.5">
                    {selectedApp.designation} • <span className="text-slate-200">{selectedApp.company}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Submitted: {formatDate(selectedApp.createdAt)} • IP: {selectedApp.ipAddress || "::1"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${getStatusBadge(selectedApp.status)}`}>
                    Status: {selectedApp.status}
                  </span>
                </div>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Official Email</span>
                  </span>
                  <a href={`mailto:${selectedApp.email}`} className="text-xs font-semibold text-white hover:underline block truncate">
                    {selectedApp.email}
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-400" />
                    <span>Phone Number</span>
                  </span>
                  <p className="text-xs font-semibold text-white font-mono">{selectedApp.phone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Location</span>
                  </span>
                  <p className="text-xs font-semibold text-white truncate">
                    {selectedApp.formData?.city ? `${selectedApp.formData.city}, ${selectedApp.formData.state || ""}` : selectedApp.formData?.hqLocation || "India"}
                  </p>
                </div>
              </div>

              {/* Form Data Custom Fields */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Submitted Application Metadata</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {selectedApp.formData?.linkedin && (
                    <div className="space-y-1">
                      <span className="text-slate-400 block font-semibold">LinkedIn Profile:</span>
                      <a href={selectedApp.formData.linkedin} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1.5 truncate">
                        <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                        <span>{selectedApp.formData.linkedin}</span>
                      </a>
                    </div>
                  )}

                  {selectedApp.formData?.organizationWebsite || selectedApp.formData?.companyWebsite ? (
                    <div className="space-y-1">
                      <span className="text-slate-400 block font-semibold">Corporate Website:</span>
                      <a href={selectedApp.formData.organizationWebsite || selectedApp.formData.companyWebsite} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1 truncate">
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span>{selectedApp.formData.organizationWebsite || selectedApp.formData.companyWebsite}</span>
                      </a>
                    </div>
                  ) : null}

                  {selectedApp.formData?.leadershipExperienceYears !== undefined && (
                    <div className="space-y-1">
                      <span className="text-slate-400 block font-semibold">Leadership Experience:</span>
                      <p className="text-white font-medium">{selectedApp.formData.leadershipExperienceYears} Years</p>
                    </div>
                  )}

                  {selectedApp.formData?.boardInteractionExperience && (
                    <div className="space-y-1">
                      <span className="text-slate-400 block font-semibold">Board Interaction Experience:</span>
                      <p className="text-white font-medium">{selectedApp.formData.boardInteractionExperience}</p>
                    </div>
                  )}

                  {selectedApp.formData?.contributeVia && (
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-slate-400 block font-semibold">Contribute Via:</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(Array.isArray(selectedApp.formData.contributeVia) ? selectedApp.formData.contributeVia : [selectedApp.formData.contributeVia]).map((c: string, idx: number) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-[11px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedApp.formData?.strategicAreasOfInterest && (
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-slate-400 block font-semibold">Strategic Areas of Interest:</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(Array.isArray(selectedApp.formData.strategicAreasOfInterest) ? selectedApp.formData.strategicAreasOfInterest : [selectedApp.formData.strategicAreasOfInterest]).map((s: string, idx: number) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-[11px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedApp.formData?.industry && (
                    <div className="space-y-1">
                      <span className="text-slate-400 block font-semibold">Industry Focus:</span>
                      <p className="text-white font-medium">
                        {Array.isArray(selectedApp.formData.industry) ? selectedApp.formData.industry.join(", ") : selectedApp.formData.industry}
                      </p>
                    </div>
                  )}

                  {selectedApp.formData?.valueOffered && (
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-slate-400 block font-semibold">Value Offered / Executive Solutions:</span>
                      <p className="text-white font-medium leading-relaxed">{selectedApp.formData.valueOffered}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update & Review Form */}
              <div className="p-6 rounded-2xl bg-[#091228] border border-[#C9A227]/30 space-y-4 shadow-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Executive Review &amp; Status Transition</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Admin Notes &amp; Secretariat Directives
                    </label>
                    <textarea
                      rows={3}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add confidential review notes, interview recommendations, or onboarding status..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs font-semibold text-slate-400 mr-2">Update Status:</span>
                    {(["NEW", "REVIEWED", "SHORTLISTED", "ACCEPTED", "REJECTED"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        disabled={isUpdatingStatus}
                        onClick={() => handleUpdateStatus(selectedApp._id, st)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          selectedApp.status === st
                            ? "bg-[#C9A227] text-slate-950 shadow-md"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
