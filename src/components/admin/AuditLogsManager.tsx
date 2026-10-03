"use client";

import React, { useState, useEffect } from "react";
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
  Database
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
  metadata?: any;
  createdAt: string;
}

export default function AuditLogsManager() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [adminIdFilter, setAdminIdFilter] = useState("");

  const fetchLogs = async () => {
    setIsLoading(true);
    setError("");
    try {
      const queryParams: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString()
      };
      
      if (moduleFilter) queryParams.module = moduleFilter.toUpperCase();
      if (actionFilter) queryParams.action = actionFilter.toUpperCase();
      if (adminIdFilter) queryParams.adminId = adminIdFilter;

      const res = await adminApi.get<{ data: AuditLog[], pagination: any }>('/admin/audit-logs', {
        params: queryParams,
        headers: { Authorization: "Bearer DEMO_TOKEN" } // Replace with real token logic
      });
      
      setLogs(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch audit logs");
      // Fallback data for demo purposes if backend isn't running
      setLogs([
        {
          _id: "demo-log-1",
          action: "ADMIN_USER_UPDATED",
          module: "ADMIN_USER",
          adminId: { _id: "admin-1", name: "System Admin", email: "admin@example.com", role: "admin" },
          recordId: "user-123",
          ipAddress: "127.0.0.1",
          userAgent: "Mozilla/5.0...",
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, moduleFilter, actionFilter, adminIdFilter]);

  const handleClearFilters = () => {
    setModuleFilter("");
    setActionFilter("");
    setAdminIdFilter("");
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#C9A227]" />
            System Audit Logs
          </h2>
          <p className="text-sm text-slate-400 mt-1">Review system activities, configuration changes, and access logs.</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Refresh Logs
        </button>
      </div>

      {/* Filters Area */}
      <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
          <Filter className="w-4 h-4 text-[#C9A227]" />
          Filter Records
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Module</label>
            <select
              value={moduleFilter}
              onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none"
            >
              <option value="">All Modules</option>
              <option value="ADMIN_USER">Admin User</option>
              <option value="AUTH">Authentication</option>
              <option value="PODCAST">Podcast</option>
              <option value="LEADERSHIP">Leadership</option>
              <option value="CONTACT">Contact</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">Action</label>
            <input
              type="text"
              placeholder="e.g. PODCAST_UPDATED"
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Admin ID</label>
            <input
              type="text"
              placeholder="Search by Admin ID..."
              value={adminIdFilter}
              onChange={(e) => { setAdminIdFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleClearFilters}
              className="w-full px-4 py-2 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-slate-300 text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
          Failed to load from API: {error}. Showing fallback dummy data.
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action / Module</th>
                <th className="px-6 py-4">Admin Detail</th>
                <th className="px-6 py-4">IP & Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C9A227]" />
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
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
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="font-medium">{formatDate(log.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-slate-800/80 text-sky-300 border border-sky-500/20 w-fit">
                          {log.module}
                        </span>
                        <span className="font-semibold text-slate-200 text-xs">
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {log.adminId ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[#C9A227] font-bold text-xs shrink-0">
                            {log.adminId.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-200 font-medium text-xs">{log.adminId.name}</span>
                            <span className="text-slate-500 text-[10px]">{log.adminId.email}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <User className="w-4 h-4" />
                          <span>{log.adminEmail || 'System / Unknown'}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5" title="IP Address">
                          <Activity className="w-3.5 h-3.5 text-slate-500" />
                          {log.ipAddress || "N/A"}
                        </div>
                        {log.recordId && (
                          <div className="flex items-center gap-1.5" title="Record ID">
                            <Database className="w-3.5 h-3.5 text-slate-500" />
                            <span className="font-mono text-[10px]">{log.recordId}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm">
            <span className="text-slate-400">Page <span className="text-white font-medium">{page}</span> of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-5 h-5 text-slate-300" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
