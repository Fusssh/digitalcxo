import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { leadershipTeam, getTeamMemberBySlug } from "@/lib/data/teamData";
import { 
  ArrowLeft, 
  ExternalLink, 
  Briefcase, 
  Award, 
  Quote, 
  CheckCircle2 
} from "lucide-react";

interface TeamProfileProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return leadershipTeam.map((member) => ({
    slug: member.slug,
  }));
}

export async function generateMetadata({ params }: TeamProfileProps) {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);
  if (!member) {
    return { title: "Leader Not Found — Digital CXOS" };
  }
  return {
    title: `${member.name} — ${member.role} | Digital CXOS`,
    description: member.bio,
  };
}

export default async function TeamMemberPage({ params }: TeamProfileProps) {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Page Hero */}
      <PageHero
        title={member.name}
        subtitle={member.role}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Leadership Team", href: "/about#leadership" },
          { label: member.name },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/about#leadership"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A227] hover:text-[#D4AF37] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Leadership Team</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Portrait & Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-[#202020] rounded-sm p-8 border border-neutral-800 text-center space-y-6 shadow-xl">
              <div className="w-32 h-32 mx-auto relative rounded-sm overflow-hidden border-2 border-[#C9A227]/50 shadow-2xl">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale contrast-125"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-[#C9A227] font-serif font-bold text-3xl">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold font-serif text-white">
                  {member.name}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A227] mt-1">
                  {member.role}
                </p>
                {member.experience && (
                  <p className="text-xs text-neutral-400 mt-1">
                    {member.experience}
                  </p>
                )}
              </div>

              {/* Subtle Tricolour Line */}
              <div className="w-20 h-0.5 mx-auto rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

              {/* LinkedIn Button */}
              {member.linkedin && (
                <div>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-[#C9A227] border border-neutral-700 transition-colors w-full justify-center"
                  >
                    <span>Connect on LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Sectors Tags */}
              <div className="pt-4 border-t border-neutral-800 text-left space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                  Sectors &amp; Domain Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.sectors.map((sec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-neutral-900 text-[#C9A227] border border-neutral-800"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Executive Credo */}
          <div className="lg:col-span-8 space-y-8">
            {/* Bio Section */}
            <div className="bg-[#202020] rounded-sm p-8 sm:p-10 border border-neutral-800 space-y-6 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Executive Profile</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                Leadership Overview
              </h3>

              <p className="text-base text-neutral-200 leading-relaxed text-justify">
                {member.bio}
              </p>

              {member.quote && (
                <div className="p-6 rounded-sm bg-[#181818] border-l-4 border-l-[#C9A227] border border-neutral-800 relative">
                  <Quote className="w-8 h-8 text-[#C9A227]/20 absolute top-4 left-4 -z-0" />
                  <p className="text-sm sm:text-base italic text-neutral-200 relative z-10 pl-6 leading-relaxed">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Strategic Pillars of Contribution */}
            <div className="bg-[#202020] rounded-sm p-8 sm:p-10 border border-neutral-800 space-y-6 shadow-xl">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C9A227]" />
                <h3 className="text-lg font-bold font-serif text-white">
                  Role Within Digital CXOS
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300">
                <div className="p-4 rounded-sm bg-neutral-900 border border-neutral-800 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Boardroom Strategy</span>
                    <span className="text-neutral-400 mt-1 block">Steering high-trust peer pods and corporate governance forums.</span>
                  </div>
                </div>

                <div className="p-4 rounded-sm bg-neutral-900 border border-neutral-800 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Tech Disruption Advisory</span>
                    <span className="text-neutral-400 mt-1 block">Advising on cybersecurity defense, sovereign cloud &amp; AI literacy.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect CTA */}
            <div className="p-8 rounded-sm bg-[#161616] border border-[#C9A227]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <div>
                <h4 className="text-lg font-bold font-serif text-white">
                  Connect With Our Leadership
                </h4>
                <p className="text-xs text-neutral-300 mt-1">
                  Explore collaborative engagement, advisory roundtables, and membership opportunities.
                </p>
              </div>
              <Link
                href="/membership2"
                className="px-6 py-3 rounded text-xs font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 shadow-lg transition-all shrink-0"
              >
                Join CXO Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
