import { MetadataRoute } from "next";
import { leadershipTeam } from "@/lib/data/teamData";
import { chaptersData } from "@/lib/data/chaptersData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.digitalcxos.com";

  const staticRoutes = [
    "",
    "/about",
    "/initiatives",
    "/events",
    "/podcast",
    "/chapters",
    "/membership2",
    "/partnership2",
    "/contact",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const teamRoutes = leadershipTeam.map((member) => ({
    url: `${baseUrl}/team/${member.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const chapterRoutes = chaptersData.map((c) => ({
    url: `${baseUrl}/chapters/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...teamRoutes, ...chapterRoutes];
}
