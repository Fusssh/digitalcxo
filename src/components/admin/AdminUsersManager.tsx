"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/apiClient";
import { 
  Shield, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  Loader2, 
  AlertCircle, 
  RotateCcw, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck, 
  KeyRound, 
  ShieldAlert
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  mustChangeCredentials?: boolean;
  emailVerified?: boolean;
  pendingEmail?: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Search & Filters
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("admin");
  const [editIsActive, setEditIsActive] = useState(true);

  const showToast = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Step 1: GET /admin/users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const queryParams: Record<string, string> = {
        page: page.toString(),
        limit: "10"
      };
      if (searchTerm.trim()) queryParams.search = searchTerm.trim();
      if (roleFilter) queryParams.role = roleFilter;

      const res = await adminApi.get<{ data: AdminUser[]; pagination?: PaginationInfo }>("/admin/users", {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && Array.isArray(res.data)) {
        setUsers(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        } else {
          setPagination({
            page,
            limit: 10,
            total: res.data.length,
            totalPages: Math.max(1, Math.ceil(res.data.length / 10))
          });
        }
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch admin users.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Step 2: GET /admin/users/:id before opening edit modal
  const handleEditClick = async (user: AdminUser) => {
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const res = await adminApi.get<{ data: AdminUser }>(`/admin/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = res.data || user;
      setEditingUser(userData);
      setEditName(userData.name);
      setEditRole(userData.role);
      setEditIsActive(userData.isActive);
      setShowEditModal(true);
    } catch {
      // Fallback
      setEditingUser(user);
      setEditName(user.name);
      setEditRole(user.role);
      setEditIsActive(user.isActive);
      setShowEditModal(true);
    }
  };

  // Step 3: PATCH /admin/users/:id
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editName.trim()) {
      showToast("error", "Admin name cannot be blank.");
      return;
    }
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      await adminApi.patch(`/admin/users/${editingUser._id}`, {
        name: editName.trim(),
        role: editRole,
        isActive: editIsActive
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast("success", `Admin user "${editName}" updated successfully.`);
      setShowEditModal(false);
      fetchUsers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to update admin user.");
    } finally {
      setIsSaving(false);
    }
  };

  // Step 4: DELETE /admin/users/:id
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the admin account for "${name}"?`)) return;
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      await adminApi.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("success", `Admin user "${name}" deleted successfully.`);
      fetchUsers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete admin user.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Security &amp; IAM</span>
            <span className="text-xs text-slate-400">• Admin User Management</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            System Administrators
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage system administrator credentials, role-based access control (RBAC), and active authentication status.
          </p>
        </div>
        
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/10 shadow-lg">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none"
          />
        </div>
        <div className="w-full sm:w-56">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Admins Table */}
      <div className="bg-[#091228] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 whitespace-nowrap">
            <thead className="bg-[#050C1F] text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Administrator</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status &amp; Verification</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C9A227]" />
                    <span>Loading administrators...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No admin users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-bold text-[#C9A227] text-sm shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        user.role === "superadmin" 
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30" 
                          : "bg-sky-500/20 text-sky-300 border-sky-500/30"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
                            <XCircle className="w-3 h-3" /> Inactive
                          </span>
                        )}

                        {user.emailVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            Email Verified
                          </span>
                        )}

                        {user.mustChangeCredentials && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            <KeyRound className="w-3 h-3" /> Pending Credential Update
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {user.lastLoginAt ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formatDate(user.lastLoginAt)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Never</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
                          title="Edit Admin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id, user.name)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm">
            <span className="text-slate-400 text-xs">
              Page <strong className="text-white">{page}</strong> of {pagination.totalPages} ({pagination.total} total admins)
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Admin Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B132B] border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-md shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C9A227]" />
                Update Administrator
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Administrator Name <span className="text-rose-400">*</span>
                </label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:border-[#C9A227] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Email Address (Read-only)
                </label>
                <input 
                  type="email" 
                  value={editingUser.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/5 rounded-xl text-slate-400 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Role Permission</label>
                <select 
                  value={editRole}
                  onChange={e => setEditRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:border-[#C9A227] focus:outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={editIsActive}
                  onChange={e => setEditIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#C9A227] rounded cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs text-slate-200 font-semibold cursor-pointer">
                  Active Account (Enable system login)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
