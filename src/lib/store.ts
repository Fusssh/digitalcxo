import fs from "fs";
import path from "path";
import { 
  CxoMemberSubmission, 
  PartnerSubmission, 
  ContactSubmission, 
  PodcastEpisode, 
  EventItem 
} from "@/types";
import { initialPodcastsData } from "./data/podcastData";
import { initialEventsData } from "./data/eventsData";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

interface DatabaseSchema {
  cxoMembers: CxoMemberSubmission[];
  partnerMembers: PartnerSubmission[];
  contacts: ContactSubmission[];
  podcasts: PodcastEpisode[];
  events: EventItem[];
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
  events: initialEventsData
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
    return JSON.parse(raw);
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
  // Members
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

  // Partners
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
  deleteEvent: (id: string): boolean => {
    memoryDb = ensureDbFile();
    memoryDb.events = (memoryDb.events || []).filter((e) => e.id !== id);
    writeDb(memoryDb);
    return true;
  }
};
