import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { chaptersData, getChapterById } from "@/lib/data/chaptersData";
import { 
  MapPin, 
  Users, 
  Calendar, 
  ArrowLeft, 
  ShieldCheck, 
  Building, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";

interface ChapterPageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateStaticParams() {
  return chaptersData.map((c) => ({
    city: c.id,
  }));
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { city } = await params;
  const chapter = getChapterById(city);
  if (!chapter) {
    return { title: "Chapter Not Found — Digital CXOS" };
  }
  return {
    title: `${chapter.name} Chapter — Digital CXOS | Regional Hub`,
    description: chapter.description,
  };
}

export default async function ChapterCityPage({ params }: ChapterPageProps) {
  const { city } = await params;
  const chapter = getChapterById(city);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#060B18]">
      <PageHero
        title={`${chapter.name} Chapter`}
        subtitle={chapter.region}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Chapters", href: "/chapters" },
          { label: chapter.name },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <Link
            href="/chapters"
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Regional Chapters</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold">
                  {chapter.region}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>{chapter.memberCount}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100">
                Strategic Mandate & Regional Focus
              </h2>

              <p className="text-base text-slate-200 leading-relaxed text-justify">
                {chapter.description}
              </p>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-wider text-amber-300">
                  Cadence & Leadership Pods
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Meeting Cadence</span>
                      <span className="text-slate-400 mt-1 block">{chapter.meetingFrequency}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Governance Lead</span>
                      <span className="text-slate-400 mt-1 block">{chapter.lead}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Benefits */}
            <div className="rounded-3xl glass-panel p-8 border border-white/10 space-y-4">
              <h3 className="text-lg font-bold font-serif text-slate-100">
                What {chapter.name} Members Receive
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Confidential, Chatham House rule peer roundtables with regional leaders.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct participation in national policy dialogues and crisis simulation labs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Complimentary access to annual residential conclaves with spouses.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl glass-panel-gold p-8 border border-amber-400/30 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Building className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif text-slate-100">
                  Join the {chapter.name.split(" ")[0]} Pod
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Connect with peer enterprise decision-makers in {chapter.name}. Membership is strictly CXO-vetted.
                </p>
              </div>

              <div className="w-20 h-0.5 mx-auto rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

              <div className="space-y-3">
                <Link
                  href="/membership2"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Apply For CXO Membership</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/partnership2"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Partner in {chapter.name.split(" ")[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
