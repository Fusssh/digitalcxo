import React from "react";
import { PageHero } from "@/components/layout/PageHero";
import { ShieldCheck, Scale, Award } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions — Digital CXOS",
  description: "Terms and Conditions governing membership and community engagement with Digital CXOS Private Limited.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#181818] text-white">
      <PageHero
        title="Terms and Conditions"
        subtitle="Governing principles for high-trust executive peer engagement within the Digital CXOS leadership fraternity."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms and Conditions" },
        ]}
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-16 text-neutral-300 space-y-12 text-[16px] leading-relaxed">
        
        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Introduction</h2>
          <p>
            Your engagement with Digital CXOS, whether through form submissions or event involvement, implies acceptance of the terms and conditions stated below:
          </p>
        </section>

        {/* Core Commitments */}
        <section className="space-y-8 border-t border-neutral-800 pt-8">
          
          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-white">Accuracy of Information</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>Details provided in the partnership or membership forms must be accurate and complete</li>
              <li>Verification will be done through OTP, which will be sent to the provided email address.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-white">Membership Commitments</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>Agreement to Confidentiality &amp; Code of Conduct is non-negotiable</li>
              <li>Consent for membership is confirmed through verified emails</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-white">Partnership &amp; Sponsorship Commitments</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>Agreement to Engagement Guidelines &amp; Ethical Conduct is mandatory</li>
              <li>Consent to be contacted will be recorded</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-white">Data Retention Obligations</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>Your data will be kept as long as it is required to maintain an active membership and partnership.</li>
              <li>Withdrawal of membership/partnership will lead to data deletion, unless in cases where there are legal obligations.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-white">Consent for Communication</h2>
            <p className="text-neutral-400">
              By providing us with your contact details, you are offering us your consent to receive newsletters, updates and event-related information
            </p>
          </div>

        </section>

        {/* Restrictions & Obligations */}
        <section className="space-y-8 border-t border-neutral-800 pt-8">
          
          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-white">Restrictions</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>Services are strictly intended for adults (18 years or older).</li>
              <li>Digital CXOS strictly restricts the misuse of its platform, forms, or community engagements.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-white">Obligations of the User:</h2>
            <p className="text-neutral-400">Users must refrain from:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>Partaking in any activities that disrupt the efficiency of the Site</li>
              <li>Making efforts to gain unauthorised access to any part of the Site</li>
              <li>Using the Site for legally questionable purposes</li>
            </ul>
          </div>

        </section>

        {/* Additional Policies */}
        <section className="space-y-8 border-t border-neutral-800 pt-8">
          
          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-white">Privacy Policy:</h2>
            <p className="text-neutral-400">
              Please go through our Privacy Policy to gain a clear understanding of our practices. By accessing this Site, you are giving us your consent to process information as per the Privacy Policy.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-white">Term Modification:</h2>
            <p className="text-neutral-400">
              Please note that we reserve the right to modify the Terms and Conditions at any time. You will be notified of such a change. By continuing to use the Site after the changes, you show your acceptance of the changes.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-white">Governing Law:</h2>
            <p className="text-neutral-400">
              These Terms and Conditions have been curated as per the guidelines of the Indian Legal System. Any dispute regarding these Terms and Conditions is subject to the jurisdiction of the courts in Noida, India.
            </p>
          </div>

        </section>

        {/* Contact Us */}
        <section className="space-y-4 border-t border-neutral-800 pt-8 pb-16">
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Contact:</h2>
          <p>For any dispute or query regarding the Terms and Conditions, contact:</p>
          <p>For questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
          <div className="bg-white/5 p-6 rounded-lg border border-white/10 space-y-2 text-neutral-300">
            <p><strong className="text-white">Email:</strong> <a href="mailto:contact@digitalcxos.com" className="text-[#C9A227] hover:underline">contact@digitalcxos.com</a></p>
            <p><strong className="text-white">Website:</strong> <a href="https://www.digitalcxos.com/" className="text-[#C9A227] hover:underline" target="_blank" rel="noreferrer">www.digitalcxos.com</a></p>
            <p><strong className="text-white">Address:</strong> Embassy Galaxy Business Park Tower-B, 1st Floor, A-44 &amp; 45, Sushil Marg, Sector 62, Noida – 201 309, Uttar Pradesh, India</p>
          </div>
        </section>

      </div>
    </div>
  );
}
