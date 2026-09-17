import { PodcastEpisode } from "@/types";

export const initialPodcastsData: PodcastEpisode[] = [
  {
    id: "podcast-1",
    title: "AI, Cybersecurity & Digital Trust",
    subtitle: "AI Changes Everything",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
    duration: "48 mins",
    date: "August 2026",
    guests: [
      {
        name: "Rajiv Nandwani",
        role: "Global Cyber Security Director",
        organization: "BCG"
      },
      {
        name: "Anush Tewari",
        role: "Chief Cybersecurity Advisor, India & South Asia",
        organization: "Microsoft India"
      }
    ],
    overview: "A comprehensive executive exploration of how artificial intelligence is altering both the threat landscape and cyber defensive posture across global enterprises."
  },
  {
    id: "podcast-2",
    title: "AI, Cyber Law & Data Protection",
    subtitle: "Regulatory Frameworks & Boardroom Accountability",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
    duration: "52 mins",
    date: "September 2026",
    guests: [
      {
        name: "Rajiv Nandwani",
        role: "Global Cyber Security Director",
        organization: "BCG"
      },
      {
        name: "(Dr.) Karnnika A Seth",
        role: "Cyber Lawyer",
        organization: "Supreme Court of India"
      }
    ],
    overview: "Delving into India's Digital Personal Data Protection (DPDP) Act, legal liability for corporate directors during breaches, and navigating sovereign AI governance."
  }
];
