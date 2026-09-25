export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  slug: string;
  bio: string;
  sectors: string[];
  linkedin?: string;
  image?: string;
  experience?: string;
  quote?: string;
  featured?: boolean;
}

export interface InitiativeItem {
  id: number | string;
  title: string;
  description: string;
  category: "Mentorship" | "Governance & Policy" | "Innovation & Labs" | "Community & Outreach" | string;
  iconName: string;
}

export interface SocialInitiative {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  link: string;
  date?: string;
}

export interface EventHighlight {
  id: string;
  videoUrl: string;
  posterUrl: string;
  tag: string;
  edition: string;
  title: string;
  duration?: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  tier: "Strategic Partner" | "Technology Partner" | "Knowledge Partner" | "Media Partner" | string;
  logoUrl: string;
  websiteUrl: string;
  status: "Active" | "Pending" | "Inactive";
  description?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Content Director" | "Community Lead";
  avatar?: string;
  token?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  venue?: string;
  tagline: string;
  type: "upcoming" | "past";
  videoType?: "youtube" | "mp4";
  videoUrl?: string;
  thumbnailUrl?: string;
  attendeesCount?: string;
  description?: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  subtitle: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl?: string;
  duration?: string;
  date?: string;
  guests: {
    name: string;
    role: string;
    organization: string;
  }[];
  overview?: string;
}

export interface ChapterInfo {
  id: string;
  name: string;
  lead: string;
  memberCount: string;
  description: string;
  meetingFrequency: string;
  region: string;
}

export interface CxoMemberSubmission {
  id: string;
  submittedAt: string;
  status: "Pending Review" | "Approved" | "Contacted" | "Declined";
  title: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  officialEmail: string;
  mobile: string;
  organization: string;
  designation: string;
  country: string;
  state: string;
  city: string;
  linkedin: string;
  organizationWebsite?: string;
  boardExperience?: string;
  leadershipExperience?: string;
  contributeVia: string;
  strategicInterests: string;
  industry: string;
  preferredModeOfEngagement: string;
  howDidYouHear: string;
  otherCxoNetworks?: string;
  termsConsent: boolean;
  accuracyConsent: boolean;
}

export interface PartnerSubmission {
  id: string;
  submittedAt: string;
  status: "Pending Review" | "Approved" | "Contacted" | "Declined";
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  organization: string;
  designation: string;
  country: string;
  state: string;
  city: string;
  presenceInIndia: string;
  preferredEngagementTypes: string[];
  professionalConductConsent: boolean;
  privacyConsent: boolean;
}

export interface ContactSubmission {
  id: string;
  submittedAt: string;
  title: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "Unread" | "Replied" | "Archived";
}
