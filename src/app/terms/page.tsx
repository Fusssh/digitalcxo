import React from "react";
import { PageHero } from "@/components/layout/PageHero";
import { ShieldCheck, Scale, Award } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions — Digital CXOS",
  description: "Terms and Conditions governing membership and community engagement with Digital CXOS Private Limited.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#060B18]">
      <PageHero
        title="Terms and Conditions"
        subtitle="Governing principles for high-trust executive peer engagement within the Digital CXOS leadership fraternity."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms and Conditions" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-300 space-y-8 text-sm leading-relaxed">
        <div className="rounded-2xl glass-panel p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-serif text-lg font-bold">
            <Scale className="w-5 h-5 text-amber-400" />
            <span>1. Platform Membership &amp; Eligibility</span>
          </div>
          <p>
            Membership in Digital CXOS is strictly by invitation or verified application, restricted to Chief Information Officers (CIOs), Chief Information Security Officers (CISOs), Chief Technology Officers (CTOs), Chief Digital Officers (CDOs), and enterprise technology leaders. Digital CXOS Private Limited reserves the discretionary right to review and accept or decline membership applications to protect the strategic integrity of the forum.
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-serif text-lg font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>2. Code of Professional Conduct &amp; Confidentiality</span>
          </div>
          <p>
            All closed-door sessions, crisis simulation labs, and executive roundtables operate under the Chatham House Rule: participants are free to use the information received, but neither the identity nor the affiliation of the speaker(s), nor that of any other participant, may be revealed. Members agree to engage professionally, ethically, and without unsolicited commercial solicitation.
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-serif text-lg font-bold">
            <Award className="w-5 h-5 text-sky-400" />
            <span>3. Partner Engagement Guidelines</span>
          </div>
          <p>
            Authorized technology partners, sponsors, and vendors collaborating with the CXO fraternity agree to respect the educational, thought-leadership nature of community engagements. Any breach of high-trust ethics or unauthorized data mining will result in immediate termination of partnership privileges.
          </p>
        </div>
      </div>
    </div>
  );
}
