import { ChapterInfo } from "@/types";

export const chaptersData: ChapterInfo[] = [
  {
    id: "delhi-ncr",
    name: "Delhi NCR",
    region: "Northern Hub",
    lead: "Regional Chapter Advisory Council",
    memberCount: "280+ CXO Members",
    meetingFrequency: "Monthly Executive Breakfasts & Quarterly Roundtables",
    description: "Centering national policy engagement, central enterprise governance, and public-private digital collaborations across New Delhi, Gurugram, and Noida."
  },
  {
    id: "mumbai",
    name: "Mumbai",
    region: "Western Financial Hub",
    lead: "BFSI & Enterprise Digital Committee",
    memberCount: "340+ CXO Members",
    meetingFrequency: "Bi-monthly Strategy Dinners & Innovation Showcases",
    description: "Bringing together leadership from banking institutions, financial powerhouses, media conglomerates, and industrial conglomerates across the financial capital."
  },
  {
    id: "bangalore",
    name: "Bangalore",
    region: "Southern Technology Hub",
    lead: "DeepTech & Cloud Transformation Pod",
    memberCount: "420+ CXO Members",
    meetingFrequency: "Monthly Peer Pods & Tech Demo Summits",
    description: "Uniting tech titans, global capability centers (GCCs), hyper-scale innovators, and venture-backed enterprise leaders in India's silicon capital."
  },
  {
    id: "chennai",
    name: "Chennai",
    region: "Southern Industrial & IT Hub",
    lead: "Industrial IoT & Automotive Tech Forum",
    memberCount: "210+ CXO Members",
    meetingFrequency: "Quarterly Sector Dialogues & Plant Tech Tours",
    description: "Fostering collaboration across automotive pioneers, healthcare networks, SaaS unicorns, and heavy industrial enterprises across Tamil Nadu."
  }
];

export function getChapterById(id: string): ChapterInfo | undefined {
  return chaptersData.find((c) => c.id === id);
}
