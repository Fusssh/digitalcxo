import fs from "fs";
import path from "path";
import { 
  CxoMemberSubmission, 
  PartnerSubmission, 
  ContactSubmission, 
  PodcastEpisode, 
  EventItem,
  TeamMember,
  InitiativeItem,
  SocialInitiative,
  EventHighlight,
  PartnerItem
} from "@/types";
import { leadershipTeam } from "./data/teamData";
import { initiativesData } from "./data/initiativesData";
import { initialPodcastsData } from "./data/podcastData";
import { initialEventsData } from "./data/eventsData";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

export const initialSocialInitiatives: SocialInitiative[] = [
  {
    id: "si-1",
    tag: "Executive Vitality",
    title: "CXO WELLNESS RETREATS",
    description:
      "Hosting immersive wellness experiences focused on rejuvenation, relaxation and stress management to support leadership vitality.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
    link: "/initiatives",
    date: "Annual Program"
  },
  {
    id: "si-2",
    tag: "Preventive Care",
    title: "HEALTH AWARENESS & SCREENING CAMPS",
    description:
      "Organizing accessible health check-ups and awareness programs to promote preventive care within the CXO community and beyond.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
    link: "/initiatives",
    date: "Quarterly Series"
  },
  {
    id: "si-3",
    tag: "Philanthropic Pledge",
    title: "FOUNDERS' PERSONAL GIVING COMMITMENT",
    description:
      "Our founders personally pledge 3% of their annual profits to support meaningful social causes and contribute to community development.",
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop",
    link: "/initiatives",
    date: "Ongoing Pledge"
  }
];

export const initialEventHighlights: EventHighlight[] = [
  {
    id: "eh-1",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    posterUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    tag: "Flagship Conclave",
    edition: "2026 Annual Conclave",
    title: "Digital CXOS National Conclave — The Sovereign AI Era",
    duration: "03:45"
  },
  {
    id: "eh-2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    posterUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    tag: "Security Summit",
    edition: "Cyber Defense Conclave",
    title: "Enterprise Cyber Sovereign Defense & Crisis Simulation",
    duration: "04:12"
  },
  {
    id: "eh-3",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
    tag: "Boardroom Roundtable",
    edition: "Executive Summit",
    title: "Digital Transformation & DPDP Boardroom Accord",
    duration: "02:58"
  }
];

export const initialPartnersCatalog: PartnerItem[] = [
  {
    id: "partner-item-1",
    name: "CloudScale India Inc",
    tier: "Strategic Partner",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
    websiteUrl: "https://cloudscale.io",
    status: "Active",
    description: "Cloud sovereign migration & enterprise zero-trust alliance."
  },
  {
    id: "partner-item-2",
    name: "Apex Global Technologies",
    tier: "Technology Partner",
    logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=300&auto=format&fit=crop",
    websiteUrl: "https://apextech.in",
    status: "Active",
    description: "Enterprise cyber resilience and generative AI labs."
  },
  {
    id: "partner-item-3",
    name: "MediVision Health Systems",
    tier: "Knowledge Partner",
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop",
    websiteUrl: "https://medivisionhealth.com",
    status: "Active",
    description: "Healthcare IT standards & DPDP compliance guidance."
  },
  {
    id: "partner-item-4",
    name: "Namtech Industrial Digital",
    tier: "Strategic Partner",
    logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop",
    websiteUrl: "https://namtech.ac.in",
    status: "Active",
    description: "Industrial 4.0 cybersecurity research & workforce enablement."
  }
];

interface DatabaseSchema {
  cxoMembers: CxoMemberSubmission[];
  partnerMembers: PartnerSubmission[];
  contacts: ContactSubmission[];
  podcasts: PodcastEpisode[];
  events: EventItem[];
  teamMembers: TeamMember[];
  initiatives: InitiativeItem[];
  socialInitiatives: SocialInitiative[];
  eventHighlights: EventHighlight[];
  partners: PartnerItem[];
}

