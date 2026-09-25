"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Check,
  Edit2,
  Play,
  Eye,
  LogOut,
  Lock,
  Mail,
  Shield,
  Building,
  Globe,
  Layers,
  ArrowRight,
  UserPlus,
  LogIn,
  Sliders,
  RefreshCw,
  X,
  Phone,
  Award,
  HeartHandshake,
  Compass,
  GraduationCap,
  Code,
  Leaf,
  FileCheck,
  Mic,
  BookOpen,
  Menu,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { 
  CxoMemberSubmission, 
  PartnerSubmission, 
  PodcastEpisode, 
  EventItem, 
  ContactSubmission,
  TeamMember,
  InitiativeItem,
  SocialInitiative,
  EventHighlight,
  PartnerItem,
  AdminUser
} from "@/types";
import { cn, formatDate, extractYouTubeId } from "@/lib/utils";

// Category options for Enrichment & Contribution
const INITIATIVE_CATEGORIES = [
  "Mentorship",
  "Governance & Policy",
  "Innovation & Labs",
  "Community & Outreach"
];

// Available icons for Enrichment
const ICON_OPTIONS = [
  { name: "Users", icon: Users },
  { name: "Compass", icon: Compass },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Award", icon: Award },
  { name: "ShieldAlert", icon: ShieldAlert },
  { name: "Sparkles", icon: Sparkles },
  { name: "Code", icon: Code },
  { name: "HeartHandshake", icon: HeartHandshake },
  { name: "Layers", icon: Layers },
  { name: "Leaf", icon: Leaf },
  { name: "FileCheck", icon: FileCheck },
  { name: "Mic", icon: Mic },
  { name: "BookOpen", icon: BookOpen }
];

