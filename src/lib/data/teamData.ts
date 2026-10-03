import { TeamMember } from "@/types";

export const leadershipTeam: TeamMember[] = [
  {
    name: "Rohit Kachroo",
    role: "Chief Strategy Officer",
    slug: "rohit-kachroo",
    image: "/assests/rohit-1.webp",
    bio: "A Cybersecurity expert and industry evangelist. Rohit has worked on several critical projects with Fortune 500 companies including some of the world’s top financial institutions during his tenure. Last role was Group CISO at a prominent Financial Indian conglomerate. He is now a first-generation entrepreneur heading a growing Cybersecurity and IT startup.\n\nHe worked closely with key Indian regulators across sectors, contributing to compliance, governance and strategic alignment while also engaging with global regulatory frameworks. Formulated and designed organizational policies and actively participated in invited discussions on key industry policy topics. Recipient of several national awards recognizing his contributions to Cybersecurity and Leadership. A passionate writer and advocate, he regularly shares insights on Cybersecurity along with cultural and social issues drawn from personal experiences.\n\nHe brings both deep technical knowledge and real-world industry experience, making him a respected voice in the cybersecurity space. Rohit is known for turning complex challenges into practical, secure solutions that work at scale. Now as an entrepreneur, he’s focused on building systems that not only protect but also enable India’s digital growth story.\n\nDeeply committed to “Naya Bharat,” he mentors professionals and promotes ethical digital practices. He remains dedicated to shaping a secure, resilient and self-reliant digital India. Inspired by Kabir’s words: “When I was born, the world laughed and I cried; may my life be such that when I leave, I will smile and the world will weep.”",
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
    bio: "Dynamic Technology Leader | Digital Transformation Architect | CXO Advisor with nearly 3 decades of technology leadership. Kuldeep stands at the forefront of global digital transformation. A dynamic and future-focused technologist, he has architected enterprise-wide innovation across Defense, Aerospace, Manufacturing, Space and Ground Transportation Systems—industries where precision, resilience and scale are paramount.\n\nAs a CXO, managed operations across Africa, Eurasia and India for a €20B French multinational spanning 68 countries. He has consistently delivered transformative outcomes. He is renowned for building high-impact Global Capability Centers (GCCs) and Centers of Excellence (CoEs), while designing robust IT infrastructure and Cybersecurity frameworks that safeguard mission-critical systems and enable strategic agility. Spearheaded multi-domain initiatives that align cutting-edge technology with business imperatives, driving measurable ROI and operational excellence. Cultivated high-performing, cross-functional teams and fostered cultures of innovation, accountability and continuous improvement.\n\nKuldeep’s strategic foresight and ability to anticipate emerging trends have positioned organizations ahead of the curve on digital front. His leadership blends advanced technologies, agile methodologies and human-centered design to build resilient, scalable and sustainable enterprise. Trusted partner to executive leadership, guiding governance, scalability and innovation across complex global ecosystems. Contributing meaningfully to the vision of Viksit Bharat.",
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
    bio: "Highly accomplished Senior Technology Executive and Chief Information Officer (CIO) at Valvoline Cummins Pvt Ltd with a proven track record of leading complex technology initiatives and delivering exceptional business outcomes. Bringing over 25 years of experience in enterprise strategy, budget management, customer-facing digital solution mapping, application management and operations across FMCG, telecommunications, retail and financial services.\n\nRecognized for strong leadership, people management and project execution capabilities, consistently delivering large-scale transformation programs that drive innovation, strengthen governance and accelerate business growth through technology and digital transformation.",
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
    bio: "A distinguished technocrat, technology evangelist and Information Security expert with 34+ years of experience in technology leadership, information security, infrastructure and digital transformation. His professional journey spans strategic IT planning, solution design, infrastructure and network management, applications, automation data centre operations, cybersecurityand large-scale project and service management across global environments.Over more than three decades, he has led complex technology and security initiatives, managing large, geographically distributed teams and multiple programs simultaneously. His strength lies in bringing together business strategy, technology, securityand operational excellence to create solutions that are practical, scalableand aligned with organizational objectives.\n\nThroughout his career, he has worked closely with senior management to define IT strategies, develop technology roadmaps and drive their execution from planning and design through implementation and delivery. He has played a key role in launching and managing new technology initiatives, transforming IT operations, improving service delivery and strengthening the overall technology and security posture of organizations.",
    sectors: ["Manufacturing", "Aerospace & Defense", "ITES"],
    experience: "34+ Years Technology Leadership",
    linkedin: "https://linkedin.com/in/sujoybrahmachari",
    quote: "Aligning boardroom strategy with sovereign technological resilience and crisis preparedness."
  },
  {
    name: "Amit Awasthi",
    role: "Advisor",
    slug: "amit-awasthi",
    image: "/assests/amit.png",
    bio: "Highly accomplished Information Security Executive and Head of Information Security at Yamuna International Airport Private Limited (Noida International Airport), with over 18 years of experience spanning consulting, production, enterprise technology and aviation, including more than a decade of specialized expertise in cybersecurity.\n\nHis career across consulting and industry has given him a broad understanding of business operations, technology transformation and cybersecurity, enabling him to align security strategies with organizational priorities and deliver sustainable business outcomes. He has led strategic technology and cybersecurity transformation initiatives across complex and dynamic environments, with a focus on strengthening governance, resilience and risk management.\n\nHis experience working across diverse organizations and with senior stakeholders has strengthened his ability to translate complex technology and security challenges into practical, business-focused strategies. Recognized for strategic leadership, stakeholder management and execution, he brings a pragmatic approach to cybersecurity—balancing security, business needs and innovation.\n\nHe is particularly passionate about protecting critical infrastructure, enabling secure digital transformation and building resilient organizations that are prepared to navigate an evolving threat landscape.",
    sectors: ["Consulting", "Enterprise IT", "BFSI"],
    experience: "23+ Years Digital Transformation",
    linkedin: "https://linkedin.com/in/amitawasthi",
    quote: "Catalyzing collective CXO intelligence to co-create solutions for national enterprise challenges."
  }
];

export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  const normalized = slug.toLowerCase().trim();
  return leadershipTeam.find(
    (member) =>
      member.slug.toLowerCase() === normalized ||
      member.id?.toLowerCase() === normalized ||
      member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalized
  );
}