const defaultInitialData: DatabaseSchema = {
  cxoMembers: [
    {
      id: "cxo-001",
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "Approved",
      title: "Mr.",
      firstName: "Arun",
      lastName: "Verma",
      officialEmail: "arun.verma@apextech.in",
      mobile: "+91 98765 43210",
      organization: "Apex Global Technologies",
      designation: "Chief Information Officer (CIO)",
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
      linkedin: "https://linkedin.com/in/arunverma-cio",
      organizationWebsite: "https://apextech.in",
      boardExperience: "Yes, Active Board Advisor",
      leadershipExperience: "18",
      contributeVia: "Speaking at Roundtables, Mentorship Pods",
      strategicInterests: "Cloud Migration, Enterprise Cybersecurity, Generative AI",
      industry: "Information Technology & Services",
      preferredModeOfEngagement: "Physical Roundtables & Conclaves",
      howDidYouHear: "Invited by Existing CXO Member",
      otherCxoNetworks: "None",
      termsConsent: true,
      accuracyConsent: true
    },
    {
      id: "cxo-002",
      submittedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      status: "Pending Review",
      title: "Dr.",
      firstName: "Sunita",
      lastName: "Rao",
      officialEmail: "s.rao@medivisionhealth.com",
      mobile: "+91 99887 76655",
      organization: "MediVision Health Systems",
      designation: "Chief Technology Officer (CTO)",
      country: "India",
      state: "Karnataka",
      city: "Bengaluru",
      linkedin: "https://linkedin.com/in/drsunitarao",
      organizationWebsite: "https://medivisionhealth.com",
      boardExperience: "Yes",
      leadershipExperience: "15",
      contributeVia: "AI Literacy Workshops, Healthcare Tech Forums",
      strategicInterests: "HealthTech AI, DPDP Compliance, Critical Data Security",
      industry: "Healthcare & Life Sciences",
      preferredModeOfEngagement: "Hybrid (In-person and Virtual)",
      howDidYouHear: "LinkedIn",
      termsConsent: true,
      accuracyConsent: true
    }
  ],
  partnerMembers: [
    {
      id: "partner-001",
      submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: "Pending Review",
      title: "Ms.",
      firstName: "Ritu",
      lastName: "Kapoor",
      email: "ritu.kapoor@cloudscale.io",
      mobile: "+91 91234 56789",
      organization: "CloudScale India Inc",
      designation: "VP Strategic Alliances",
      country: "India",
      state: "Delhi NCR",
      city: "Gurugram",
      presenceInIndia: "Yes",
      preferredEngagementTypes: [
        "Annual Strategic Sponsorship",
        "Executive Roundtable Series",
        "Podcast Thought Leadership"
      ],
      professionalConductConsent: true,
      privacyConsent: true
    }
  ],
  contacts: [
    {
      id: "contact-001",
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      title: "Mr.",
      name: "Sandeep Khurana",
      email: "sandeep.k@enterprisepath.org",
      phone: "+91 97112 33445",
      message: "We would like to explore hosting an executive roundtable for BFSI CISOs at the upcoming Mumbai summit.",
      status: "Unread"
    }
  ],
  podcasts: initialPodcastsData,
  events: initialEventsData,
  teamMembers: leadershipTeam.map((m, idx) => ({ ...m, id: m.id || `lead-${idx + 1}` })),
  initiatives: initiativesData,
  socialInitiatives: initialSocialInitiatives,
  eventHighlights: initialEventHighlights,
  partners: initialPartnersCatalog
};

function ensureDbFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultInitialData, null, 2), "utf-8");
      return defaultInitialData;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    
    // Ensure all keys exist
    const merged: DatabaseSchema = {
      cxoMembers: parsed.cxoMembers || defaultInitialData.cxoMembers,
      partnerMembers: parsed.partnerMembers || defaultInitialData.partnerMembers,
      contacts: parsed.contacts || defaultInitialData.contacts,
      podcasts: parsed.podcasts || defaultInitialData.podcasts,
      events: parsed.events || defaultInitialData.events,
      teamMembers: parsed.teamMembers || defaultInitialData.teamMembers,
      initiatives: parsed.initiatives || defaultInitialData.initiatives,
      socialInitiatives: parsed.socialInitiatives || defaultInitialData.socialInitiatives,
      eventHighlights: parsed.eventHighlights || defaultInitialData.eventHighlights,
      partners: parsed.partners || defaultInitialData.partners
    };
    return merged;
  } catch {
    return defaultInitialData;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write db.json:", err);
  }
}