export default function AdminDashboardPage() {
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState<"Super Admin" | "Content Director" | "Community Lead">("Super Admin");
  const [authJustification, setAuthJustification] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    "overview" | 
    "members" | 
    "forms" | 
    "initiatives" | 
    "leadership" | 
    "social" | 
    "highlights" | 
    "podcasts" | 
    "events" | 
    "partners" | 
    "contacts" | 
    "api-hub"
  >("overview");

  // Forms sub-tab
  const [formsSubTab, setFormsSubTab] = useState<"cxo" | "partners" | "contacts">("cxo");
  // Partners sub-tab
  const [partnersSubTab, setPartnersSubTab] = useState<"catalog" | "applications">("catalog");

  // Data states
  const [cxoMembers, setCxoMembers] = useState<CxoMemberSubmission[]>([]);
  const [partnerMembers, setPartnerMembers] = useState<PartnerSubmission[]>([]);
  const [partnersCatalog, setPartnersCatalog] = useState<PartnerItem[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [initiatives, setInitiatives] = useState<InitiativeItem[]>([]);
  const [socialInitiatives, setSocialInitiatives] = useState<SocialInitiative[]>([]);
  const [eventHighlights, setEventHighlights] = useState<EventHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Backend API Host URL state
  const [backendHostUrl, setBackendHostUrl] = useState("https://api.digitalcxos.org/v1");
  const [apiSaveMessage, setApiSaveMessage] = useState("");

  // Modals state
  const [selectedCxo, setSelectedCxo] = useState<CxoMemberSubmission | null>(null);
  const [selectedPartnerApp, setSelectedPartnerApp] = useState<PartnerSubmission | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replySuccess, setReplySuccess] = useState(false);

  // 1) Initiative Modal (Enrichment & Contribution)
  const [showInitiativeModal, setShowInitiativeModal] = useState(false);
  const [editingInitiativeId, setEditingInitiativeId] = useState<string | number | null>(null);
  const [initTitle, setInitTitle] = useState("");
  const [initDescription, setInitDescription] = useState("");
  const [initCategory, setInitCategory] = useState("Mentorship");
  const [initIconName, setInitIconName] = useState("Sparkles");

  // 2) Leadership Modal (Meet Our Leadership Team)
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [leaderName, setLeaderName] = useState("");
  const [leaderRole, setLeaderRole] = useState("");
  const [leaderSlug, setLeaderSlug] = useState("");
  const [leaderBio, setLeaderBio] = useState("");
  const [leaderSectors, setLeaderSectors] = useState("");
  const [leaderLinkedin, setLeaderLinkedin] = useState("");
  const [leaderImage, setLeaderImage] = useState("/assests/rohit-1.webp");
  const [leaderExperience, setLeaderExperience] = useState("");
  const [leaderQuote, setLeaderQuote] = useState("");
  const [leaderFeatured, setLeaderFeatured] = useState(true);

  // 3) Social Initiatives Modal (Our Social Initiatives)
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialTag, setSocialTag] = useState("Executive Vitality");
  const [socialTitle, setSocialTitle] = useState("");
  const [socialDescription, setSocialDescription] = useState("");
  const [socialImage, setSocialImage] = useState("https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop");
  const [socialLink, setSocialLink] = useState("/initiatives");

  // 4) Video Event Highlights Modal (MP4 Videos)
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);
  const [hlTitle, setHlTitle] = useState("");
  const [hlVideoUrl, setHlVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
  const [hlPosterUrl, setHlPosterUrl] = useState("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop");
  const [hlTag, setHlTag] = useState("Flagship Conclave");
  const [hlEdition, setHlEdition] = useState("2026 Annual Conclave");
  const [hlDuration, setHlDuration] = useState("03:30");
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // 5) Podcast Modal (YouTube links & auto-fetch)
  const [showPodcastModal, setShowPodcastModal] = useState(false);
  const [editingPodcastId, setEditingPodcastId] = useState<string | null>(null);
  const [podTitle, setPodTitle] = useState("");
  const [podSubtitle, setPodSubtitle] = useState("");
  const [podYoutubeUrl, setPodYoutubeUrl] = useState("");
  const [podGuestName, setPodGuestName] = useState("");
  const [podGuestRole, setPodGuestRole] = useState("");
  const [podGuestOrg, setPodGuestOrg] = useState("");
  const [podOverview, setPodOverview] = useState("");
  const [podDuration, setPodDuration] = useState("45 mins");
  const [previewYoutubeId, setPreviewYoutubeId] = useState<string | null>(null);

  // 6) Event Modal (Events)
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [evtTitle, setEvtTitle] = useState("");
  const [evtDate, setEvtDate] = useState("");
  const [evtVenue, setEvtVenue] = useState("");
  const [evtTagline, setEvtTagline] = useState("");
  const [evtType, setEvtType] = useState<"upcoming" | "past">("upcoming");
  const [evtVideoType, setEvtVideoType] = useState<"mp4" | "youtube">("mp4");
  const [evtVideoUrl, setEvtVideoUrl] = useState("");
  const [evtThumbnailUrl, setEvtThumbnailUrl] = useState("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop");
  const [evtAttendeesCount, setEvtAttendeesCount] = useState("150+ CXO Leaders");
  const [evtDescription, setEvtDescription] = useState("");

  // 7) Partner Catalog Modal
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [partName, setPartName] = useState("");
  const [partTier, setPartTier] = useState("Strategic Partner");
  const [partLogoUrl, setPartLogoUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop");
  const [partWebsiteUrl, setPartWebsiteUrl] = useState("https://");
  const [partStatus, setPartStatus] = useState<"Active" | "Pending" | "Inactive">("Active");
  const [partDescription, setPartDescription] = useState("");

  // Check stored user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("digitalcxo_admin_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        const defaultUser: AdminUser = {
          id: "admin-super-01",
          name: "Dr. Rajeshwar Rao",
          email: "super.admin@digitalcxos.org",
          role: "Super Admin",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=070D1F,1E1E1E&textColor=C9A227"
        };
        setCurrentUser(defaultUser);
      }
    } else {
      const defaultUser: AdminUser = {
        id: "admin-super-01",
        name: "Dr. Rajeshwar Rao",
        email: "super.admin@digitalcxos.org",
        role: "Super Admin",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=070D1F,1E1E1E&textColor=C9A227"
      };
      setCurrentUser(defaultUser);
      localStorage.setItem("digitalcxo_admin_user", JSON.stringify(defaultUser));
    }

    const savedHost = localStorage.getItem("digitalcxo_backend_host");
    if (savedHost) {
      setBackendHostUrl(savedHost);
    }
  }, []);

  // Fetch all administrative data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [
        membersRes, 
        podRes, 
        evtRes, 
        contactRes, 
        leadRes, 
        initRes, 
        socialRes, 
        hlRes,
        partnerRes
      ] = await Promise.all([
        fetch("/api/admin/members").then((r) => r.json()).catch(() => ({})),
        fetch("/api/admin/podcasts").then((r) => r.json()).catch(() => ({})),
        fetch("/api/admin/events").then((r) => r.json()).catch(() => ({})),
        fetch("/api/admin/contacts").then((r) => r.json()).catch(() => ({})),
        fetch("/api/admin/leadership").then((r) => r.json()).catch(() => ({})),
        fetch("/api/admin/initiatives").then((r) => r.json()).catch(() => ({})),
        fetch("/api/admin/social-initiatives").then((r) => r.json()).catch(() => ({})),
        fetch("/api/admin/event-highlights").then((r) => r.json()).catch(() => ({})),
        fetch("/api/admin/partners").then((r) => r.json()).catch(() => ({}))
      ]);

      if (membersRes.cxoMembers) setCxoMembers(membersRes.cxoMembers);
      if (membersRes.partnerMembers) setPartnerMembers(membersRes.partnerMembers);
      if (podRes.podcasts) setPodcasts(podRes.podcasts);
      if (evtRes.events) setEvents(evtRes.events);
      if (contactRes.contacts) setContacts(contactRes.contacts);
      if (leadRes.teamMembers) setTeamMembers(leadRes.teamMembers);
      if (initRes.initiatives) setInitiatives(initRes.initiatives);
      if (socialRes.socialInitiatives) setSocialInitiatives(socialRes.socialInitiatives);
      if (hlRes.eventHighlights) setEventHighlights(hlRes.eventHighlights);
      if (partnerRes.partnersCatalog) setPartnersCatalog(partnerRes.partnersCatalog);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: authTab,
          email: authEmail,
          password: authPassword,
          name: authName,
          role: authRole,
          justification: authJustification
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Authentication failed. Check credentials.");
      } else {
        setCurrentUser(data.user);
        localStorage.setItem("digitalcxo_admin_user", JSON.stringify(data.user));
      }
    } catch (err) {
      setAuthError("Network error contacting auth service.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: "Super Admin" | "Content Director" | "Community Lead") => {
    const demoMap: Record<string, AdminUser> = {
      "Super Admin": {
        id: "admin-super-01",
        name: "Dr. Rajeshwar Rao",
        email: "super.admin@digitalcxos.org",
        role: "Super Admin",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=070D1F,1E1E1E&textColor=C9A227"
      },
      "Content Director": {
        id: "admin-content-02",
        name: "Ananya Deshmukh",
        email: "content.director@digitalcxos.org",
        role: "Content Director",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Content&backgroundColor=070D1F,1E1E1E&textColor=C9A227"
      },
      "Community Lead": {
        id: "admin-comm-03",
        name: "Vikramaditya Sen",
        email: "community.lead@digitalcxos.org",
        role: "Community Lead",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Community&backgroundColor=070D1F,1E1E1E&textColor=C9A227"
      }
    };
    const user = demoMap[role];
    setCurrentUser(user);
    localStorage.setItem("digitalcxo_admin_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("digitalcxo_admin_user");
  };

  // Save backend host URL
  const handleSaveBackendHost = () => {
    localStorage.setItem("digitalcxo_backend_host", backendHostUrl);
    setApiSaveMessage("Configuration saved! Host URL will be used for production synchronization.");
    setTimeout(() => setApiSaveMessage(""), 4000);
  };

  // --- CRUD: 1) Enrichment & Contribution Initiatives ---
  const handleOpenAddInitiative = () => {
    setEditingInitiativeId(null);
    setInitTitle("");
    setInitDescription("");
    setInitCategory("Mentorship");
    setInitIconName("Sparkles");
    setShowInitiativeModal(true);
  };

  const handleOpenEditInitiative = (item: InitiativeItem) => {
    setEditingInitiativeId(item.id);
    setInitTitle(item.title);
    setInitDescription(item.description);
    setInitCategory(item.category);
    setInitIconName(item.iconName || "Sparkles");
    setShowInitiativeModal(true);
  };

  const handleSaveInitiative = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = editingInitiativeId !== null;
      const res = await fetch("/api/admin/initiatives", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingInitiativeId,
          title: initTitle,
          description: initDescription,
          category: initCategory,
          iconName: initIconName
        })
      });

      if (res.ok) {
        setShowInitiativeModal(false);
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInitiative = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this strategic initiative?")) return;
    try {
      const res = await fetch(`/api/admin/initiatives?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInitiatives((prev) => prev.filter((i) => String(i.id) !== String(id)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD: 2) Meet Our Leadership Team ---
  const handleOpenAddLeader = () => {
    setEditingLeaderId(null);
    setLeaderName("");
    setLeaderRole("");
    setLeaderSlug("");
    setLeaderBio("");
    setLeaderSectors("Financial Services, ITES, Enterprise Strategy");
    setLeaderLinkedin("https://linkedin.com/in/");
    setLeaderImage("/assests/rohit-1.webp");
    setLeaderExperience("20+ Years Executive Leadership");
    setLeaderQuote("");
    setLeaderFeatured(true);
    setShowLeaderModal(true);
  };

  const handleOpenEditLeader = (member: TeamMember) => {
    setEditingLeaderId(member.id || member.slug);
    setLeaderName(member.name);
    setLeaderRole(member.role);
    setLeaderSlug(member.slug);
    setLeaderBio(member.bio || "");
    setLeaderSectors(Array.isArray(member.sectors) ? member.sectors.join(", ") : "");
    setLeaderLinkedin(member.linkedin || "");
    setLeaderImage(member.image || "/assests/rohit-1.webp");
    setLeaderExperience(member.experience || "");
    setLeaderQuote(member.quote || "");
    setLeaderFeatured(member.featured !== false);
    setShowLeaderModal(true);
  };

  const handleSaveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = editingLeaderId !== null;
      const res = await fetch("/api/admin/leadership", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingLeaderId,
          name: leaderName,
          role: leaderRole,
          slug: leaderSlug || leaderName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          bio: leaderBio,
          sectors: leaderSectors,
          linkedin: leaderLinkedin,
          image: leaderImage,
          experience: leaderExperience,
          quote: leaderQuote,
          featured: leaderFeatured
        })
      });

      if (res.ok) {
        setShowLeaderModal(false);
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLeader = async (id: string) => {
    if (!confirm("Are you sure you want to remove this leader from the advisory team?")) return;
    try {
      const res = await fetch(`/api/admin/leadership?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTeamMembers((prev) => prev.filter((m) => m.id !== id && m.slug !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD: 3) Our Social Initiatives ---
  const handleOpenAddSocial = () => {
    setEditingSocialId(null);
    setSocialTag("Executive Vitality");
    setSocialTitle("");
    setSocialDescription("");
    setSocialImage("https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop");
    setSocialLink("/initiatives");
    setShowSocialModal(true);
  };

  const handleOpenEditSocial = (item: SocialInitiative) => {
    setEditingSocialId(item.id);
    setSocialTag(item.tag);
    setSocialTitle(item.title);
    setSocialDescription(item.description);
    setSocialImage(item.image);
    setSocialLink(item.link || "/initiatives");
    setShowSocialModal(true);
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = editingSocialId !== null;
      const res = await fetch("/api/admin/social-initiatives", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSocialId,
          tag: socialTag,
          title: socialTitle,
          description: socialDescription,
          image: socialImage,
          link: socialLink
        })
      });

      if (res.ok) {
        setShowSocialModal(false);
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social initiative?")) return;
    try {
      const res = await fetch(`/api/admin/social-initiatives?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSocialInitiatives((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD: 4) Video Event Highlights (MP4) ---
  const handleOpenAddHighlight = () => {
    setEditingHighlightId(null);
    setHlTitle("");
    setHlVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    setHlPosterUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop");
    setHlTag("Flagship Conclave");
    setHlEdition("2026 Annual Conclave");
    setHlDuration("03:30");
    setShowHighlightModal(true);
  };

  const handleOpenEditHighlight = (item: EventHighlight) => {
    setEditingHighlightId(item.id);
    setHlTitle(item.title);
    setHlVideoUrl(item.videoUrl);
    setHlPosterUrl(item.posterUrl);
    setHlTag(item.tag);
    setHlEdition(item.edition);
    setHlDuration(item.duration || "03:30");
    setShowHighlightModal(true);
  };

  const handleSaveHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = editingHighlightId !== null;
      const res = await fetch("/api/admin/event-highlights", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingHighlightId,
          title: hlTitle,
          videoUrl: hlVideoUrl,
          posterUrl: hlPosterUrl,
          tag: hlTag,
          edition: hlEdition,
          duration: hlDuration
        })
      });

      if (res.ok) {
        setShowHighlightModal(false);
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHighlight = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event highlight video?")) return;
    try {
      const res = await fetch(`/api/admin/event-highlights?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEventHighlights((prev) => prev.filter((h) => h.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD: 5) Latest Podcast Series ---
  const handleOpenAddPodcast = () => {
    setEditingPodcastId(null);
    setPodTitle("");
    setPodSubtitle("Digital CXOS Thought Leadership");
    setPodYoutubeUrl("");
    setPodGuestName("");
    setPodGuestRole("");
    setPodGuestOrg("");
    setPodOverview("");
    setPodDuration("45 mins");
    setShowPodcastModal(true);
  };

  const handleOpenEditPodcast = (p: PodcastEpisode) => {
    setEditingPodcastId(p.id);
    setPodTitle(p.title);
    setPodSubtitle(p.subtitle);
    setPodYoutubeUrl(p.youtubeUrl);
    setPodGuestName(p.guests?.[0]?.name || "");
    setPodGuestRole(p.guests?.[0]?.role || "");
    setPodGuestOrg(p.guests?.[0]?.organization || "");
    setPodOverview(p.overview || "");
    setPodDuration(p.duration || "45 mins");
    setShowPodcastModal(true);
  };

  const handleSavePodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = editingPodcastId !== null;
      const guests = podGuestName
        ? [{ name: podGuestName, role: podGuestRole, organization: podGuestOrg }]
        : [];

      const res = await fetch("/api/admin/podcasts", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPodcastId,
          title: podTitle,
          subtitle: podSubtitle,
          youtubeUrl: podYoutubeUrl,
          duration: podDuration,
          guests,
          overview: podOverview
        })
      });

      if (res.ok) {
        setShowPodcastModal(false);
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  // --- CRUD: 6) Events ---
  const handleOpenAddEvent = () => {
    setEditingEventId(null);
    setEvtTitle("");
    setEvtDate("");
    setEvtVenue("");
    setEvtTagline("");
    setEvtType("upcoming");
    setEvtVideoType("mp4");
    setEvtVideoUrl("");
    setEvtThumbnailUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop");
    setEvtAttendeesCount("150+ CXO Leaders");
    setEvtDescription("");
    setShowEventModal(true);
  };

  const handleOpenEditEvent = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setEvtTitle(evt.title);
    setEvtDate(evt.date);
    setEvtVenue(evt.venue || "");
    setEvtTagline(evt.tagline);
    setEvtType(evt.type);
    setEvtVideoType(evt.videoType || "mp4");
    setEvtVideoUrl(evt.videoUrl || "");
    setEvtThumbnailUrl(evt.thumbnailUrl || "");
    setEvtAttendeesCount(evt.attendeesCount || "100+ Leaders");
    setEvtDescription(evt.description || "");
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = editingEventId !== null;
      const res = await fetch("/api/admin/events", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingEventId,
          title: evtTitle,
          date: evtDate,
          venue: evtVenue,
          tagline: evtTagline,
          type: evtType,
          videoType: evtVideoType,
          videoUrl: evtVideoUrl,
          thumbnailUrl: evtThumbnailUrl,
          attendeesCount: evtAttendeesCount,
          description: evtDescription
        })
      });

      if (res.ok) {
        setShowEventModal(false);
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  // --- CRUD: 7) Partners Catalog ---
  const handleOpenAddPartner = () => {
    setEditingPartnerId(null);
    setPartName("");
    setPartTier("Strategic Partner");
    setPartLogoUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop");
    setPartWebsiteUrl("https://");
    setPartStatus("Active");
    setPartDescription("");
    setShowPartnerModal(true);
  };

  const handleOpenEditPartner = (p: PartnerItem) => {
    setEditingPartnerId(p.id);
    setPartName(p.name);
    setPartTier(p.tier);
    setPartLogoUrl(p.logoUrl);
    setPartWebsiteUrl(p.websiteUrl);
    setPartStatus(p.status);
    setPartDescription(p.description || "");
    setShowPartnerModal(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = editingPartnerId !== null;
      const res = await fetch("/api/admin/partners", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPartnerId,
          name: partName,
          tier: partTier,
          logoUrl: partLogoUrl,
          websiteUrl: partWebsiteUrl,
          status: partStatus,
          description: partDescription
        })
      });

      if (res.ok) {
        setShowPartnerModal(false);
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePartnerCatalog = async (id: string) => {
    if (!confirm("Delete partner from directory?")) return;
    try {
      const res = await fetch(`/api/admin/partners?id=${id}&type=catalog`, { method: "DELETE" });
      if (res.ok) {
        setPartnersCatalog((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CXO Member status update ---
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

  // --- Partner application status update ---
  const handleUpdatePartnerAppStatus = async (id: string, status: PartnerSubmission["status"]) => {
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "partner", status })
      });
      if (res.ok) {
        setPartnerMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
        if (selectedPartnerApp?.id === id) {
          setSelectedPartnerApp((prev) => prev ? { ...prev, status } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Contact update & reply ---
  const handleUpdateContactStatus = async (id: string, status: ContactSubmission["status"]) => {
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
        if (selectedContact?.id === id) {
          setSelectedContact((prev) => prev ? { ...prev, status } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = (contactId: string) => {
    if (!replyMessage.trim()) return;
    setReplySuccess(true);
    handleUpdateContactStatus(contactId, "Replied");
    setTimeout(() => {
      setReplySuccess(false);
      setReplyMessage("");
      setSelectedContact(null);
    }, 1500);
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
      `"${(m.organization || "").replace(/"/g, '""')}"`,
      `"${(m.designation || "").replace(/"/g, '""')}"`,
      m.country,
      m.state,
      m.city,
      m.linkedin,
      `"${(m.industry || "").replace(/"/g, '""')}"`,
      `"${(m.preferredModeOfEngagement || "").replace(/"/g, '""')}"`
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

  // Filtered lists
  const filteredCxo = cxoMembers.filter((m) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      `${m.firstName} ${m.lastName} ${m.organization} ${m.designation} ${m.officialEmail} ${m.city}`
        .toLowerCase()
        .includes(query);
    const matchesStatus = statusFilter === "All" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredContacts = contacts.filter((c) => {
    const query = searchTerm.toLowerCase();
    return `${c.name} ${c.email} ${c.message}`.toLowerCase().includes(query);
  });

  // Calculate quick stats
  const pendingCxoCount = cxoMembers.filter((m) => m.status === "Pending Review").length;
  const pendingPartnerCount = partnerMembers.filter((p) => p.status === "Pending Review").length;
  const unreadContactCount = contacts.filter((c) => c.status === "Unread").length;

  // Navigation Items grouped by purpose
  const navGroups = [
    {
      group: "MAIN DASHBOARD",
      items: [
        { id: "overview", label: "Overview & Hub", icon: LayoutDashboard, count: null },
        { id: "members", label: "Members Directory", icon: Users, count: cxoMembers.length, badge: pendingCxoCount > 0 ? `${pendingCxoCount} Pending` : null, badgeColor: "bg-amber-400 text-slate-950" },
        { id: "forms", label: "Form Submissions", icon: FileCheck, count: partnerMembers.length + contacts.length }
      ]
    },
    {
      group: "CONTENT CMS (8 MODULES)",
      items: [
        { id: "initiatives", label: "1) Enrichment & Contribution", icon: Sparkles, count: initiatives.length },
        { id: "leadership", label: "2) Meet Leadership Team", icon: Award, count: teamMembers.length },
        { id: "social", label: "3) Our Social Initiatives", icon: HeartHandshake, count: socialInitiatives.length },
        { id: "highlights", label: "4) Event Highlights (MP4)", icon: Film, count: eventHighlights.length },
        { id: "podcasts", label: "5) Podcasts (YouTube)", icon: Video, count: podcasts.length },
        { id: "events", label: "6) Conclaves & Events", icon: Calendar, count: events.length },
        { id: "partners", label: "7) Partners Directory", icon: Building, count: partnersCatalog.length },
        { id: "contacts", label: "8) Contact Us Inbox", icon: MessageSquare, count: contacts.length, badge: unreadContactCount > 0 ? `${unreadContactCount} New` : null, badgeColor: "bg-teal-400 text-slate-950 font-bold" }
      ]
    },
    {
      group: "INTEGRATION & SETTINGS",
      items: [
        { id: "api-hub", label: "Backend API Host Config", icon: Globe, count: null, badge: "Host Ready", badgeColor: "bg-sky-500/20 text-sky-300 border border-sky-500/30" }
      ]
    }
  ];

  // If user is not authenticated, render the high-security Sign In / Sign Up portal
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#070D1F] text-slate-100 flex items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
        {/* Ambient luxury lighting */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#C9A227]/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 bg-[#0B132B]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C9A227]/20 to-amber-400/10 border border-[#C9A227]/40 shadow-xl mb-1">
              <Shield className="w-7 h-7 text-[#C9A227]" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
              Executive Administration
            </h1>
            <p className="text-xs text-slate-400">
              High-Trust Management Gateway for Digital CXOS
            </p>
          </div>

          {/* Sign In vs Sign Up Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-semibold">
            <button
              onClick={() => { setAuthTab("signin"); setAuthError(""); }}
              className={cn(
                "py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                authTab === "signin"
                  ? "bg-[#C9A227] text-slate-950 font-bold shadow-lg"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setAuthTab("signup"); setAuthError(""); }}
              className={cn(
                "py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                authTab === "signup"
                  ? "bg-[#C9A227] text-slate-950 font-bold shadow-lg"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Request Access</span>
            </button>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            {authTab === "signup" && (
              <>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Dr. Rajeshwar Rao"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Requested Administrative Role</label>
                  <select
                    value={authRole}
                    onChange={(e) => setAuthRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                  >
                    <option value="Super Admin">Super Administrator (Full System Control)</option>
                    <option value="Content Director">Content Director (Podcasts, Initiatives, Videos)</option>
                    <option value="Community Lead">Community Lead (Members &amp; Forms)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Executive Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@digitalcxos.org"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Security Credential / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            {authTab === "signup" && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason for Admin Clearance</label>
                <textarea
                  rows={2}
                  value={authJustification}
                  onChange={(e) => setAuthJustification(e.target.value)}
                  placeholder="Describe your organization role and required responsibilities..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 resize-none focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs bg-gradient-to-r from-[#C9A227] to-[#E5C058] hover:from-[#D4AF37] hover:to-[#F3CF65] text-slate-950 transition-all duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              {authLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : authTab === "signin" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Submit Clearance Request</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for instant evaluation */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block text-center">
              Quick 1-Click Demo Profiles
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("Super Admin")}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-400/30 text-amber-300 text-[10px] font-semibold text-center transition-all cursor-pointer"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("Content Director")}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-sky-400/30 text-sky-300 text-[10px] font-semibold text-center transition-all cursor-pointer"
              >
                Content Lead
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("Community Lead")}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold text-center transition-all cursor-pointer"
              >
                Community
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // AUTHENTICATED EXECUTIVE CONTROL PORTAL (SIDEBAR UI)
  // ========================================================
  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 flex flex-col antialiased selection:bg-[#C9A227] selection:text-slate-950">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ----------------------------------------------------
          DEDICATED EXECUTIVE LEFT SIDEBAR
      ---------------------------------------------------- */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen bg-[#070E22] border-r border-white/10 flex flex-col justify-between transition-all duration-300 select-none shadow-2xl",
        isSidebarCollapsed ? "w-20" : "w-72 xl:w-80",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        
        {/* Sidebar Header & Brand */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C9A227] via-amber-400 to-[#E5C058] flex items-center justify-center text-slate-950 font-bold font-serif text-lg shadow-lg shrink-0">
                CX
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A227]">
                      Digital CXOS
                    </span>
                  </div>
                  <h2 className="text-sm font-serif font-bold text-white tracking-tight truncate">
                    Executive Console
                  </h2>
                </div>
              )}
            </div>

            {/* Collapse toggle (Desktop) */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          {!isSidebarCollapsed && (
            <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center gap-3 shadow-inner">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-xs shrink-0">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 truncate">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">
          {navGroups.map((grp, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2 font-mono">
                  {grp.group}
                </span>
              )}

              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsMobileSidebarOpen(false);
                    }}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer",
                      isActive
                        ? "bg-[#C9A227] text-slate-950 font-bold shadow-[0_4px_20px_rgba(201,162,39,0.3)]"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn(
                      "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                      isActive ? "text-slate-950" : "text-[#C9A227]"
                    )} />

                    {!isSidebarCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}

                    {!isSidebarCollapsed && (item.badge || item.count !== null) && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                        isActive
                          ? "bg-slate-950 text-[#C9A227]"
                          : (item.badgeColor || "bg-white/10 text-slate-300")
                      )}>
                        {item.badge || item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Quick External Link to Live Website */}
          <div className="pt-2 border-t border-white/5">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-all group",
                isSidebarCollapsed && "justify-center"
              )}
              title="Open Public Website"
            >
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-300 shrink-0" />
              {!isSidebarCollapsed && (
                <span className="flex-1 text-left truncate">View Live Website</span>
              )}
            </a>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 bg-[#050C1F] space-y-2">
          {!isSidebarCollapsed ? (
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-slate-300 font-mono">Mock DB Active</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 font-semibold cursor-pointer text-[10px] uppercase"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-full p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ----------------------------------------------------
          RIGHT MAIN CONTENT AREA
      ---------------------------------------------------- */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 bg-[#060B18] transition-all duration-300",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-72 xl:ml-80"
      )}>
        
        {/* Top Navbar Header inside Admin */}
        <header className="sticky top-0 z-30 bg-[#070E22]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb title */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] font-mono block">
                Executive Portal / {activeTab.toUpperCase()}
              </span>
              <h1 className="text-base sm:text-lg font-serif font-bold text-white capitalize leading-tight">
                {activeTab.replace("-", " ")} Workspace
              </h1>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Global Search Bar */}
            <div className="relative hidden lg:block w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Quick search data..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            {/* Refresh Data button */}
            <button
              onClick={() => refreshData()}
              disabled={isLoading}
              title="Refresh all real-time data"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin text-[#C9A227]")} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            {/* Fast Add Action Dropdown / Modal shortcuts */}
            <button
              onClick={() => {
                if (activeTab === "initiatives") handleOpenAddInitiative();
                else if (activeTab === "leadership") handleOpenAddLeader();
                else if (activeTab === "social") handleOpenAddSocial();
                else if (activeTab === "highlights") handleOpenAddHighlight();
                else if (activeTab === "podcasts") handleOpenAddPodcast();
                else if (activeTab === "events") handleOpenAddEvent();
                else if (activeTab === "partners") handleOpenAddPartner();
                else handleOpenAddInitiative();
              }}
              className="px-4 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New</span>
            </button>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          
          {/* ========================================================
              TAB 0: OVERVIEW & STRATEGIC HUB
          ======================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Executive Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C1736] via-[#0E1B40] to-[#0A142E] border border-white/10 p-6 sm:p-8 shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-bold uppercase tracking-widest">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Executive Master Console</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                      Welcome back, {currentUser.name}
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      The administration console provides a dedicated, full-screen executive sidebar workspace. Manage <strong className="text-[#C9A227]">Enrichment &amp; Contribution initiatives</strong>, <strong className="text-[#C9A227]">Leadership team members</strong>, <strong className="text-[#C9A227]">Social initiatives</strong>, <strong className="text-[#C9A227]">MP4 Event highlights</strong>, <strong className="text-[#C9A227]">YouTube podcasts</strong>, <strong className="text-[#C9A227]">events</strong>, <strong className="text-[#C9A227]">partners</strong>, and all <strong className="text-[#C9A227]">forms</strong> in real time.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleOpenAddInitiative()}
                      className="px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Initiative</span>
                    </button>
                    <button
                      onClick={() => handleOpenAddLeader()}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-purple-400" />
                      <span>Add Leader</span>
                    </button>
                    <button
                      onClick={() => handleOpenAddHighlight()}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      <span>Add MP4 Video</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div 
                  onClick={() => setActiveTab("members")}
                  className="p-5 rounded-2xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>CXO Members</span>
                    <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-[#C9A227]">{cxoMembers.length}</p>
                  <p className="text-[11px] text-amber-300/80 mt-1">{pendingCxoCount} pending approval</p>
                </div>

                <div 
                  onClick={() => setActiveTab("initiatives")}
                  className="p-5 rounded-2xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Initiatives</span>
                    <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-white">{initiatives.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">4 core sectors</p>
                </div>

                <div 
                  onClick={() => setActiveTab("leadership")}
                  className="p-5 rounded-2xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Leadership Team</span>
                    <Award className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-white">{teamMembers.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Founders &amp; Advisors</p>
                </div>

                <div 
                  onClick={() => setActiveTab("highlights")}
                  className="p-5 rounded-2xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>MP4 Highlights</span>
                    <Film className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-white">{eventHighlights.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Summit recordings</p>
                </div>

                <div 
                  onClick={() => setActiveTab("podcasts")}
                  className="p-5 rounded-2xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>YouTube Podcasts</span>
                    <Video className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-white">{podcasts.length}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Episodes published</p>
                </div>

                <div 
                  onClick={() => setActiveTab("contacts")}
                  className="p-5 rounded-2xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/50 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Contact Inquiries</span>
                    <MessageSquare className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-white">{contacts.length}</p>
                  <p className="text-[11px] text-teal-300 mt-1">{unreadContactCount} unread messages</p>
                </div>
              </div>

              {/* Operations Hub & Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Cols: Operations Hub */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-6 rounded-3xl bg-[#091228] border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold font-serif text-white">
                        Direct Content Management Shortcuts
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">Real-time sync</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <button
                        onClick={() => handleOpenAddInitiative()}
                        className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-amber-400/40 text-left transition-all flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                            Enrichment &amp; Contribution
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Create mentorship pods, labs, and sector roundtables.
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleOpenAddLeader()}
                        className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-purple-400/40 text-left transition-all flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="p-2.5 rounded-xl bg-purple-400/10 text-purple-400 group-hover:bg-purple-400 group-hover:text-slate-950 transition-colors">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                            Meet Our Leadership Team
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Add and edit all fields of founders, CIOs, and advisors.
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleOpenAddSocial()}
                        className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-rose-400/40 text-left transition-all flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="p-2.5 rounded-xl bg-rose-400/10 text-rose-400 group-hover:bg-rose-400 group-hover:text-slate-950 transition-colors">
                          <HeartHandshake className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
                            Our Social Initiatives
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Upload &amp; manage philanthropic and wellness imagery.
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleOpenAddHighlight()}
                        className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-emerald-400/40 text-left transition-all flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="p-2.5 rounded-xl bg-emerald-400/10 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-colors">
                          <Film className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                            EVENT HIGHLIGHTS (MP4)
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Publish direct video highlights with custom posters.
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleOpenAddPodcast()}
                        className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-sky-400/40 text-left transition-all flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="p-2.5 rounded-xl bg-sky-400/10 text-sky-400 group-hover:bg-sky-400 group-hover:text-slate-950 transition-colors">
                          <Video className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                            Podcast Series (YouTube)
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Paste YouTube link to auto-fetch video &amp; thumbnail.
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleOpenAddEvent()}
                        className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-amber-300/40 text-left transition-all flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="p-2.5 rounded-xl bg-amber-300/10 text-amber-300 group-hover:bg-amber-300 group-hover:text-slate-950 transition-colors">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
                            Conclaves &amp; Events
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Schedule future conclaves or archive past roundtables.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Pending CXO Review Queue */}
                  <div className="p-6 rounded-3xl bg-[#091228] border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold font-serif text-white">
                          Pending CXO Applications
                        </h3>
                        <p className="text-xs text-slate-400">Review applicants awaiting approval</p>
                      </div>
                      <button
                        onClick={() => setActiveTab("members")}
                        className="text-xs font-bold text-[#C9A227] hover:underline"
                      >
                        View All ({cxoMembers.length})
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {cxoMembers.slice(0, 3).map((m) => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <p className="font-bold text-slate-100">
                              {m.title} {m.firstName} {m.lastName}
                            </p>
                            <p className="text-slate-400 text-[11px]">
                              {m.designation} • <span className="text-[#C9A227]">{m.organization}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              m.status === "Approved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                              m.status === "Contacted" ? "bg-sky-500/20 text-sky-300 border border-sky-500/30" :
                              "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            )}>
                              {m.status}
                            </span>
                            <button
                              onClick={() => setSelectedCxo(m)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
                            >
                              Dossier
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Inquiries & Live Status */}
                <div className="space-y-6">
                  {/* Contact Inquiries Box */}
                  <div className="p-6 rounded-3xl bg-[#091228] border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold font-serif text-white">
                        Recent Inquiries
                      </h3>
                      <button
                        onClick={() => setActiveTab("contacts")}
                        className="text-xs font-bold text-[#C9A227] hover:underline"
                      >
                        All Messages
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {contacts.slice(0, 4).map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedContact(c)}
                          className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 hover:border-white/20 transition-all cursor-pointer space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-slate-100">{c.name}</p>
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                              c.status === "Unread" ? "bg-teal-500/20 text-teal-300" : "bg-slate-800 text-slate-400"
                            )}>
                              {c.status}
                            </span>
                          </div>
                          <p className="text-slate-400 line-clamp-2 text-[11px]">{c.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API Integration Readiness Box */}
                  <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0B1530] to-[#070D1F] border border-[#C9A227]/30 space-y-3 shadow-xl">
                    <div className="flex items-center gap-2 text-[#C9A227]">
                      <Globe className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Backend API Readiness</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Host URL can be configured directly in the <strong className="text-amber-300">API Host Config</strong> tab when backend engineers provide the live URL. All schemas are synchronized with production specifications.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab("api-hub")}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Configure Backend URL</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 1: ENRICHMENT & CONTRIBUTION (Req 1)
          ======================================================== */}
          {activeTab === "initiatives" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 1</span>
                    <span className="text-xs text-slate-400">• Full Admin CRUD</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">
                    Enrichment &amp; Contribution Management
                  </h2>
                  <p className="text-xs text-slate-400">
                    Admin can add, edit, and organize all strategic initiatives, mentoring circles, and crisis simulation pods.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddInitiative}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Initiative</span>
                </button>
              </div>

              {/* Initiatives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {initiatives.map((item) => {
                  const IconComponent = ICON_OPTIONS.find((o) => o.name === item.iconName)?.icon || Sparkles;

                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/60 transition-all flex flex-col justify-between group shadow-lg"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-9 h-9 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold">
                            {item.category}
                          </span>
                        </div>

                        <h3 className="text-sm font-serif font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-slate-500">#{item.id}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditInitiative(item)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Initiative"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteInitiative(item.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                            title="Delete Initiative"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: MEET OUR LEADERSHIP TEAM (Req 2)
          ======================================================== */}
          {activeTab === "leadership" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 2</span>
                    <span className="text-xs text-slate-400">• All Fields Editable</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">
                    Meet Our Leadership Team &amp; Advisors
                  </h2>
                  <p className="text-xs text-slate-400">
                    Full control of all fields: Name, Role, Slug, Bio, Sectors, LinkedIn, Photo Image URL, Experience, and Philosophy Quote.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddLeader}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Leadership Member</span>
                </button>
              </div>

              {/* Leadership Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                  <div
                    key={member.id || member.slug}
                    className="rounded-3xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/60 overflow-hidden transition-all flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      {/* Portrait Photo */}
                      <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                        <img
                          src={member.image || "/assests/rohit-1.webp"}
                          alt={member.name}
                          className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assests/rohit-1.webp";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#091228] via-transparent to-transparent" />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#C9A227]">
                          {member.experience || "Executive"}
                        </div>
                      </div>

                      {/* Member Details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-white">
                            {member.name}
                          </h3>
                          <p className="text-xs font-semibold text-[#C9A227] mt-0.5">
                            {member.role}
                          </p>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {member.bio}
                        </p>

                        {member.quote && (
                          <p className="text-[11px] italic text-slate-300 border-l-2 border-[#C9A227] pl-2 line-clamp-2">
                            &ldquo;{member.quote}&rdquo;
                          </p>
                        )}

                        {/* Sectors Chips */}
                        {member.sectors && member.sectors.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {member.sectors.map((sec, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                              >
                                {sec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="p-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between text-xs">
                      <a
                        href={member.linkedin || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3 text-[#C9A227]" />
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditLeader(member)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-amber-300" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteLeader(member.id || member.slug)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: OUR SOCIAL INITIATIVES (Req 3 - Images from Admin)
          ======================================================== */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 3</span>
                    <span className="text-xs text-slate-400">• Imagery &amp; Campaigns from Admin</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">
                    Our Social Initiatives Management
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage philanthropic commitments, CXO wellness retreats, and preventive health screening programs with high-res imagery.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddSocial}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Social Initiative</span>
                </button>
              </div>

              {/* Social Initiatives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialInitiatives.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/60 overflow-hidden transition-all flex flex-col justify-between shadow-xl group"
                  >
                    <div>
                      {/* Big Photography Banner */}
                      <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#091228] via-black/20 to-black/30" />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#C9A227]">
                          {item.tag}
                        </div>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors uppercase tracking-wide">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">Link: {item.link}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditSocial(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-amber-300" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSocial(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: EVENT HIGHLIGHTS (Req 4 - MP4 Videos from Admin)
          ======================================================== */}
          {activeTab === "highlights" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 4</span>
                    <span className="text-xs text-slate-400">• Mainly MP4 Videos from Admin</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">
                    Event Highlights (MP4 Video Manager)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Publish direct MP4 conclave videos with custom posters, duration tags, and instant in-dashboard video playback testing.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddHighlight}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add MP4 Video Highlight</span>
                </button>
              </div>

              {/* Video Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventHighlights.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/60 overflow-hidden transition-all flex flex-col justify-between shadow-xl group"
                  >
                    <div>
                      {/* Video Poster with Play Overlay */}
                      <div 
                        onClick={() => setPreviewVideoUrl(item.videoUrl)}
                        className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer"
                      >
                        <img
                          src={item.posterUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#C9A227] text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-[#C9A227]">
                          {item.tag}
                        </div>

                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                          {item.duration || "03:30"}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                          {item.edition}
                        </span>
                        <h3 className="text-sm font-serif font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono truncate">
                          MP4: {item.videoUrl}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setPreviewVideoUrl(item.videoUrl)}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Test MP4 Playback</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditHighlight(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-amber-300" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteHighlight(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: PODCAST SERIES (Req 5 - YouTube URL & Auto-fetch)
          ======================================================== */}
          {activeTab === "podcasts" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 5</span>
                    <span className="text-xs text-slate-400">• YouTube URL Auto-Fetch</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">
                    Our Latest Podcast Series
                  </h2>
                  <p className="text-xs text-slate-400">
                    Admin puts YouTube links and web automatically parses the video ID, generates embed preview, and renders thumbnails.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddPodcast}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add YouTube Podcast</span>
                </button>
              </div>

              {/* Podcasts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcasts.map((p) => {
                  const youtubeId = p.youtubeId || extractYouTubeId(p.youtubeUrl);
                  const thumb = p.thumbnailUrl || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "/assests/rohit-1.webp");

                  return (
                    <div
                      key={p.id}
                      className="rounded-3xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/60 overflow-hidden transition-all flex flex-col justify-between shadow-xl group"
                    >
                      <div>
                        {/* Thumbnail & YouTube Overlay */}
                        <div 
                          onClick={() => youtubeId && setPreviewYoutubeId(youtubeId)}
                          className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer"
                        >
                          <img
                            src={thumb}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>

                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-sky-400">
                            YouTube ID: {youtubeId || "Auto"}
                          </div>

                          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                            {p.duration || "45 mins"}
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-[#C9A227]">
                              {p.subtitle}
                            </p>
                            <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5 line-clamp-2">
                              {p.title}
                            </h3>
                          </div>

                          {p.guests && p.guests.length > 0 && (
                            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 text-xs">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Featured Guests:</span>
                              {p.guests.map((g, i) => (
                                <p key={i} className="text-slate-200">
                                  <strong>{g.name}</strong> • {g.role}, {g.organization}
                                </p>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {p.overview}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between text-xs">
                        <button
                          onClick={() => youtubeId && setPreviewYoutubeId(youtubeId)}
                          className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Watch Episode</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditPodcast(p)}
                            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-amber-300" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeletePodcast(p.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: EVENTS MANAGEMENT (Req 6)
          ======================================================== */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 6</span>
                    <span className="text-xs text-slate-400">• Upcoming &amp; Past Conclaves</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">
                    Events &amp; Conclaves Management
                  </h2>
                  <p className="text-xs text-slate-400">
                    Create upcoming executive summits or record past closed-door roundtables with video highlights and agendas.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddEvent}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Event</span>
                </button>
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="rounded-3xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/60 overflow-hidden transition-all flex flex-col justify-between shadow-xl group"
                  >
                    <div>
                      {/* Event Banner */}
                      <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                        <img
                          src={evt.thumbnailUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#091228] via-black/20 to-black/30" />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#C9A227]">
                          {evt.type === "upcoming" ? "Upcoming Conclave" : "Past Summit"}
                        </div>
                        <div className="absolute bottom-3 left-3 text-xs font-bold text-white">
                          {evt.date}
                        </div>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                          {evt.title}
                        </h3>
                        <p className="text-xs font-semibold text-[#C9A227]">
                          {evt.venue}
                        </p>
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {evt.tagline}
                        </p>
                        {evt.attendeesCount && (
                          <p className="text-[11px] text-slate-400 font-mono">
                            Confirmed: {evt.attendeesCount}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">#{evt.id}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditEvent(evt)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-amber-300" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 7: PARTNERS LIST & APPLICATIONS (Req 7)
          ======================================================== */}
          {activeTab === "partners" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 7</span>
                    <span className="text-xs text-slate-400">• Partners Management</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">
                    Partners Directory &amp; Collaboration Applications
                  </h2>
                  <p className="text-xs text-slate-400">
                    Admin can view partner inquiries received through the portal and manage official ecosystem partners.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddPartner}
                    className="px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Partner to Directory</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs: Directory Catalog vs Submitted Applications */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs">
                <button
                  onClick={() => setPartnersSubTab("catalog")}
                  className={cn(
                    "px-4 py-2 rounded-xl font-bold transition-all cursor-pointer",
                    partnersSubTab === "catalog"
                      ? "bg-[#C9A227] text-slate-950 shadow-md"
                      : "bg-white/5 text-slate-300 hover:text-white"
                  )}
                >
                  Official Partners Directory ({partnersCatalog.length})
                </button>
                <button
                  onClick={() => setPartnersSubTab("applications")}
                  className={cn(
                    "px-4 py-2 rounded-xl font-bold transition-all cursor-pointer",
                    partnersSubTab === "applications"
                      ? "bg-[#C9A227] text-slate-950 shadow-md"
                      : "bg-white/5 text-slate-300 hover:text-white"
                  )}
                >
                  Received Partner Inquiries ({partnerMembers.length})
                  {pendingPartnerCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px]">
                      {pendingPartnerCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Sub-tab 1: Directory Catalog */}
              {partnersSubTab === "catalog" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {partnersCatalog.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-5 rounded-3xl bg-[#091228] border border-white/10 hover:border-[#C9A227]/60 transition-all flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                            {partner.tier}
                          </span>
                          <span className={cn(
                            "w-2.5 h-2.5 rounded-full",
                            partner.status === "Active" ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-slate-500"
                          )} />
                        </div>

                        <div className="h-16 w-full flex items-center justify-center bg-slate-900/80 rounded-2xl p-2 mb-4">
                          <img
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="max-h-12 max-w-full object-contain"
                          />
                        </div>

                        <h3 className="text-base font-serif font-bold text-white mb-1">
                          {partner.name}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {partner.description || "Strategic enterprise partner in leadership excellence."}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                        >
                          <span>Visit Site</span>
                          <ExternalLink className="w-3 h-3 text-[#C9A227]" />
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditPartner(partner)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePartnerCatalog(partner.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 2: Received Applications */}
              {partnersSubTab === "applications" && (
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#091228] shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#050C1F] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3">Applicant &amp; Role</th>
                          <th className="px-4 py-3">Organization</th>
                          <th className="px-4 py-3">Contact</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {partnerMembers.map((p) => (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3.5">
                              <p className="font-bold text-white">{p.title} {p.firstName} {p.lastName}</p>
                              <p className="text-slate-400 text-[11px]">{p.designation}</p>
                            </td>
                            <td className="px-4 py-3.5 text-[#C9A227] font-semibold">{p.organization}</td>
                            <td className="px-4 py-3.5">
                              <p>{p.email}</p>
                              <p className="text-slate-400 text-[11px]">{p.mobile}</p>
                            </td>
                            <td className="px-4 py-3.5">{p.city}, {p.state}</td>
                            <td className="px-4 py-3.5">
                              <span className={cn(
                                "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                                p.status === "Approved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                                p.status === "Contacted" ? "bg-sky-500/20 text-sky-300 border border-sky-500/30" :
                                "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              )}>
                                {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedPartnerApp(p)}
                                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleUpdatePartnerAppStatus(p.id, "Approved")}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                                >
                                  Approve
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
            </div>
          )}

          {/* ========================================================
              TAB 8: CONTACT US FORM LIST (Req 8)
          ======================================================== */}
          {activeTab === "contacts" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Requirement 8</span>
                    <span className="text-xs text-slate-400">• Inquiries Management</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">
                    Contact Us Form Inquiries Inbox
                  </h2>
                  <p className="text-xs text-slate-400">
                    View submitted executive inquiries, reply notes, and status management.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by sender or message..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>
              </div>

              {/* Inquiries Table */}
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#091228] shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#050C1F] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3">Sender Name</th>
                        <th className="px-4 py-3">Email &amp; Phone</th>
                        <th className="px-4 py-3">Message Snippet</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredContacts.map((c) => (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-white">
                            {c.title} {c.name}
                          </td>
                          <td className="px-4 py-3.5">
                            <p>{c.email}</p>
                            <p className="text-slate-400 text-[11px]">{c.phone}</p>
                          </td>
                          <td className="px-4 py-3.5 max-w-xs truncate text-slate-300">
                            {c.message}
                          </td>
                          <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">
                            {formatDate(c.submittedAt)}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                              c.status === "Unread" ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" :
                              c.status === "Replied" ? "bg-sky-500/20 text-sky-300 border border-sky-500/30" :
                              "bg-slate-800 text-slate-400"
                            )}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedContact(c)}
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                              >
                                Read &amp; Reply
                              </button>
                              <button
                                onClick={() => handleUpdateContactStatus(c.id, c.status === "Archived" ? "Unread" : "Archived")}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                              >
                                {c.status === "Archived" ? "Unarchive" : "Archive"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 9: MEMBERS DIRECTORY
          ======================================================== */}
          {activeTab === "members" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">
                    CXO Members Directory
                  </h2>
                  <p className="text-xs text-slate-400">
                    Filter, search, approve, and export validated leadership fraternity applications.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, organization..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#C9A227]"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>

                  <button
                    onClick={exportCxoCsv}
                    className="px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* CXO Members Table */}
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#091228] shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#050C1F] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3">Member Name &amp; Title</th>
                        <th className="px-4 py-3">Designation &amp; Organization</th>
                        <th className="px-4 py-3">Official Email</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredCxo.map((m) => (
                        <tr key={m.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-white">{m.title} {m.firstName} {m.lastName}</p>
                            <p className="text-slate-400 text-[11px]">{m.industry}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-amber-300">{m.designation}</p>
                            <p className="text-slate-300">{m.organization}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p>{m.officialEmail}</p>
                            <p className="text-slate-400 text-[11px]">{m.mobile}</p>
                          </td>
                          <td className="px-4 py-3.5">{m.city}, {m.state}</td>
                          <td className="px-4 py-3.5">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                              m.status === "Approved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                              m.status === "Contacted" ? "bg-sky-500/20 text-sky-300 border border-sky-500/30" :
                              "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            )}>
                              {m.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedCxo(m)}
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                              >
                                Dossier
                              </button>
                              <button
                                onClick={() => handleUpdateCxoStatus(m.id, "Approved")}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                              >
                                Approve
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 10: FORMS CONSOLIDATION
          ======================================================== */}
          {activeTab === "forms" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">
                    Consolidated Form Submissions Hub
                  </h2>
                  <p className="text-xs text-slate-400">
                    Switch between CXO registrations, partner collaboration inquiries, and contact submissions.
                  </p>
                </div>

                {/* Sub-tabs */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
                  <button
                    onClick={() => setFormsSubTab("cxo")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                      formsSubTab === "cxo" ? "bg-[#C9A227] text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                    )}
                  >
                    CXO Submissions ({cxoMembers.length})
                  </button>
                  <button
                    onClick={() => setFormsSubTab("partners")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                      formsSubTab === "partners" ? "bg-[#C9A227] text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Partners ({partnerMembers.length})
                  </button>
                  <button
                    onClick={() => setFormsSubTab("contacts")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                      formsSubTab === "contacts" ? "bg-[#C9A227] text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Contact Messages ({contacts.length})
                  </button>
                </div>
              </div>

              {/* Display respective table */}
              {formsSubTab === "cxo" && (
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#091228] p-4">
                  <p className="text-xs text-slate-400 mb-3">Viewing {cxoMembers.length} CXO membership submissions.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="text-[10px] text-slate-400 font-bold uppercase border-b border-white/10 pb-2">
                        <tr>
                          <th className="py-2">Name</th>
                          <th className="py-2">Organization</th>
                          <th className="py-2">Interests</th>
                          <th className="py-2">Date</th>
                          <th className="py-2">Status</th>
                          <th className="py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {cxoMembers.map((m) => (
                          <tr key={m.id} className="hover:bg-white/5">
                            <td className="py-3 font-semibold text-white">{m.firstName} {m.lastName}</td>
                            <td className="py-3 text-amber-300">{m.organization}</td>
                            <td className="py-3 text-slate-400 max-w-xs truncate">{m.strategicInterests}</td>
                            <td className="py-3 text-slate-400">{formatDate(m.submittedAt)}</td>
                            <td className="py-3 font-bold">{m.status}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => setSelectedCxo(m)}
                                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                              >
                                View Dossier
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {formsSubTab === "partners" && (
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#091228] p-4">
                  <p className="text-xs text-slate-400 mb-3">Viewing {partnerMembers.length} partner applications.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="text-[10px] text-slate-400 font-bold uppercase border-b border-white/10 pb-2">
                        <tr>
                          <th className="py-2">Name</th>
                          <th className="py-2">Organization</th>
                          <th className="py-2">Email</th>
                          <th className="py-2">Date</th>
                          <th className="py-2">Status</th>
                          <th className="py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {partnerMembers.map((p) => (
                          <tr key={p.id} className="hover:bg-white/5">
                            <td className="py-3 font-semibold text-white">{p.firstName} {p.lastName}</td>
                            <td className="py-3 text-amber-300">{p.organization}</td>
                            <td className="py-3 text-slate-400">{p.email}</td>
                            <td className="py-3 text-slate-400">{formatDate(p.submittedAt)}</td>
                            <td className="py-3 font-bold">{p.status}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => setSelectedPartnerApp(p)}
                                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {formsSubTab === "contacts" && (
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#091228] p-4">
                  <p className="text-xs text-slate-400 mb-3">Viewing {contacts.length} incoming contact inquiries.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="text-[10px] text-slate-400 font-bold uppercase border-b border-white/10 pb-2">
                        <tr>
                          <th className="py-2">Sender</th>
                          <th className="py-2">Email</th>
                          <th className="py-2">Message</th>
                          <th className="py-2">Date</th>
                          <th className="py-2">Status</th>
                          <th className="py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {contacts.map((c) => (
                          <tr key={c.id} className="hover:bg-white/5">
                            <td className="py-3 font-semibold text-white">{c.name}</td>
                            <td className="py-3 text-slate-400">{c.email}</td>
                            <td className="py-3 text-slate-300 max-w-sm truncate">{c.message}</td>
                            <td className="py-3 text-slate-400">{formatDate(c.submittedAt)}</td>
                            <td className="py-3 font-bold">{c.status}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => setSelectedContact(c)}
                                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
                              >
                                Read
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 11: API HOST INTEGRATION HUB
          ======================================================== */}
          {activeTab === "api-hub" && (
            <div className="space-y-6 max-w-4xl">
              <div className="pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Backend Ready</span>
                  <span className="text-xs text-slate-400">• Seamless Integration</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-white mt-1">
                  Backend API Host Configuration
                </h2>
                <p className="text-xs text-slate-400">
                  When your backend engineering team deploys the central microservices, configure the host URL below to link all UI components.
                </p>
              </div>

              {/* Host URL Settings Card */}
              <div className="p-6 rounded-3xl bg-[#091228] border border-white/10 space-y-4 shadow-xl">
                <h3 className="text-base font-bold font-serif text-white">
                  Environment Host URL
                </h3>
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    Production / Staging API Base URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={backendHostUrl}
                      onChange={(e) => setBackendHostUrl(e.target.value)}
                      placeholder="https://api.digitalcxos.org/v1"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 font-mono focus:outline-none focus:border-[#C9A227]"
                    />
                    <button
                      onClick={handleSaveBackendHost}
                      className="px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-lg"
                    >
                      Save URL
                    </button>
                  </div>
                  {apiSaveMessage && (
                    <p className="text-xs text-emerald-400 mt-2 font-semibold">{apiSaveMessage}</p>
                  )}
                </div>
              </div>

              {/* Endpoints Contract Reference */}
              <div className="p-6 rounded-3xl bg-[#091228] border border-white/10 space-y-4 text-xs shadow-xl">
                <h3 className="text-base font-bold font-serif text-white">
                  Implemented REST Endpoints Specification
                </h3>
                <p className="text-slate-400">
                  All following endpoints are implemented with mock/file engine and ready to bridge:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold">GET / POST / PUT / DELETE</span>
                    <p className="text-white">/api/admin/initiatives</p>
                    <p className="text-[11px] text-slate-400 font-sans">Enrichment &amp; Contribution</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold">GET / POST / PUT / DELETE</span>
                    <p className="text-white">/api/admin/leadership</p>
                    <p className="text-[11px] text-slate-400 font-sans">Meet Our Leadership Team</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold">GET / POST / PUT / DELETE</span>
                    <p className="text-white">/api/admin/social-initiatives</p>
                    <p className="text-[11px] text-slate-400 font-sans">Our Social Initiatives</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold">GET / POST / PUT / DELETE</span>
                    <p className="text-white">/api/admin/event-highlights</p>
                    <p className="text-[11px] text-slate-400 font-sans">MP4 Video Highlights</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold">GET / POST / PUT / DELETE</span>
                    <p className="text-white">/api/admin/podcasts</p>
                    <p className="text-[11px] text-slate-400 font-sans">YouTube Podcasts (auto-parse ID)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold">GET / POST / PUT / DELETE</span>
                    <p className="text-white">/api/admin/events</p>
                    <p className="text-[11px] text-slate-400 font-sans">Upcoming &amp; Past Conclaves</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold">GET / POST / PUT / DELETE</span>
                    <p className="text-white">/api/admin/partners</p>
                    <p className="text-[11px] text-slate-400 font-sans">Partners Catalog &amp; Applications</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold">GET / PATCH / DELETE</span>
                    <p className="text-white">/api/admin/contacts</p>
                    <p className="text-[11px] text-slate-400 font-sans">Contact Inquiries Inbox</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          MODAL 1: ADD / EDIT INITIATIVE (Req 1)
      ======================================================== */}
      {showInitiativeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B142E] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                  Enrichment &amp; Contribution
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                  {editingInitiativeId ? "Edit Strategic Initiative" : "Add New Initiative"}
                </h3>
              </div>
              <button
                onClick={() => setShowInitiativeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInitiative} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initiative Title</label>
                <input
                  type="text"
                  required
                  value={initTitle}
                  onChange={(e) => setInitTitle(e.target.value)}
                  placeholder="e.g. Conduct Crisis Simulation Labs"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={initCategory}
                    onChange={(e) => setInitCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                  >
                    {INITIATIVE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Card Icon</label>
                  <select
                    value={initIconName}
                    onChange={(e) => setInitIconName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.name} value={opt.name}>{opt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={initDescription}
                  onChange={(e) => setInitDescription(e.target.value)}
                  placeholder="Detail the value proposition for digital executives..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 resize-none focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInitiativeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ADD / EDIT LEADER (Req 2 - All fields)
      ======================================================== */}
      {showLeaderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B142E] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                  Meet Our Leadership Team
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                  {editingLeaderId ? "Edit Leadership Profile" : "Add Leadership Member"}
                </h3>
              </div>
              <button
                onClick={() => setShowLeaderModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeader} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => {
                      setLeaderName(e.target.value);
                      if (!editingLeaderId) {
                        setLeaderSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    placeholder="e.g. Rohit Kachroo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Executive Role</label>
                  <input
                    type="text"
                    required
                    value={leaderRole}
                    onChange={(e) => setLeaderRole(e.target.value)}
                    placeholder="Chief Strategy Officer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Profile URL Slug</label>
                  <input
                    type="text"
                    required
                    value={leaderSlug}
                    onChange={(e) => setLeaderSlug(e.target.value)}
                    placeholder="rohit-kachroo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Years / Credential</label>
                  <input
                    type="text"
                    value={leaderExperience}
                    onChange={(e) => setLeaderExperience(e.target.value)}
                    placeholder="25+ Years Executive Experience"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Photo Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={leaderImage}
                    onChange={(e) => setLeaderImage(e.target.value)}
                    placeholder="/assests/rohit-1.webp or https://..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
                <div className="flex gap-2 mt-1.5">
                  <span className="text-[10px] text-slate-400">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setLeaderImage("/assests/rohit-1.webp")}
                    className="text-[10px] text-[#C9A227] hover:underline"
                  >
                    Rohit
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaderImage("/assests/kuldeep.webp")}
                    className="text-[10px] text-[#C9A227] hover:underline"
                  >
                    Kuldeep
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaderImage("/assests/priya.png")}
                    className="text-[10px] text-[#C9A227] hover:underline"
                  >
                    Priya
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaderImage("/assests/dfgd.png")}
                    className="text-[10px] text-[#C9A227] hover:underline"
                  >
                    Sujoy
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaderImage("/assests/amit.png")}
                    className="text-[10px] text-[#C9A227] hover:underline"
                  >
                    Amit
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sectors / Domains (Comma-separated)</label>
                <input
                  type="text"
                  value={leaderSectors}
                  onChange={(e) => setLeaderSectors(e.target.value)}
                  placeholder="Financial Services, ITES, Enterprise Strategy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">LinkedIn Profile Link</label>
                <input
                  type="text"
                  value={leaderLinkedin}
                  onChange={(e) => setLeaderLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Executive Bio</label>
                <textarea
                  rows={3}
                  required
                  value={leaderBio}
                  onChange={(e) => setLeaderBio(e.target.value)}
                  placeholder="Accomplished executive with global leadership..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Leadership Creed / Quote</label>
                <input
                  type="text"
                  value={leaderQuote}
                  onChange={(e) => setLeaderQuote(e.target.value)}
                  placeholder="Empowering boardroom influencers to lead high-impact strategic shifts."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLeaderModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: ADD / EDIT SOCIAL INITIATIVE (Req 3 - Images)
      ======================================================== */}
      {showSocialModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B142E] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                  Our Social Initiatives
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                  {editingSocialId ? "Edit Social Initiative" : "Add Social Initiative"}
                </h3>
              </div>
              <button
                onClick={() => setShowSocialModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSocial} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tag / Category</label>
                  <input
                    type="text"
                    required
                    value={socialTag}
                    onChange={(e) => setSocialTag(e.target.value)}
                    placeholder="Executive Vitality"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Link</label>
                  <input
                    type="text"
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    placeholder="/initiatives"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initiative Title</label>
                <input
                  type="text"
                  required
                  value={socialTitle}
                  onChange={(e) => setSocialTitle(e.target.value)}
                  placeholder="CXO WELLNESS RETREATS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">High-Res Image URL</label>
                <input
                  type="text"
                  required
                  value={socialImage}
                  onChange={(e) => setSocialImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
                {socialImage && (
                  <div className="mt-2 aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                    <img
                      src={socialImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={socialDescription}
                  onChange={(e) => setSocialDescription(e.target.value)}
                  placeholder="Hosting immersive wellness experiences focused on rejuvenation..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSocialModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: ADD / EDIT VIDEO HIGHLIGHT (Req 4 - MP4)
      ======================================================== */}
      {showHighlightModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B142E] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                  EVENT HIGHLIGHTS (MP4)
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                  {editingHighlightId ? "Edit Video Highlight" : "Add MP4 Video Highlight"}
                </h3>
              </div>
              <button
                onClick={() => setShowHighlightModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHighlight} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Highlight Title</label>
                <input
                  type="text"
                  required
                  value={hlTitle}
                  onChange={(e) => setHlTitle(e.target.value)}
                  placeholder="Digital CXOS National Conclave — The Sovereign AI Era"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Conclave Edition</label>
                  <input
                    type="text"
                    required
                    value={hlEdition}
                    onChange={(e) => setHlEdition(e.target.value)}
                    placeholder="2026 Annual Conclave"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category Tag</label>
                  <input
                    type="text"
                    required
                    value={hlTag}
                    onChange={(e) => setHlTag(e.target.value)}
                    placeholder="Flagship Conclave"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Direct MP4 Video URL</label>
                <input
                  type="text"
                  required
                  value={hlVideoUrl}
                  onChange={(e) => setHlVideoUrl(e.target.value)}
                  placeholder="https://commondatastorage.googleapis.com/.../BigBuckBunny.mp4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Video Poster / Thumbnail URL</label>
                <input
                  type="text"
                  required
                  value={hlPosterUrl}
                  onChange={(e) => setHlPosterUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1540575467063-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Duration Tag</label>
                <input
                  type="text"
                  value={hlDuration}
                  onChange={(e) => setHlDuration(e.target.value)}
                  placeholder="03:45"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowHighlightModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save MP4 Highlight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: ADD / EDIT PODCAST (Req 5 - YouTube URL)
      ======================================================== */}
      {showPodcastModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B142E] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                  Our latest Podcast Series
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                  {editingPodcastId ? "Edit Podcast Episode" : "Add YouTube Podcast"}
                </h3>
              </div>
              <button
                onClick={() => setShowPodcastModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePodcast} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  YouTube Link (Web fetches video automatically)
                </label>
                <input
                  type="text"
                  required
                  value={podYoutubeUrl}
                  onChange={(e) => setPodYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 focus:outline-none focus:border-[#C9A227]"
                />
                {podYoutubeUrl && extractYouTubeId(podYoutubeUrl) && (
                  <p className="text-[11px] text-emerald-400 mt-1 font-mono">
                    ✓ Recognized YouTube ID: {extractYouTubeId(podYoutubeUrl)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Episode Title</label>
                <input
                  type="text"
                  required
                  value={podTitle}
                  onChange={(e) => setPodTitle(e.target.value)}
                  placeholder="AI, Cybersecurity &amp; Digital Trust"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subtitle / Series Theme</label>
                  <input
                    type="text"
                    value={podSubtitle}
                    onChange={(e) => setPodSubtitle(e.target.value)}
                    placeholder="AI Changes Everything"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={podDuration}
                    onChange={(e) => setPodDuration(e.target.value)}
                    placeholder="48 mins"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
              </div>

              {/* Guest Details */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Featured Guest Information</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={podGuestName}
                    onChange={(e) => setPodGuestName(e.target.value)}
                    placeholder="Guest Name"
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-slate-100 text-xs"
                  />
                  <input
                    type="text"
                    value={podGuestRole}
                    onChange={(e) => setPodGuestRole(e.target.value)}
                    placeholder="Guest Role"
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-slate-100 text-xs"
                  />
                  <input
                    type="text"
                    value={podGuestOrg}
                    onChange={(e) => setPodGuestOrg(e.target.value)}
                    placeholder="Organization"
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-white/10 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Episode Overview</label>
                <textarea
                  rows={2}
                  value={podOverview}
                  onChange={(e) => setPodOverview(e.target.value)}
                  placeholder="Key themes explored in this boardroom dialogue..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPodcastModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 6: ADD / EDIT EVENT (Req 6)
      ======================================================== */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B142E] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                  Events &amp; Conclaves
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                  {editingEventId ? "Edit Conclave Event" : "Add New Event"}
                </h3>
              </div>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  placeholder="National CXO Strategy Summit 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date &amp; Schedule</label>
                  <input
                    type="text"
                    required
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    placeholder="14–15 November 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Venue / City</label>
                  <input
                    type="text"
                    value={evtVenue}
                    onChange={(e) => setEvtVenue(e.target.value)}
                    placeholder="Grand Hyatt, Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={evtTagline}
                  onChange={(e) => setEvtTagline(e.target.value)}
                  placeholder="Architecting Sovereign Tech Stacks &amp; Generative AI for India Inc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Type</label>
                  <select
                    value={evtType}
                    onChange={(e) => setEvtType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  >
                    <option value="upcoming">Upcoming Conclave</option>
                    <option value="past">Past Event Archive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expected Attendees</label>
                  <input
                    type="text"
                    value={evtAttendeesCount}
                    onChange={(e) => setEvtAttendeesCount(e.target.value)}
                    placeholder="200+ Confirmed CXOs"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Banner / Thumbnail URL</label>
                <input
                  type="text"
                  value={evtThumbnailUrl}
                  onChange={(e) => setEvtThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={evtDescription}
                  onChange={(e) => setEvtDescription(e.target.value)}
                  placeholder="India's premier annual strategic gathering for enterprise decision-makers..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 7: ADD / EDIT PARTNER (Req 7)
      ======================================================== */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B142E] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                  Partners Directory
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                  {editingPartnerId ? "Edit Partner Entry" : "Add Partner to Directory"}
                </h3>
              </div>
              <button
                onClick={() => setShowPartnerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Partner Organization Name</label>
                <input
                  type="text"
                  required
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="CloudScale India Inc"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Partnership Tier</label>
                  <select
                    value={partTier}
                    onChange={(e) => setPartTier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  >
                    <option value="Strategic Partner">Strategic Partner</option>
                    <option value="Technology Partner">Technology Partner</option>
                    <option value="Knowledge Partner">Knowledge Partner</option>
                    <option value="Media Partner">Media Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={partStatus}
                    onChange={(e) => setPartStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Logo Image URL</label>
                <input
                  type="text"
                  required
                  value={partLogoUrl}
                  onChange={(e) => setPartLogoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Website URL</label>
                <input
                  type="text"
                  value={partWebsiteUrl}
                  onChange={(e) => setPartWebsiteUrl(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Value Mandate</label>
                <textarea
                  rows={2}
                  value={partDescription}
                  onChange={(e) => setPartDescription(e.target.value)}
                  placeholder="Cloud sovereign migration &amp; enterprise zero-trust alliance..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          VIDEO PLAYER MODAL (MP4 Test Preview)
      ======================================================== */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B142E] border border-amber-400/40 rounded-3xl p-4 sm:p-6 max-w-3xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#C9A227]">
                <Film className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">MP4 Video Player Preview</span>
              </div>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-[11px] text-slate-400 font-mono truncate">
              Source: {previewVideoUrl}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          YOUTUBE EMBED PLAYER MODAL
      ======================================================== */}
      {previewYoutubeId && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B142E] border border-amber-400/40 rounded-3xl p-4 sm:p-6 max-w-3xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-red-500">
                <Video className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  YouTube Thought Leadership Podcast Player
                </span>
              </div>
              <button
                onClick={() => setPreviewYoutubeId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`https://www.youtube.com/embed/${previewYoutubeId}?autoplay=1`}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SELECTED CXO DOSSIER MODAL
      ======================================================== */}
      {selectedCxo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A1228] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A227]">
                  Executive Application Dossier
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-100 mt-1">
                  {selectedCxo.title} {selectedCxo.firstName} {selectedCxo.middleName || ""} {selectedCxo.lastName || ""}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCxo(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Organization</p>
                <p className="font-semibold text-slate-100">{selectedCxo.organization}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Designation</p>
                <p className="font-semibold text-[#C9A227]">{selectedCxo.designation}</p>
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
                  href={selectedCxo.linkedin?.startsWith("http") ? selectedCxo.linkedin : "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#C9A227] hover:underline truncate block"
                >
                  {selectedCxo.linkedin}
                </a>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400 font-semibold mb-0.5">Would like to contribute via:</p>
                <p className="text-slate-200">{selectedCxo.contributeVia}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400 font-semibold mb-0.5">Strategic Areas of Interest:</p>
                <p className="text-slate-200">{selectedCxo.strategicInterests}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400 font-semibold mb-0.5">Preferred Mode of Engagement:</p>
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
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600/20 text-sky-300 text-xs font-semibold hover:bg-sky-600/30 cursor-pointer"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => handleUpdateCxoStatus(selectedCxo.id, "Approved")}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 cursor-pointer"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SELECTED PARTNER APPLICATION MODAL
      ======================================================== */}
      {selectedPartnerApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A1228] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A227]">
                  Partner Collaboration Application
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-100 mt-1">
                  {selectedPartnerApp.title} {selectedPartnerApp.firstName} {selectedPartnerApp.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPartnerApp(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Organization</p>
                <p className="font-semibold text-white">{selectedPartnerApp.organization}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Designation</p>
                <p className="font-semibold text-[#C9A227]">{selectedPartnerApp.designation}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Email</p>
                <p className="font-semibold text-white">{selectedPartnerApp.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Mobile</p>
                <p className="font-semibold text-white">{selectedPartnerApp.mobile}</p>
              </div>
            </div>

            {selectedPartnerApp.preferredEngagementTypes && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-1.5">
                <p className="text-slate-400 font-semibold">Preferred Engagement Types:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPartnerApp.preferredEngagementTypes.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Submitted: {formatDate(selectedPartnerApp.submittedAt)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdatePartnerAppStatus(selectedPartnerApp.id, "Contacted")}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600/20 text-sky-300 text-xs font-semibold cursor-pointer"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => handleUpdatePartnerAppStatus(selectedPartnerApp.id, "Approved")}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Approve Partner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SELECTED CONTACT MESSAGE MODAL & REPLY
      ======================================================== */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A1228] border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
                  Contact Us Inbound Message
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-100 mt-1">
                  {selectedContact.title} {selectedContact.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Email Address</p>
                <p className="font-semibold text-white">{selectedContact.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-slate-400">Phone</p>
                <p className="font-semibold text-white">{selectedContact.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-xs space-y-1">
              <p className="text-slate-400 font-semibold">Message Content:</p>
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
            </div>

            {/* Quick Reply Form */}
            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-semibold">Quick Reply Note / Resolution</label>
              <textarea
                rows={2}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Compose executive response..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-100 resize-none focus:outline-none focus:border-[#C9A227]"
              />
              {replySuccess && (
                <p className="text-xs text-emerald-400 font-semibold">✓ Reply sent &amp; inquiry marked as Replied!</p>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Received: {formatDate(selectedContact.submittedAt)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateContactStatus(selectedContact.id, "Replied")}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Mark Replied
                </button>
                <button
                  onClick={() => handleSendReply(selectedContact.id)}
                  className="px-4 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold uppercase tracking-wider text-xs cursor-pointer shadow-lg"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
