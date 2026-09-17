import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { leadershipTeam, getTeamMemberBySlug } from "@/lib/data/teamData";
import { 
  ShieldCheck, 
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
    <div className="min-h-screen bg-[#060B18]">
      {/* Page Hero */}
      <PageHero
        title={member.name}
        subtitle={member.role}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Leadership Team", href: "/about" },
          { label: member.name },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Leadership Team</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Portrait / Monogram Card */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl glass-panel-gold p-8 border border-amber-400/30 text-center space-y-6">
              <div className="w-28 h-28 mx-auto relative rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-[0_0_30px_rgba(230,202,101,0.2)]">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1B2A5E] to-[#0A132C] flex items-center justify-center text-amber-300 font-serif font-bold text-3xl">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-100">
                  {member.name}
                </h2>
                <p className="text-sm text-amber-400/90 font-medium mt-1">
                  {member.role}
                </p>
                {member.experience && (
                  <p className="text-xs text-slate-400 mt-1">
                    {member.experience}
                  </p>
                )}
              </div>

              {/* Tricolour Divider */}
              <div className="w-20 h-0.5 mx-auto rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

              {/* LinkedIn Button */}
              {member.linkedin && (
                <div>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-amber-300 border border-white/10 transition-colors w-full justify-center"
                  >
                    <span>Connect on LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Sectors Tags */}
              <div className="pt-4 border-t border-white/10 text-left space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Sectors & Domain Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.sectors.map((sec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 text-amber-300/90 border border-white/5"
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
            <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Executive Profile</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-100">
                Leadership Overview
              </h3>

              <p className="text-base text-slate-200 leading-relaxed text-justify">
                {member.bio}
              </p>

              {member.quote && (
                <div className="p-6 rounded-2xl bg-[#09132E] border border-amber-400/20 relative">
                  <Quote className="w-8 h-8 text-amber-400/30 absolute top-4 left-4 -z-0" />
                  <p className="text-sm sm:text-base italic text-amber-200/90 relative z-10 pl-6 leading-relaxed">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Strategic Pillars of Contribution */}
            <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 space-y-6">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold font-serif text-slate-100">
                  Role Within Digital CXOS
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Boardroom Strategy</span>
                    <span className="text-slate-400 mt-1 block">Steering high-trust peer pods and corporate governance forums.</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Tech Disruption Advisory</span>
                    <span className="text-slate-400 mt-1 block">Advising on cybersecurity defense, sovereign cloud & AI literacy.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect CTA */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C1A42] to-[#081026] border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold font-serif text-slate-100">
                  Connect With Our Leadership
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Explore collaborative engagement, advisory roundtables, and membership opportunities.
                </p>
              </div>
              <Link
                href="/membership2"
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all shrink-0"
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