// In-memory fallback if fs is unavailable
let memoryDb: DatabaseSchema = ensureDbFile();

export const db = {
  // CXO Members
  getCxoMembers: (): CxoMemberSubmission[] => {
    memoryDb = ensureDbFile();
    return memoryDb.cxoMembers || [];
  },
  addCxoMember: (member: Omit<CxoMemberSubmission, "id" | "submittedAt" | "status">): CxoMemberSubmission => {
    memoryDb = ensureDbFile();
    const newMember: CxoMemberSubmission = {
      ...member,
      id: `cxo-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "Pending Review"
    };
    memoryDb.cxoMembers = [newMember, ...(memoryDb.cxoMembers || [])];
    writeDb(memoryDb);
    return newMember;
  },
  updateCxoStatus: (id: string, status: CxoMemberSubmission["status"]): boolean => {
    memoryDb = ensureDbFile();
    const idx = memoryDb.cxoMembers.findIndex((m) => m.id === id);
    if (idx >= 0) {
      memoryDb.cxoMembers[idx].status = status;
      writeDb(memoryDb);
      return true;
    }
    return false;
  },
  deleteCxoMember: (id: string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.cxoMembers = (memoryDb.cxoMembers || []).filter((m) => m.id !== id);
    writeDb(memoryDb);
    return true;
  },

  // Partner Applications
  getPartnerMembers: (): PartnerSubmission[] => {
    memoryDb = ensureDbFile();
    return memoryDb.partnerMembers || [];
  },
  addPartnerMember: (partner: Omit<PartnerSubmission, "id" | "submittedAt" | "status">): PartnerSubmission => {
    memoryDb = ensureDbFile();
    const newPartner: PartnerSubmission = {
      ...partner,
      id: `partner-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "Pending Review"
    };
    memoryDb.partnerMembers = [newPartner, ...(memoryDb.partnerMembers || [])];
    writeDb(memoryDb);
    return newPartner;
  },
  updatePartnerStatus: (id: string, status: PartnerSubmission["status"]): boolean => {
    memoryDb = ensureDbFile();
    const idx = memoryDb.partnerMembers.findIndex((p) => p.id === id);
    if (idx >= 0) {
      memoryDb.partnerMembers[idx].status = status;
      writeDb(memoryDb);
      return true;
    }
    return false;
  },
  deletePartnerMember: (id: string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.partnerMembers = (memoryDb.partnerMembers || []).filter((p) => p.id !== id);
    writeDb(memoryDb);
    return true;
  },

  // Contacts
  getContacts: (): ContactSubmission[] => {
    memoryDb = ensureDbFile();
    return memoryDb.contacts || [];
  },
  addContact: (contact: Omit<ContactSubmission, "id" | "submittedAt" | "status">): ContactSubmission => {
    memoryDb = ensureDbFile();
    const newContact: ContactSubmission = {
      ...contact,
      id: `msg-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "Unread"
    };
    memoryDb.contacts = [newContact, ...(memoryDb.contacts || [])];
    writeDb(memoryDb);
    return newContact;
  },
  updateContactStatus: (id: string, status: ContactSubmission["status"]): boolean => {
    memoryDb = ensureDbFile();
    const idx = memoryDb.contacts.findIndex((c) => c.id === id);
    if (idx >= 0) {
      memoryDb.contacts[idx].status = status;
      writeDb(memoryDb);
      return true;
    }
    return false;
  },
  deleteContact: (id: string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.contacts = (memoryDb.contacts || []).filter((c) => c.id !== id);
    writeDb(memoryDb);
    return true;
  },

  // Podcasts
  getPodcasts: (): PodcastEpisode[] => {
    memoryDb = ensureDbFile();
    return memoryDb.podcasts || initialPodcastsData;
  },
  addPodcast: (podcast: Omit<PodcastEpisode, "id">): PodcastEpisode => {
    memoryDb = ensureDbFile();
    const newPodcast: PodcastEpisode = {
      ...podcast,
      id: `pod-${Date.now()}`
    };
    memoryDb.podcasts = [newPodcast, ...(memoryDb.podcasts || [])];
    writeDb(memoryDb);
    return newPodcast;
  },
  updatePodcast: (id: string, updated: Partial<PodcastEpisode>): PodcastEpisode | null => {
    memoryDb = ensureDbFile();
    const idx = memoryDb.podcasts.findIndex((p) => p.id === id);
    if (idx >= 0) {
      memoryDb.podcasts[idx] = { ...memoryDb.podcasts[idx], ...updated };
      writeDb(memoryDb);
      return memoryDb.podcasts[idx];
    }
    return null;
  },
  deletePodcast: (id: string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.podcasts = (memoryDb.podcasts || []).filter((p) => p.id !== id);
    writeDb(memoryDb);
    return true;
  },

  // Events
  getEvents: (): EventItem[] => {
    memoryDb = ensureDbFile();
    return memoryDb.events || initialEventsData;
  },
  addEvent: (event: Omit<EventItem, "id">): EventItem => {
    memoryDb = ensureDbFile();
    const newEvent: EventItem = {
      ...event,
      id: `evt-${Date.now()}`
    };
    memoryDb.events = [newEvent, ...(memoryDb.events || [])];
    writeDb(memoryDb);
    return newEvent;
  },
  updateEvent: (id: string, updated: Partial<EventItem>): EventItem | null => {
    memoryDb = ensureDbFile();
    const idx = memoryDb.events.findIndex((e) => e.id === id);
    if (idx >= 0) {
      memoryDb.events[idx] = { ...memoryDb.events[idx], ...updated };
      writeDb(memoryDb);
      return memoryDb.events[idx];
    }
    return null;
  },
  deleteEvent: (id: string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.events = (memoryDb.events || []).filter((e) => e.id !== id);
    writeDb(memoryDb);
    return true;
  },

  // 1) Leadership Team (Req 2: Meet Our Leadership Team)
  getTeamMembers: (): TeamMember[] => {
    memoryDb = ensureDbFile();
    return memoryDb.teamMembers || [];
  },
  addTeamMember: (member: Omit<TeamMember, "id"> & { id?: string }): TeamMember => {
    memoryDb = ensureDbFile();
    const id = member.id || `lead-${Date.now()}`;
    const slug = member.slug || member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newMember: TeamMember = {
      ...member,
      id,
      slug
    };
    memoryDb.teamMembers = [newMember, ...(memoryDb.teamMembers || [])];
    writeDb(memoryDb);
    return newMember;
  },
  updateTeamMember: (id: string, updated: Partial<TeamMember>): TeamMember | null => {
    memoryDb = ensureDbFile();
    const idx = memoryDb.teamMembers.findIndex((m) => m.id === id || m.slug === id);
    if (idx >= 0) {
      memoryDb.teamMembers[idx] = { ...memoryDb.teamMembers[idx], ...updated };
      writeDb(memoryDb);
      return memoryDb.teamMembers[idx];
    }
    return null;
  },
  deleteTeamMember: (id: string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.teamMembers = (memoryDb.teamMembers || []).filter((m) => m.id !== id && m.slug !== id);
    writeDb(memoryDb);
    return true;
  },

  // 2) Enrichment & Contribution Initiatives (Req 1)
  getInitiatives: (): InitiativeItem[] => {
    memoryDb = ensureDbFile();
    return memoryDb.initiatives || [];
  },
  addInitiative: (initiative: Omit<InitiativeItem, "id"> & { id?: number | string }): InitiativeItem => {
    memoryDb = ensureDbFile();
    const id = initiative.id || Date.now();
    const newInit: InitiativeItem = {
      ...initiative,
      id
    };
    memoryDb.initiatives = [newInit, ...(memoryDb.initiatives || [])];
    writeDb(memoryDb);
    return newInit;
  },
  updateInitiative: (id: number | string, updated: Partial<InitiativeItem>): InitiativeItem | null => {
    memoryDb = ensureDbFile();
    const idx = memoryDb.initiatives.findIndex((i) => String(i.id) === String(id));
    if (idx >= 0) {
      memoryDb.initiatives[idx] = { ...memoryDb.initiatives[idx], ...updated };
      writeDb(memoryDb);
      return memoryDb.initiatives[idx];
    }
    return null;
  },
  deleteInitiative: (id: number | string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.initiatives = (memoryDb.initiatives || []).filter((i) => String(i.id) !== String(id));
    writeDb(memoryDb);
    return true;
  },

  // 3) Our Social Initiatives (Req 3: Images & details from admin)
  getSocialInitiatives: (): SocialInitiative[] => {
    memoryDb = ensureDbFile();
    return memoryDb.socialInitiatives || [];
  },
  addSocialInitiative: (item: Omit<SocialInitiative, "id">): SocialInitiative => {
    memoryDb = ensureDbFile();
    const newSocial: SocialInitiative = {
      ...item,
      id: `si-${Date.now()}`
    };
    memoryDb.socialInitiatives = [newSocial, ...(memoryDb.socialInitiatives || [])];
    writeDb(memoryDb);
    return newSocial;
  },
  updateSocialInitiative: (id: string, updated: Partial<SocialInitiative>): SocialInitiative | null => {
    memoryDb = ensureDbFile();
    const idx = memoryDb.socialInitiatives.findIndex((s) => s.id === id);
    if (idx >= 0) {
      memoryDb.socialInitiatives[idx] = { ...memoryDb.socialInitiatives[idx], ...updated };
      writeDb(memoryDb);
      return memoryDb.socialInitiatives[idx];
    }
    return null;
  },
  deleteSocialInitiative: (id: string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.socialInitiatives = (memoryDb.socialInitiatives || []).filter((s) => s.id !== id);
    writeDb(memoryDb);
    return true;
  },

  // 4) Event Highlights (Req 4: Mainly MP4 videos from admin)
  getEventHighlights: (): EventHighlight[] => {
    memoryDb = ensureDbFile();
    return memoryDb.eventHighlights || [];
  },
  addEventHighlight: (highlight: Omit<EventHighlight, "id">): EventHighlight => {
    memoryDb = ensureDbFile();
    const newHighlight: EventHighlight = {
      ...highlight,
      id: `eh-${Date.now()}`
    };
    memoryDb.eventHighlights = [newHighlight, ...(memoryDb.eventHighlights || [])];
    writeDb(memoryDb);
    return newHighlight;
  },
  updateEventHighlight: (id: string, updated: Partial<EventHighlight>): EventHighlight | null => {
    memoryDb = ensureDbFile();
    const idx = memoryDb.eventHighlights.findIndex((h) => h.id === id);
    if (idx >= 0) {
      memoryDb.eventHighlights[idx] = { ...memoryDb.eventHighlights[idx], ...updated };
      writeDb(memoryDb);
      return memoryDb.eventHighlights[idx];
    }
    return null;
  },
  deleteEventHighlight: (id: string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.eventHighlights = (memoryDb.eventHighlights || []).filter((h) => h.id !== id);
    writeDb(memoryDb);
    return true;
  },

  // 7) Partners Catalog (Req 7: Partners list)
  getPartners: (): PartnerItem[] => {
    memoryDb = ensureDbFile();
    return memoryDb.partners || [];
  },
  addPartner: (partner: Omit<PartnerItem, "id">): PartnerItem => {
    memoryDb = ensureDbFile();
    const newPartner: PartnerItem = {
      ...partner,
      id: `partner-${Date.now()}`
    };
    memoryDb.partners = [newPartner, ...(memoryDb.partners || [])];
    writeDb(memoryDb);
    return newPartner;
  },
  updatePartner: (id: string, updated: Partial<PartnerItem>): PartnerItem | null => {
    memoryDb = ensureDbFile();
    const idx = memoryDb.partners.findIndex((p) => p.id === id);
    if (idx >= 0) {
      memoryDb.partners[idx] = { ...memoryDb.partners[idx], ...updated };
      writeDb(memoryDb);
      return memoryDb.partners[idx];
    }
    return null;
  },
  deletePartner: (id: string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.partners = (memoryDb.partners || []).filter((p) => p.id !== id);
    writeDb(memoryDb);
    return true;
  }
};
