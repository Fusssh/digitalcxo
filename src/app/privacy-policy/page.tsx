import React from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Shield, Lock, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Digital CXOS",
  description: "Privacy Policy of Digital CXOS Private Limited in accordance with India's DPDP Act.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060B18]">
      <PageHero
        title="Privacy Policy"
        subtitle="Digital CXOS Private Limited is committed to protecting the confidentiality and security of executive data."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-300 space-y-8 text-sm leading-relaxed">
        <div className="rounded-2xl glass-panel p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-serif text-lg font-bold">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>1. Information We Collect</span>
          </div>
          <p>
            Digital CXOS Private Limited collects information provided during CXO membership applications, partner inquiries, and event registrations. This includes your name, official email, phone/WhatsApp number, organization, designation, leadership experience, and strategic technology interests.
          </p>
          <p className="text-xs text-amber-300/90 italic">
            In accordance with our strict confidentiality protocols, we do not solicit nor store sensitive personal identifiers such as PAN, Aadhar card numbers, passports, or payment card details.
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-serif text-lg font-bold">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>2. Purpose of Collection &amp; Use of Data</span>
          </div>
          <p>
            Your information is used exclusively to evaluate membership eligibility, facilitate high-trust peer roundtable interactions, administer conclaves and chapter events, distribute strategic podcast and whitepaper updates, and collaborate with authorized partners under Chatham House guidelines.
          </p>
          <p>
            We do not sell, rent, or commercialize executive contact information to third-party brokers.
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-serif text-lg font-bold">
            <FileText className="w-5 h-5 text-sky-400" />
            <span>3. Compliance with India&apos;s DPDP Act</span>
          </div>
          <p>
            Digital CXOS complies with the Digital Personal Data Protection (DPDP) Act of India and relevant global data sovereignty directives. Executive members may request review, correction, or deletion of their submitted personal information by writing to our designated grievance officer.
          </p>
          <div className="pt-2 text-xs text-slate-400">
            <p className="font-semibold text-slate-200">Grievance Contact:</p>
            <p>Email: contact@digitalcxos.com</p>
            <p>Address: Embassy Galaxy Business Park, Tower-B, 1st Floor, Sector 62, Noida – 201309</p>
          </div>
        </div>
      </div>
    </div>
  );
}
