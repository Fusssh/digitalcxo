"use client";

import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/apiClient";
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  X, 
  Mail, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Database, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Send,
  AlertTriangle
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ContactEntry {
  _id: string;
  title?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  adminNotes?: string;
  emailStatus?: string;
  emailError?: string | null;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContactManager() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Debounced

  // Modal State
  const [selectedContact, setSelectedContact] = useState<ContactEntry | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const showToast = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const fetchContacts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const queryParams: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString()
      };
      
      if (statusFilter) queryParams.status = statusFilter.toUpperCase();
      if (searchTerm.trim()) queryParams.search = searchTerm.trim();

      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const res = await adminApi.get<{ data: ContactEntry[]; pagination: any }>("/admin/contacts", {
        params: queryParams,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data && Array.isArray(res.data)) {
        setContacts(res.data);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
        }
      } else {
        setContacts([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch contacts");
      setContacts([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchContacts();
  }, [page, statusFilter, searchTerm]);

  const handleOpenContact = async (contact: ContactEntry) => {
    // Step 3: GET /admin/contacts/:id (registers CONTACT_VIEWED audit log)
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const res = await adminApi.get<{ data: ContactEntry }>(`/admin/contacts/${contact._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setSelectedContact(res.data);
        setEditStatus(res.data.status || "NEW");
        setEditNotes(res.data.adminNotes || "");
      } else {
        setSelectedContact(contact);
        setEditStatus(contact.status || "NEW");
        setEditNotes(contact.adminNotes || "");
      }
    } catch {
      setSelectedContact(contact);
      setEditStatus(contact.status || "NEW");
      setEditNotes(contact.adminNotes || "");
    }
  };

  const handleUpdateContact = async () => {
    if (!selectedContact) return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      await adminApi.patch(`/admin/contacts/${selectedContact._id}/status`, {
        status: editStatus.toUpperCase(),
        adminNotes: editNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast("success", "Contact inquiry status updated successfully.");
      setSelectedContact(null);
      fetchContacts();
    } catch (err: any) {
      showToast("error", err.message || "Failed to update contact status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteContact = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the contact inquiry from "${name}"?`)) return;
    
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      await adminApi.delete(`/admin/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("success", "Contact inquiry deleted successfully.");
      fetchContacts();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete contact inquiry.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "NEW": return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "READ": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "IN_PROGRESS": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "RESOLVED": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "SPAM": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const getEmailStatusBadge = (emailStatus?: string) => {
    switch (emailStatus?.toUpperCase()) {
      case "SENT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Email: Sent</span>;
      case "FAILED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">Email: Failed</span>;
      case "DISABLED":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">Email: Off</span>;
      default:
        return null;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Management Portal</span>
            <span className="text-xs text-slate-400">• Contact Inquiries &amp; Secretariat Inbox</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Contact Submissions &amp; Inquiries
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            View submitted inquiries, update workflow status, track email notification states, and attach internal audit notes.
          </p>
        </div>
        
        <button 
          onClick={fetchContacts}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Database className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by sender, email, subject..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-[#C9A227]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-[#C9A227]"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="READ">Read</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="SPAM">Spam</option>
        </select>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Contacts Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#091228] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 whitespace-nowrap">
            <thead className="bg-[#050C1F] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Sender Details</th>
                <th className="px-4 py-3">Subject &amp; Message</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status &amp; Delivery</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C9A227]" />
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => {
                  const fullName = `${c.title || ""} ${c.firstName} ${c.lastName || ""}`.trim();
                  return (
                    <tr key={c._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-white">{fullName || "Anonymous"}</p>
                        <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>
                          {c.phone && <span>{c.phone}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-200 mb-0.5 truncate max-w-xs">{c.subject || "New Website Inquiry"}</p>
                        <p className="truncate max-w-xs text-slate-400">{c.message}</p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {formatDate(c.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(c.status)}`}>
                            {c.status}
                          </span>
                          {getEmailStatusBadge(c.emailStatus)}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenContact(c)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleDeleteContact(c._id, fullName)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm">
            <span className="text-slate-400">Page <span className="text-white font-medium">{page}</span> of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review & Edit Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedContact(null)}
          />
          <div className="relative bg-[#0B132B] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0B132B]/95 backdrop-blur-md z-10">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C9A227]" />
                Inquiry Details
              </h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Sender Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Sender</p>
                  <p className="text-sm font-semibold text-white">{selectedContact.title || ""} {selectedContact.firstName} {selectedContact.lastName || ""}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Date</p>
                  <p className="text-sm text-slate-300">{formatDate(selectedContact.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Email</p>
                  <p className="text-sm text-[#C9A227] truncate">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Phone</p>
                  <p className="text-sm text-slate-300">{selectedContact.phone || "N/A"}</p>
                </div>
                {selectedContact.ipAddress && (
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">IP Address</p>
                    <p className="text-xs text-slate-400">{selectedContact.ipAddress}</p>
                  </div>
                )}
                {selectedContact.emailStatus && (
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Email Notification</p>
                    {getEmailStatusBadge(selectedContact.emailStatus)}
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Subject</p>
                <p className="text-base font-semibold text-white bg-slate-900/50 p-3 rounded-xl border border-white/5">
                  {selectedContact.subject || "New Website Inquiry"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Message</p>
                <div className="text-sm text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                  {selectedContact.message}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                  Admin Actions
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227]"
                    >
                      <option value="NEW">New</option>
                      <option value="READ">Read</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="SPAM">Spam</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Internal Notes</label>
                    <textarea
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                      placeholder="Add private internal notes here..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-[#C9A227] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 sticky bottom-0 bg-[#0B132B]/95 backdrop-blur-md z-10">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateContact}
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg cursor-pointer"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
