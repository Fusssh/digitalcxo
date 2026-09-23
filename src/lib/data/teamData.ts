import { TeamMember } from "@/types";

export const leadershipTeam: TeamMember[] = [
  {
    name: "Rohit Kachroo",
    role: "Chief Strategy Officer",
    slug: "rohit-kachroo",
    image: "/assests/rohit-1.webp",
    bio: "Accomplished executive with extensive global leadership experience steering business transformation, digital innovation, and enterprise strategic planning across Fortune 500 conglomerates.",
    sectors: ["Financial Services", "ITES", "Enterprise Consulting"],
    experience: "25+ Years Executive Experience",
    linkedin: "https://linkedin.com/in/rohitkachroo",
    quote: "Empowering boardroom influencers to lead high-impact strategic shifts in India's digital epoch."
  },
  {
    name: "Kuldeep Koul",
    role: "Chief Digital Officer, Namtech",
    slug: "kuldeep-koul",
    image: "/assests/kuldeep.webp",
    bio: "Pioneering technology strategist and digital architect heading large-scale digital initiatives, industrial automation, cybersecurity infrastructure, and technology modernization programs.",
    sectors: ["ITES", "Manufacturing", "Defense & Aerospace"],
    experience: "24+ Years Technology Leadership",
    linkedin: "https://linkedin.com/in/kuldeepkoul",
    quote: "Building resilient enterprise architectures capable of defending national and corporate cyber infrastructure."
  },
  {
    name: "Priya Dar",
    role: "Advisor",
    slug: "priya-dar",
    image: "/assests/priya.png",
    bio: "Eminent enterprise technology leader and board advisor championing digital parity, transformational IT architectures, next-generation data solutions, and women executive mentorship.",
    sectors: ["Telecom", "Financial Services", "HealthTech"],
    experience: "20+ Years Executive Governance",
    linkedin: "https://linkedin.com/in/priyadar",
    quote: "Fostering inclusive, high-trust leadership ecosystems to accelerate sustainable enterprise growth."
  },
  {
    name: "Sujoy Brahmachari",
    role: "Advisor",
    slug: "sujoy-brahmachari",
    image: "/assests/dfgd.png",
    bio: "Distinguished technology and cybersecurity strategist with a track record of spearheading mission-critical enterprise transformations, digital infrastructure defense, and IT governance.",
    sectors: ["Manufacturing", "Aerospace & Defense", "ITES"],
    experience: "26+ Years Strategic Leadership",
    linkedin: "https://linkedin.com/in/sujoybrahmachari",
    quote: "Aligning boardroom strategy with sovereign technological resilience and crisis preparedness."
  },
  {
    name: "Amit Awasthi",
    role: "Advisor",
    slug: "amit-awasthi",
    image: "/assests/amit.png",
    bio: "Veteran digital advisor and innovation driver working across public and private sector enterprises to deploy cutting-edge AI, cloud transformation, and collaborative industry pods.",
    sectors: ["Consulting", "Enterprise IT", "BFSI"],
    experience: "23+ Years Digital Transformation",
    linkedin: "https://linkedin.com/in/amitawasthi",
    quote: "Catalyzing collective CXO intelligence to co-create solutions for national enterprise challenges."
  }
];

export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return leadershipTeam.find((member) => member.slug === slug);
}

