import React from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Shield, Lock, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Digital CXOS",
  description: "Privacy Policy of Digital CXOS Private Limited in accordance with India's DPDP Act.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#181818] text-white">
      <PageHero
        title="Privacy Policy"
        subtitle="Digital CXOS Private Limited is committed to protecting the confidentiality and security of executive data."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-16 text-neutral-300 space-y-12 text-[16px] leading-relaxed">
        
        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Introduction</h2>
          <p>
            Digital CXOS values the privacy of its members, partners and visitors. This Privacy Policy describes how we gather, utilise and protect your personal information when you engage with our platform, including membership applications, partnership forms, events and related services.
          </p>
          <p>
            By using our website, submitting a membership or partnership form, or engaging with our platform, you consent to the collection and use of your information in accordance with this Privacy Policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight border-t border-neutral-800 pt-8">Information We Collect</h2>
          <p>
            We collect personal and professional information directly from you when you fill out membership or partnership forms, register for our events, or interact with our platform. We validate the same by verifying that it is you who has given the details via OTP sent over email.
          </p>

          <h3 className="text-lg font-bold text-[#C9A227] mt-6">CXO Membership Form</h3>
          <p>We may collect the following information:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
            <li>Title (Mr., Mrs., Ms., Dr., Other)</li>
            <li>First, Middle and Last Name</li>
            <li>Country and Primary Location (City &amp; State)</li>
            <li>Official (Work) Email Address (for verification purposes)</li>
            <li>Mobile Number</li>
            <li>LinkedIn Profile URL</li>
            <li>Current Designation &amp; Organisation Details (name, website, industry sector)</li>
            <li>Years in Current CXO or Equivalent Role</li>
            <li>Total Years of Leadership Experience</li>
            <li>Board Interaction Experience (Yes/No)</li>
            <li>Strategic Areas of Interest (e.g., AI governance, cloud, ransomware, ESG, DPDP Act, quantum risk, etc.)</li>
            <li>Coverage/Responsibility Area (India / Regional / Global / Multi-country)</li>
            <li>Role in Other CXO Networks (Yes/No)</li>
            <li>Contribution Methods (speaking, writing, mentoring, policy, podcast, etc.)</li>
            <li>Preferred Mode of Engagement (in-person / virtual / hybrid)</li>
            <li>Referral Details (how did you know us, referred by)</li>
            <li>Agreement to Confidentiality &amp; Code of Conduct</li>
            <li>Consent for membership (with email verification)</li>
          </ul>
          <div className="p-4 bg-[#C9A227]/10 border-l-2 border-[#C9A227] text-neutral-300 text-sm italic mt-4">
            By submitting this form, I agree to the collection and use of my personal &amp; professional information for communication, collaboration &amp; engagement with trusted partners, OEMs &amp; service providers. This information will be handled securely and responsibly, respecting all relevant data privacy regulations. I also declare that I am 18 years and above. (✓)
          </div>

          <h3 className="text-lg font-bold text-[#C9A227] mt-8">Partnership &amp; Sponsorship Form Data</h3>
          <p>We may collect the following information:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
            <li>Company Name &amp; Website</li>
            <li>Primary Contact Name, Role/Designation</li>
            <li>Official Email &amp; Mobile Number</li>
            <li>Registered HQ Location (City, Country)</li>
            <li>Presence in India (Yes/No)</li>
            <li>Industry/Technology Focus (e.g., cybersecurity, AI, cloud, etc.)</li>
            <li>Key Solution Areas (e.g., Zero Trust, IAM, DPDP, AI Security)</li>
            <li>Enterprise Segments Served (e.g., BFSI, Manufacturing, Pharma, Public Sector, etc.)</li>
            <li>Preferred Modes of Engagement (roundtables, thought leadership, showcases, research, etc.)</li>
            <li>Sponsorship &amp; Collaboration Preferences (annual, event-based, sector/city-focused, content-led, etc.)</li>
            <li>Value Offered to the CXO Community (brief description)</li>
            <li>Agreement to Engagement Guidelines &amp; Ethical Conduct (checkbox)</li>
            <li>Consent to Be Contacted (checkbox)</li>
          </ul>
          <div className="p-4 bg-[#C9A227]/10 border-l-2 border-[#C9A227] text-neutral-300 text-sm italic mt-4">
            By submitting this form, I agree to the collection and use of my personal &amp; professional information for communication, collaboration &amp; engagement with trusted partners, OEMs &amp; service providers. This information will be handled securely and responsibly, respecting all relevant data privacy regulations. I also declare that I am 18 years and above. (✓)
          </div>

          <h3 className="text-lg font-bold text-[#C9A227] mt-8">Automatically Collected Data</h3>
          <p>When you visit our website, we may also collect limited technical data, including:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
            <li>IP address</li>
            <li>Type of Browser</li>
            <li>Pages visited, date/time, duration of visit</li>
            <li>Device information (desktop, mobile, tablet)</li>
            <li>Cookies and other notable tracking technologies</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight border-t border-neutral-800 pt-8">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
            <li>Review and process membership and partnership applications</li>
            <li>Verify eligibility and maintain authenticity of CXO community membership</li>
            <li>Facilitate networking, discussions, collaborations and knowledge-sharing sessions</li>
            <li>Communicate regarding events, roundtables, thought leadership opportunities and policy discussions</li>
            <li>Coordinate sponsorship and partnership engagements</li>
            <li>Send updates, newsletters and relevant communications (with your consent)</li>
            <li>Improve our platform, services and user experience</li>
            <li>Ensure compliance with confidentiality and ethical conduct commitments</li>
          </ul>
          <p className="font-bold text-white mt-4">We will never sell your personal data to third parties.</p>
        </section>

        {/* Information Sharing */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight border-t border-neutral-800 pt-8">Information Sharing</h2>
          <p>We may share relevant information only under the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
            <li><strong className="text-neutral-200">With Service Providers:</strong> For communication, IT and event management purposes</li>
            <li><strong className="text-neutral-200">With Event/Engagement Partners:</strong> Some professional details might be shared for collaboration purposes.</li>
            <li><strong className="text-neutral-200">With Affiliates:</strong> Within our group entities for operational or strategic purposes.</li>
            <li><strong className="text-neutral-200">For Legal Obligations:</strong> When asked by law, regulation, or government authorities.</li>
            <li><strong className="text-neutral-200">With Your Consent:</strong> You have to explicitly give your consent to share details for collaborations, event visibility and thought leadership programs.</li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight border-t border-neutral-800 pt-8">Data Retention</h2>
          <p>We retain your data for as long as necessary to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
            <li>Ensure active partnerships and memberships</li>
            <li>Ensure that you fulfil all the terms and conditions within our Privacy Policy</li>
            <li>Ensure compliance with legal obligations</li>
          </ul>
          <p>If you decide to withdraw your membership/partnership, we will remove all collected data unless there are legal necessities.</p>
        </section>

        {/* Additional Policies */}
        <section className="space-y-8 border-t border-neutral-800 pt-8">
          
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-white">Your Rights:</h2>
            <p className="text-neutral-400">Based on the data protection laws (e.g., India DPDP Act, GDPR if applicable), you reserve the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
              <li>Access, update and correct personal information</li>
              <li>Withdraw consent at any time</li>
              <li>Request data deletion</li>
              <li>Limit the processing of your data</li>
              <li>Choose not to engage in promotional communications</li>
            </ul>
            <p className="text-neutral-400 mt-2">Requests can be made through the contact details provided below.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-white">Data Security:</h2>
            <p className="text-neutral-400">We use industry-aligned technical, administrative and organisational guidelines and measures to ensure that your personal data stays protected.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-white">Cookies &amp; Tracking:</h2>
            <p className="text-neutral-400">Our website uses cookies to improve your browsing experience, remember your preferences and analyse traffic. You can adjust your browser settings and block cookies, but that can affect some features.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-white">Children&apos;s Privacy:</h2>
            <p className="text-neutral-400">We extend our services exclusively to professionals and organisations. We do not collect personal information from individuals under the age of 18.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-white">Policy Updates:</h2>
            <p className="text-neutral-400">We may update this Privacy Policy periodically. Significant changes will be communicated via email or website notice.</p>
          </div>

        </section>

        {/* Contact Us */}
        <section className="space-y-4 border-t border-neutral-800 pt-8 pb-16">
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Contact Us:</h2>
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
