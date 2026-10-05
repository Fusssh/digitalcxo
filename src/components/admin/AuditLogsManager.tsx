"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/apiClient";
import { 
  ClipboardList, 
  Search,
  Filter,
  Activity,
  Clock,
  User,
  Shield,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Database,
  RotateCcw,
  AlertCircle,
  Eye,
  X,
  Laptop,
  Globe,
  Tag,
  Code
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AuditLogAdmin {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuditLog {
  _id: string;
  action: string;
  adminId: AuditLogAdmin | null;
  adminEmail?: string;
  module: string;
  recordId: string | null;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AuditLogsManager() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });
  
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [adminIdFilter, setAdminIdFilter] = useState("");

  // Inspect Modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString()
      };
      
      if (moduleFilter) queryParams.module = moduleFilter.toUpperCase();
      if (actionFilter) queryParams.action = actionFilter.toUpperCase();
      if (adminIdFilter.trim()) queryParams.adminId = adminIdFilter.trim();

      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const res = await adminApi.get<{ data: AuditLog[]; pagination?: PaginationInfo }>("/admin/audit-logs", {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data && Array.isArray(res.data)) {
        setLogs(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        } else {
          setPagination({
            page,
            limit: 20,
            total: res.data.length,
            totalPages: Math.max(1, Math.ceil(res.data.length / 20))
          });
        }
      } else {
        setLogs([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch audit logs from server.");
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, moduleFilter, actionFilter, adminIdFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleClearFilters = () => {
    setModuleFilter("");
    setActionFilter("");
    setAdminIdFilter("");
    setPage(1);
  };

  const getModuleBadgeColor = (module: string) => {
    switch (module?.toUpperCase()) {
      case "AUTH": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "ADMIN_USER": return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "SETTINGS": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "CONTACT": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "LEADERSHIP": return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "PODCAST": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "EVENT": return "bg-amber-500/20 text-amber-200 border-amber-500/30";
      default: return "bg-slate-800 text-slate-300 border-white/10";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Compliance &amp; Governance</span>
            <span className="text-xs text-slate-400">• Immutable Security Ledger</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            System Audit Trail
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track administrative operations, IAM credentials changes, content modifications, and access events.
          </p>
        </div>
        
        <button 
          onClick={fetchLogs}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters Area */}
      <div className="bg-[#091228] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A227]">
            <Filter className="w-4 h-4" />
            <span>Audit Query Filters</span>
          </div>
          {(moduleFilter || actionFilter || adminIdFilter) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Module</label>
            <select
              value={moduleFilter}
              onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:border-[#C9A227] focus:outline-none"
            >
              <option value="">All Modules</option>
              <option value="AUTH">AUTH (Login / Passwords / Profile)</option>
              <option value="ADMIN_USER">ADMIN_USER (User IAM)</option>
              <option value="SETTINGS">SETTINGS (System Notifications)</option>
              <option value="CONTACT">CONTACT (Inquiries &amp; Status)</option>
              <option value="LEADERSHIP">LEADERSHIP (Leadership Team)</option>
              <option value="PODCAST">PODCAST (Episodes CMS)</option>
              <option value="EVENT">EVENT (Conclaves &amp; Highlights)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Action</label>
            <input
              type="text"
              placeholder="e.g. PODCAST_UPDATED, ADMIN_LOGIN"
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:border-[#C9A227] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Admin ObjectId</label>
            <input
              type="text"
              placeholder="Filter by Admin MongoDB ID..."
              value={adminIdFilter}
              onChange={(e) => { setAdminIdFilter(e.target.value); setPage(1); }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:border-[#C9A227] focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-[#091228] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 whitespace-nowrap">
            <thead className="bg-[#050C1F] text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action &amp; Module</th>
                <th className="px-6 py-4">Admin Actor</th>
                <th className="px-6 py-4">IP Address &amp; Target Record</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C9A227]" />
                    <span>Loading audit records...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Database className="w-8 h-8 text-slate-600 mb-2" />
                      <p>No audit logs found matching criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border w-fit ${getModuleBadgeColor(log.module)}`}>
                          {log.module}
                        </span>
                        <span className="font-mono font-bold text-white text-[11px]">
                          {log.action}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {log.adminId ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-[#C9A227] font-bold text-xs shrink-0">
                            {log.adminId.name?.charAt(0).toUpperCase() || "A"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-xs">{log.adminId.name}</span>
                            <span className="text-slate-400 text-[10px]">{log.adminId.email}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>{log.adminEmail || "System Activity"}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-mono">
                        <div className="flex items-center gap-1.5" title="IP Address">
                          <Activity className="w-3 h-3 text-slate-500" />
                          <span>{log.ipAddress || "::1"}</span>
                        </div>
                        {log.recordId && (
                          <div className="flex items-center gap-1.5 text-slate-500" title="Target Record ID">
                            <Database className="w-3 h-3" />
                            <span className="truncate max-w-[140px]">{log.recordId}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold"
                        title="View Full Audit Payload"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm">
            <span className="text-slate-400 text-xs">
              Page <strong className="text-white">{page}</strong> of {pagination.totalPages} ({pagination.total} total audit logs)
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inspect Audit Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B132B] border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-[#C9A227]">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Audit Event Details
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedLog._id}</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Module</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${getModuleBadgeColor(selectedLog.module)}`}>
                    {selectedLog.module}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Action</span>
                  <span className="font-mono font-bold text-white">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Timestamp</span>
                  <span className="text-slate-300">{formatDate(selectedLog.createdAt)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">IP Address</span>
                  <span className="font-mono text-slate-300">{selectedLog.ipAddress || "::1"}</span>
                </div>
              </div>

              {/* Admin Actor Card */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Actor Identity</span>
                {selectedLog.adminId ? (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-[#C9A227] font-bold flex items-center justify-center text-xs">
                      {selectedLog.adminId.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{selectedLog.adminId.name}</p>
                      <p className="text-slate-400">{selectedLog.adminId.email} • Role: <span className="uppercase text-amber-300">{selectedLog.adminId.role}</span></p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-300">{selectedLog.adminEmail || "System Activity"}</p>
                )}
              </div>

              {/* Target Record & Client Agent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Record ID</span>
                  <span className="font-mono text-slate-200 block truncate">{selectedLog.recordId || "None (Global Scope)"}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Client User Agent</span>
                  <span className="font-mono text-slate-300 block truncate text-[11px]">{selectedLog.userAgent || "Unknown"}</span>
                </div>
              </div>

              {/* Metadata JSON Inspector */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Audit Payload Metadata</span>
                </span>
                <pre className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-emerald-300 text-xs overflow-x-auto [scrollbar-width:thin]">
                  {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 
                    ? JSON.stringify(selectedLog.metadata, null, 2)
                    : "{\n  \"message\": \"No additional metadata recorded for this action\"\n}"}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
