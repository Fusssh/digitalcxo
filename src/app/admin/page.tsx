"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Video, 
  Calendar, 
  MessageSquare, 
  PlusCircle, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Search, 
  Filter, 
  Download, 
  ShieldAlert, 
  Sparkles, 
  Film, 
  Check 
} from "lucide-react";
import { CxoMemberSubmission, PartnerSubmission, PodcastEpisode, EventItem, ContactSubmission } from "@/types";
import { cn, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"cxo" | "partners" | "podcasts" | "events" | "messages">("cxo");
  
  // Data states
  const [cxoMembers, setCxoMembers] = useState<CxoMemberSubmission[]>([]);
  const [partnerMembers, setPartnerMembers] = useState<PartnerSubmission[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Podcast form modal state
  const [showPodcastModal, setShowPodcastModal] = useState(false);
  const [podTitle, setPodTitle] = useState("");
  const [podSubtitle, setPodSubtitle] = useState("");
  const [podYoutubeUrl, setPodYoutubeUrl] = useState("");
  const [podGuestName, setPodGuestName] = useState("");
  const [podGuestRole, setPodGuestRole] = useState("");
  const [podGuestOrg, setPodGuestOrg] = useState("");
  const [podOverview, setPodOverview] = useState("");

  // Event form modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [evtTitle, setEvtTitle] = useState("");
  const [evtDate, setEvtDate] = useState("");
  const [evtVenue, setEvtVenue] = useState("");
  const [evtTagline, setEvtTagline] = useState("");
  const [evtType, setEvtType] = useState<"upcoming" | "past">("past");
  const [evtVideoType, setEvtVideoType] = useState<"mp4" | "youtube">("mp4");
  const [evtVideoUrl, setEvtVideoUrl] = useState("");
  const [evtDescription, setEvtDescription] = useState("");

  // Selected member detail view modal
  const [selectedCxo, setSelectedCxo] = useState<CxoMemberSubmission | null>(null);

  // Load all data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [membersRes, podRes, evtRes, contactRes] = await Promise.all([
        fetch("/api/admin/members").then((r) => r.json()),
        fetch("/api/admin/podcasts").then((r) => r.json()),
        fetch("/api/admin/events").then((r) => r.json()),
        fetch("/api/admin/contacts").then((r) => r.json())
      ]);

      if (membersRes.cxoMembers) setCxoMembers(membersRes.cxoMembers);
      if (membersRes.partnerMembers) setPartnerMembers(membersRes.partnerMembers);
      if (podRes.podcasts) setPodcasts(podRes.podcasts);
      if (evtRes.events) setEvents(evtRes.events);
      if (contactRes.contacts) setContacts(contactRes.contacts);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Update CXO status
  const handleUpdateCxoStatus = async (id: string, status: CxoMemberSubmission["status"]) => {
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "cxo", status })
      });
      if (res.ok) {
        setCxoMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
        if (selectedCxo?.id === id) {
          setSelectedCxo((prev) => prev ? { ...prev, status } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Podcast
  const handleAddPodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const guests = podGuestName
        ? [{ name: podGuestName, role: podGuestRole, organization: podGuestOrg }]
        : [];

      const res = await fetch("/api/admin/podcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: podTitle,
          subtitle: podSubtitle,
          youtubeUrl: podYoutubeUrl,
          guests,
          overview: podOverview
        })
      });

      if (res.ok) {
        setShowPodcastModal(false);
        setPodTitle("");
        setPodSubtitle("");
        setPodYoutubeUrl("");
        setPodGuestName("");
        setPodGuestRole("");
        setPodGuestOrg("");
        setPodOverview("");
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Podcast
  const handleDeletePodcast = async (id: string) => {
    if (!confirm("Are you sure you want to delete this podcast episode?")) return;
    try {
      const res = await fetch(`/api/admin/podcasts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPodcasts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Event
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: evtTitle,
          date: evtDate,
          venue: evtVenue,
          tagline: evtTagline,
          type: evtType,
          videoType: evtVideoType,
          videoUrl: evtVideoUrl,
          description: evtDescription
        })
      });

      if (res.ok) {
        setShowEventModal(false);
        setEvtTitle("");
        setEvtDate("");
        setEvtVenue("");
        setEvtTagline("");
        setEvtVideoUrl("");
        setEvtDescription("");
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export CXO list to CSV
  const exportCxoCsv = () => {
    const headers = [
      "ID",
      "Submitted At",
      "Status",
      "Title",
      "First Name",
      "Last Name",
      "Official Email",
      "Mobile",
      "Organization",
      "Designation",
      "Country",
      "State",
      "City",
      "LinkedIn",
      "Industry",
      "Preferred Mode"
    ];
    const rows = cxoMembers.map((m) => [
      m.id,
      m.submittedAt,
      m.status,
      m.title,
      m.firstName,
      m.lastName || "",
      m.officialEmail,
      m.mobile,
      `"${m.organization.replace(/"/g, '""')}"`,
      `"${m.designation.replace(/"/g, '""')}"`,
      m.country,
      m.state,
      m.city,
      m.linkedin,
      `"${m.industry.replace(/"/g, '""')}"`,
      `"${m.preferredModeOfEngagement.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `digitalcxos_members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered CXO members
  const filteredCxo = cxoMembers.filter((m) => {
    const matchesSearch =
      `${m.firstName} ${m.lastName} ${m.organization} ${m.designation} ${m.officialEmail}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 pt-28 pb-24">
      {/* Admin Header */}
      <div className="border-b border-white/10 bg-[#070D1F] pb-6 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                  Digital CXOS Administration
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100 mt-1">
                Executive Control Portal
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => refreshData()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Refresh Data
              </button>
              <a
                href="/"
                target="_blank"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/40 transition-colors flex items-center gap-1.5"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Stats Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-2xl glass-panel border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>CXO Applicants</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold font-serif text-amber-300">{cxoMembers.length}</p>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Partner Inquiries</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold font-serif text-slate-100">{partnerMembers.length}</p>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Published Podcasts</span>
                <Video className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-2xl font-bold font-serif text-slate-100">{podcasts.length}</p>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Events &amp; Highlights</span>
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold font-serif text-slate-100">{events.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("cxo")}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border cursor-pointer whitespace-nowrap",
              activeTab === "cxo"
                ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(230,202,101,0.2)]"
                : "glass-panel text-slate-400 border-white/10 hover:text-white"
            )}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>CXO Members ({cxoMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("partners")}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border cursor-pointer whitespace-nowrap",
              activeTab === "partners"
                ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(230,202,101,0.2)]"
                : "glass-panel text-slate-400 border-white/10 hover:text-white"
            )}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Partners Inquiries ({partnerMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("podcasts")}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border cursor-pointer whitespace-nowrap",
              activeTab === "podcasts"
                ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(230,202,101,0.2)]"
                : "glass-panel text-slate-400 border-white/10 hover:text-white"
            )}
          >
            <Video className="w-4 h-4 text-sky-400" />
            <span>Manage Podcasts ({podcasts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border cursor-pointer whitespace-nowrap",
              activeTab === "events"
                ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(230,202,101,0.2)]"
                : "glass-panel text-slate-400 border-white/10 hover:text-white"
            )}
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Manage Events &amp; MP4 Videos ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={cn(
              "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border cursor-pointer whitespace-nowrap",
              activeTab === "messages"
                ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(230,202,101,0.2)]"
                : "glass-panel text-slate-400 border-white/10 hover:text-white"
            )}
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>Contact Messages ({contacts.length})</span>
          </button>
        </div>

        {/* Tab 1: CXO Members */}
        {activeTab === "cxo" && (
          <div className="mt-6 space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, organization, email..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>

              <button
                onClick={exportCxoCsv}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 transition-colors flex items-center gap-2 self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Export to CSV</span>
              </button>
            </div>

            {/* CXO Members Table */}
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#091229] uppercase text-[11px] text-slate-400 border-b border-white/10 font-semibold tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Candidate</th>
                      <th className="px-4 py-3.5">Organization &amp; Role</th>
                      <th className="px-4 py-3.5">Location</th>
                      <th className="px-4 py-3.5">Industry</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Submitted</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredCxo.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                          No CXO applications match the search or filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCxo.map((m) => (
                        <tr key={m.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3.5">
                            <div>
                              <p className="font-bold text-slate-100">
                                {m.title} {m.firstName} {m.lastName}
                              </p>
                              <p className="text-[11px] text-slate-400">{m.officialEmail}</p>
                              <p className="text-[11px] text-slate-400">{m.mobile}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div>
                              <p className="font-semibold text-amber-200">{m.organization}</p>
                              <p className="text-[11px] text-slate-400">{m.designation}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span>{m.city}, {m.state}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-[11px] text-slate-300">{m.industry}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={cn(
                                "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                m.status === "Approved"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                                  : m.status === "Pending Review"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
                                  : m.status === "Contacted"
                                  ? "bg-sky-500/20 text-sky-300 border-sky-400/30"
                                  : "bg-slate-700/40 text-slate-400 border-slate-600"
                              )}
                            >
                              {m.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">
                            {formatDate(m.submittedAt)}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedCxo(m)}
                                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] transition-colors"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleUpdateCxoStatus(m.id, "Approved")}
                                className="p-1 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 transition-colors"
                                title="Approve Member"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Partner Inquiries */}
        {activeTab === "partners" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#091229] uppercase text-[11px] text-slate-400 border-b border-white/10 font-semibold tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Partner Contact</th>
                      <th className="px-4 py-3.5">Organization &amp; Designation</th>
                      <th className="px-4 py-3.5">India Presence</th>
                      <th className="px-4 py-3.5">Preferred Engagement Tracks</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {partnerMembers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                          No partner inquiries received yet.
                        </td>
                      </tr>
                    ) : (
                      partnerMembers.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-slate-100">
                              {p.title} {p.firstName} {p.lastName}
                            </p>
                            <p className="text-[11px] text-slate-400">{p.email}</p>
                            <p className="text-[11px] text-slate-400">{p.mobile}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-amber-300">{p.organization}</p>
                            <p className="text-[11px] text-slate-400">{p.designation}</p>
                            <p className="text-[11px] text-slate-500">{p.city}, {p.state}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px]">
                              {p.presenceInIndia}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-wrap gap-1 max-w-sm">
                              {p.preferredEngagementTypes.map((type, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">
                            {formatDate(p.submittedAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Manage Podcasts (YouTube video publisher) */}
        {activeTab === "podcasts" && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-100">
                  YouTube Podcast Episodes
                </h3>
                <p className="text-xs text-slate-400">
                  Post YouTube URLs here to automatically publish video cards on the public /podcast page and homepage teaser.
                </p>
              </div>

              <button
                onClick={() => setShowPodcastModal(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish New Podcast</span>
              </button>
            </div>

            {/* List of Podcasts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {podcasts.map((pod) => (
                <div
                  key={pod.id}
                  className="rounded-2xl glass-panel p-6 border border-white/10 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30">
                        {pod.subtitle}
                      </span>
                      <button
                        onClick={() => handleDeletePodcast(pod.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 transition-colors"
                        title="Delete Episode"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-slate-100 font-serif">
                      {pod.title}
                    </h4>

                    <p className="text-xs text-amber-300 font-mono break-all">
                      {pod.youtubeUrl}
                    </p>

                    {pod.guests && pod.guests.length > 0 && (
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">
                          Guests:
                        </span>
                        {pod.guests.map((g, i) => (
                          <p key={i} className="text-xs text-slate-300">
                            {g.name} — {g.role}, {g.organization}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400">ID: {pod.id}</span>
                    <a
                      href={pod.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <span>Open on YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Manage Events (MP4 and YouTube video highlight publisher) */}
        {activeTab === "events" && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-100">
                  Conclaves &amp; Video Highlight Reels
                </h3>
                <p className="text-xs text-slate-400">
                  Post upcoming events or past event highlight videos (supporting direct MP4 videos or YouTube links).
                </p>
              </div>

              <button
                onClick={() => setShowEventModal(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Event / Post Video</span>
              </button>
            </div>

            {/* List of Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-2xl glass-panel p-6 border border-white/10 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold uppercase">
                        {evt.type}
                      </span>
                      <div className="flex items-center gap-2">
                        {evt.videoType && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {evt.videoType.toUpperCase()}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs uppercase font-bold text-amber-400/90">{evt.tagline}</p>
                    <h4 className="text-base font-bold text-slate-100 font-serif leading-snug">
                      {evt.title}
                    </h4>

                    <p className="text-xs text-slate-300">{evt.date}</p>
                    {evt.venue && <p className="text-xs text-slate-400">📍 {evt.venue}</p>}

                    {evt.videoUrl && (
                      <p className="text-[11px] text-emerald-400/90 font-mono truncate">
                        Video: {evt.videoUrl}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500">
                    ID: {evt.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Contact Messages */}
        {activeTab === "messages" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#091229] uppercase text-[11px] text-slate-400 border-b border-white/10 font-semibold tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Sender</th>
                      <th className="px-4 py-3.5">Contact Details</th>
                      <th className="px-4 py-3.5">Message Content</th>
                      <th className="px-4 py-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {contacts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                          No messages received.
                        </td>
                      </tr>
                    ) : (
                      contacts.map((c) => (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-slate-100">
                            {c.title} {c.name}
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-amber-300">{c.email}</p>
                            <p className="text-slate-400">{c.phone}</p>
                          </td>
                          <td className="px-4 py-3.5 max-w-md">
                            <p className="text-xs text-slate-200 leading-relaxed line-clamp-3">
                              {c.message}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">
                            {formatDate(c.submittedAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Podcast Creation Modal */}
      {showPodcastModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A1228] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold font-serif text-slate-100">
                Publish New YouTube Podcast
              </h3>
              <button
                onClick={() => setShowPodcastModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPodcast} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Episode Title *</label>
                <input
                  type="text"
                  required
                  value={podTitle}
                  onChange={(e) => setPodTitle(e.target.value)}
                  placeholder="e.g. AI, Cybersecurity & Sovereign Defense"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subtitle / Topic Badge</label>
                <input
                  type="text"
                  value={podSubtitle}
                  onChange={(e) => setPodSubtitle(e.target.value)}
                  placeholder="e.g. AI Changes Everything"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">YouTube Video Link / ID *</label>
                <input
                  type="text"
                  required
                  value={podYoutubeUrl}
                  onChange={(e) => setPodYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Guest Name</label>
                  <input
                    type="text"
                    value={podGuestName}
                    onChange={(e) => setPodGuestName(e.target.value)}
                    placeholder="Guest name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Guest Role</label>
                  <input
                    type="text"
                    value={podGuestRole}
                    onChange={(e) => setPodGuestRole(e.target.value)}
                    placeholder="Role"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Organization</label>
                  <input
                    type="text"
                    value={podGuestOrg}
                    onChange={(e) => setPodGuestOrg(e.target.value)}
                    placeholder="Organization"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Overview Description</label>
                <textarea
                  rows={3}
                  value={podOverview}
                  onChange={(e) => setPodOverview(e.target.value)}
                  placeholder="Key discussion themes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPodcastModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider"
                >
                  Publish Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event & MP4 Video Creation Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A1228] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold font-serif text-slate-100">
                Post Event &amp; Video Highlight
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  placeholder="e.g. Digital CXOS Horizon 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    placeholder="e.g. 30–31 January 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Venue</label>
                  <input
                    type="text"
                    value={evtVenue}
                    onChange={(e) => setEvtVenue(e.target.value)}
                    placeholder="e.g. Resort Country Club, Gurugram"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tagline *</label>
                <input
                  type="text"
                  required
                  value={evtTagline}
                  onChange={(e) => setEvtTagline(e.target.value)}
                  placeholder="e.g. Leadership Conversations Beyond the Boardroom..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Type</label>
                  <select
                    value={evtType}
                    onChange={(e) => setEvtType(e.target.value as "upcoming" | "past")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  >
                    <option value="past">Past Event (with Video)</option>
                    <option value="upcoming">Upcoming Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Video Format</label>
                  <select
                    value={evtVideoType}
                    onChange={(e) => setEvtVideoType(e.target.value as "mp4" | "youtube")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  >
                    <option value="mp4">MP4 Direct Video</option>
                    <option value="youtube">YouTube Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Video URL ({evtVideoType === "mp4" ? "Direct .mp4 Link" : "YouTube Link"})
                </label>
                <input
                  type="text"
                  value={evtVideoUrl}
                  onChange={(e) => setEvtVideoUrl(e.target.value)}
                  placeholder={
                    evtVideoType === "mp4"
                      ? "https://your-domain.com/videos/highlight.mp4"
                      : "https://www.youtube.com/watch?v=..."
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={evtDescription}
                  onChange={(e) => setEvtDescription(e.target.value)}
                  placeholder="Conclave details..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected CXO Detail View Modal */}
      {selectedCxo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A1228] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                  Application Dossier
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-100 mt-1">
                  {selectedCxo.title} {selectedCxo.firstName} {selectedCxo.middleName || ""} {selectedCxo.lastName || ""}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCxo(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Organization</p>
                <p className="font-semibold text-slate-100">{selectedCxo.organization}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Designation</p>
                <p className="font-semibold text-amber-300">{selectedCxo.designation}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Official Email</p>
                <p className="font-semibold text-slate-100">{selectedCxo.officialEmail}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Mobile (WhatsApp)</p>
                <p className="font-semibold text-slate-100">{selectedCxo.mobile}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Location</p>
                <p className="font-semibold text-slate-100">{selectedCxo.city}, {selectedCxo.state}, {selectedCxo.country}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">LinkedIn Profile</p>
                <a
                  href={selectedCxo.linkedin.startsWith("http") ? selectedCxo.linkedin : "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-amber-400 hover:underline truncate block"
                >
                  {selectedCxo.linkedin}
                </a>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Board Experience</p>
                <p className="font-semibold text-slate-100">{selectedCxo.boardExperience || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Leadership Depth</p>
                <p className="font-semibold text-slate-100">{selectedCxo.leadershipExperience ? `${selectedCxo.leadershipExperience} Years` : "N/A"}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400 font-semibold mb-1">Would like to contribute via:</p>
                <p className="text-slate-200">{selectedCxo.contributeVia}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400 font-semibold mb-1">Strategic Areas of Interest:</p>
                <p className="text-slate-200">{selectedCxo.strategicInterests}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400 font-semibold mb-1">Industry:</p>
                <p className="text-slate-200">{selectedCxo.industry}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400 font-semibold mb-1">Preferred Mode of Engagement:</p>
                <p className="text-slate-200">{selectedCxo.preferredModeOfEngagement}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Submitted: {formatDate(selectedCxo.submittedAt)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateCxoStatus(selectedCxo.id, "Contacted")}
                  className="px-3 py-1.5 rounded-lg bg-sky-600/20 text-sky-300 text-xs font-semibold hover:bg-sky-600/30"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => handleUpdateCxoStatus(selectedCxo.id, "Approved")}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-500"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
