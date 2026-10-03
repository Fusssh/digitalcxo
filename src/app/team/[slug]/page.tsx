import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ADMIN_API_BASE_URL } from "@/lib/apiClient";
import { leadershipTeam } from "@/lib/data/teamData";

interface TeamProfileProps {
  params: Promise<{
    slug: string;
  }>;
}

async function fetchMember(id: string) {
  const normalizedId = decodeURIComponent(id).toLowerCase().trim();
  const local = leadershipTeam.find(
    (m) =>
      m.slug.toLowerCase() === normalizedId ||
      m.id?.toLowerCase() === normalizedId ||
      m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedId
  );

  try {
    const res = await fetch(`${ADMIN_API_BASE_URL}/leadership/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        return {
          ...data.data,
          description: local?.bio || data.data.description || data.data.shortBio || "",
        };
      }
    }
  } catch {
    // API failed or unreachable, will fallback
  }

  if (local) {
    return {
      name: local.name,
      designation: local.role,
      description: local.bio,
      shortBio: local.quote,
    };
  }

  return null;
}

export async function generateMetadata({ params }: TeamProfileProps) {
  const { slug } = await params;
  const member = await fetchMember(slug);
  if (!member) {
    return { title: "Team Member — Digital CXOS" };
  }
  return {
    title: `${member.name} — ${member.designation || "Leadership"} | Digital CXOS`,
    description: member.description || member.shortBio || member.name,
  };
}

export default async function TeamMemberPage({ params }: TeamProfileProps) {
  const { slug } = await params;
  const memberData = await fetchMember(slug);

  if (!memberData) {
    notFound();
  }

  const name = memberData.name;
  const description = memberData.description || memberData.shortBio || "";

  // Split description paragraphs cleanly
  const paragraphs = description
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-36 sm:pt-40 md:pt-44 pb-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Simple Back Navigation */}
        <div className="mb-10">
          <Link
            href="/#leadership"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#C29D59] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Leadership</span>
          </Link>
        </div>

        {/* Clean Name & Description — matching client requirement */}
        <div className="space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold uppercase tracking-wide text-[#C29D59]">
            {name}
          </h1>

          <div className="space-y-5 text-base sm:text-lg text-[#333333] leading-relaxed font-normal">
            {paragraphs.length > 0 ? (
              paragraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))
            ) : (
              <p>{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
