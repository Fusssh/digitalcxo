"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cxoMembershipSchema, CxoMembershipFormData } from "@/lib/schemas/cxoSchema";
import { PageHero } from "@/components/layout/PageHero";
import { getCountries, getStatesForCountry, getCitiesForState } from "@/lib/data/geoData";
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const BOARD_EXPERIENCE_OPTIONS = [
  "Direct Board Member / Director",
  "Board Advisor / Committee Member",
  "Regular Boardroom Presenter / C-Suite Invitee",
  "Occasional Board Interactions",
  "None / Aspiring Board Member"
];

const CONTRIBUTE_OPTIONS = [
  "Keynote & Panel Speaking at Flagship Conclaves",
  "Advisory Board & Executive Peer Mentorship",
  "Co-Authored Research Reports & Whitepapers",
  "Podcast & Masterclass Video Series",
  "Closed-Door Chatham House Roundtable Moderation",
  "General Executive Participation & Networking"
];

const FOCUS_AREAS = [
  "AI, Generative Models & Cognitive Systems",
  "Sovereign Cyber Defense & Zero-Trust Architecture",
  "Cloud Sovereignty & Hyperscale Infrastructure",
  "Enterprise Digital Transformation & Modernization",
  "Data Privacy, DPDP 2023 & Boardroom Governance",
  "Quantum Computing & Emerging Technologies",
  "Supply Chain Tech & Industrial Automation"
];

const INDUSTRY_OPTIONS = [
  "Banking, Financial Services & Insurance (BFSI)",
  "Information Technology & ITES",
  "Manufacturing & Industrial Automation",
  "Telecom & 5G Infrastructure",
  "Healthcare & Life Sciences",
  "Aerospace & Defense",
  "Retail & E-commerce",
  "Consulting & Advisory",
  "Energy, Oil & Utilities",
  "Automotive & Transportation",
  "Media & Entertainment",
  "Other Enterprise Sector"
];

export default function CxoMembershipPage() {
  const [countries] = useState<string[]>(getCountries());
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CxoMembershipFormData>({
    resolver: zodResolver(cxoMembershipSchema),
    defaultValues: {
      title: "Mr.",
      firstName: "",
      middleName: "",
      lastName: "",
      officialEmail: "",
      mobile: "",
      organization: "",
      designation: "",
      country: "India",
      state: "",
      city: "",
      linkedin: "",
      organizationWebsite: "",
      boardExperience: "",
      leadershipExperience: "",
      contributeVia: "",
      strategicInterests: "",
      industry: "",
      termsConsent: false
    }
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // Cascading Country -> State
  useEffect(() => {
    if (selectedCountry) {
      const stateList = getStatesForCountry(selectedCountry);
      setStates(stateList);
      setValue("state", "");
      setValue("city", "");
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry, setValue]);

  // Cascading State -> City
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cityList = getCitiesForState(selectedCountry, selectedState);
      setCities(cityList);
      setValue("city", "");
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState, setValue]);

  const onSubmit = async (data: CxoMembershipFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cxo", ...data })
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Submission failed. Please check form fields.");
      }

      setSubmittedSuccess(true);
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-neutral-100">
      <PageHero
        title="CXO Membership Application"
        subtitle="Join India's premier executive peer network shaping enterprise technology, cyber defense, and sovereign digital transformation."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Join Us", href: "/membership2" },
          { label: "CXO Intake" }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        {submittedSuccess ? (
          <div className="max-w-2xl mx-auto bg-[#131622] border border-[#C9A227]/40 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
              <CheckCircle className="w-10 h-10" />
            </div>

            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#C9A227] px-3 py-1 rounded bg-[#C9A227]/10 border border-[#C9A227]/20">
              Application Confirmed
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              CXO Membership Application Received
            </h3>

            <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Thank you for submitting your credentials to Digital CXOS. Our Executive Advisory Board reviews all submissions under Chatham House rules. Our secretariat will contact you within <span className="text-white font-semibold">48 business hours</span>.
            </p>

            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="px-7 py-3.5 rounded text-xs font-bold uppercase tracking-wider bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 transition-all shadow-xl cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#0D101C] rounded-2xl p-6 sm:p-10 md:p-12 border border-neutral-800/80 shadow-2xl space-y-10">
            {/* Header matching image */}
            <div className="space-y-6 text-center border-b border-neutral-800/80 pb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-widest uppercase text-white font-sans">
                CXO MEMBERSHIP
              </h1>
              <div className="flex items-center justify-start text-left">
                <p className="text-xs sm:text-sm text-neutral-300 font-medium">
                  <span className="text-[#FF6600] font-bold text-sm mr-1">*</span> Indicates Required Fields
                </p>
              </div>
            </div>

            {serverError && (
              <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-600/40 text-rose-200 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* ROW 1: Title, First Name, Middle Name, Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-6 gap-y-8 items-end">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Title
                  </label>
                  <div className="relative border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <select
                      {...register("title")}
                      className="w-full bg-transparent text-sm sm:text-base text-white pb-2 pt-1 outline-none cursor-pointer appearance-none pr-6 [&>option]:bg-[#1A1D27] [&>option]:text-white"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-0 bottom-2.5 pointer-events-none" />
                  </div>
                  {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* First Name */}
                <div className="sm:col-span-4">
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>First Name
                  </label>
                  <div className="border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <input
                      type="text"
                      {...register("firstName")}
                      placeholder="First Name"
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 pb-2 pt-1 outline-none"
                    />
                  </div>
                  {errors.firstName && <p className="text-rose-400 text-xs mt-1">{errors.firstName.message}</p>}
                </div>

                {/* Middle Name */}
                <div className="sm:col-span-3">
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    Middle Name
                  </label>
                  <div className="border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <input
                      type="text"
                      {...register("middleName")}
                      placeholder="Middle Name"
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 pb-2 pt-1 outline-none"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="sm:col-span-3">
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Last Name
                  </label>
                  <div className="border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <input
                      type="text"
                      {...register("lastName")}
                      placeholder="Last Name"
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 pb-2 pt-1 outline-none"
                    />
                  </div>
                  {errors.lastName && <p className="text-rose-400 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* ROW 2: Official Email, Mobile, Organization, Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 items-end">
                {/* Official Email */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Official Email
                  </label>
                  <div className="border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <input
                      type="email"
                      {...register("officialEmail")}
                      placeholder="name@enterprise.com"
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 pb-2 pt-1 outline-none"
                    />
                  </div>
                  {errors.officialEmail && <p className="text-rose-400 text-xs mt-1">{errors.officialEmail.message}</p>}
                </div>

                {/* Mobile (WhatsApp preferred) */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Mobile (WhatsApp preferred)
                  </label>
                  <div className="border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <input
                      type="tel"
                      {...register("mobile")}
                      placeholder="+91 98765 43210"
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 pb-2 pt-1 outline-none"
                    />
                  </div>
                  {errors.mobile && <p className="text-rose-400 text-xs mt-1">{errors.mobile.message}</p>}
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Organization
                  </label>
                  <div className="border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <input
                      type="text"
                      {...register("organization")}
                      placeholder="Organization Name"
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 pb-2 pt-1 outline-none"
                    />
                  </div>
                  {errors.organization && <p className="text-rose-400 text-xs mt-1">{errors.organization.message}</p>}
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Designation
                  </label>
                  <div className="border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <input
                      type="text"
                      {...register("designation")}
                      placeholder="e.g. CIO / CISO / CTO"
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 pb-2 pt-1 outline-none"
                    />
                  </div>
                  {errors.designation && <p className="text-rose-400 text-xs mt-1">{errors.designation.message}</p>}
                </div>
              </div>

              {/* ROW 3: Choose Country, Choose State, Choose City */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8 items-end">
                {/* Choose Country */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Choose Country
                  </label>
                  <div className="relative border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <select
                      {...register("country")}
                      className="w-full bg-transparent text-sm sm:text-base text-white pb-2 pt-1 outline-none cursor-pointer appearance-none pr-6 [&>option]:bg-[#1A1D27] [&>option]:text-white"
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-0 bottom-2.5 pointer-events-none" />
                  </div>
                  {errors.country && <p className="text-rose-400 text-xs mt-1">{errors.country.message}</p>}
                </div>

                {/* Choose State */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Choose State
                  </label>
                  <div className="relative border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <select
                      {...register("state")}
                      disabled={!selectedCountry || states.length === 0}
                      className="w-full bg-transparent text-sm sm:text-base text-white pb-2 pt-1 outline-none cursor-pointer appearance-none pr-6 disabled:opacity-40 [&>option]:bg-[#1A1D27] [&>option]:text-white"
                    >
                      <option value="">
                        {!selectedCountry ? "Select country first" : "Select State"}
                      </option>
                      {states.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-0 bottom-2.5 pointer-events-none" />
                  </div>
                  {errors.state && <p className="text-rose-400 text-xs mt-1">{errors.state.message}</p>}
                </div>

                {/* Choose City */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Choose City
                  </label>
                  <div className="relative border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <select
                      {...register("city")}
                      disabled={!selectedState || cities.length === 0}
                      className="w-full bg-transparent text-sm sm:text-base text-white pb-2 pt-1 outline-none cursor-pointer appearance-none pr-6 disabled:opacity-40 [&>option]:bg-[#1A1D27] [&>option]:text-white"
                    >
                      <option value="">
                        {!selectedState ? "Select state first" : "Select City"}
                      </option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-0 bottom-2.5 pointer-events-none" />
                  </div>
                  {errors.city && <p className="text-rose-400 text-xs mt-1">{errors.city.message}</p>}
                </div>
              </div>

              {/* ROW 4: Linkedin, Organization Website, Board Interaction Experience */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8 items-end">
                {/* Linkedin */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Linkedin (or &apos;NA&apos;)
                  </label>
                  <div className="border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <input
                      type="text"
                      {...register("linkedin")}
                      placeholder="https://linkedin.com/in/yourname or NA"
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 pb-2 pt-1 outline-none"
                    />
                  </div>
                  {errors.linkedin && <p className="text-rose-400 text-xs mt-1">{errors.linkedin.message}</p>}
                </div>

                {/* Organization Website */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    Organization Website
                  </label>
                  <div className="border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <input
                      type="text"
                      {...register("organizationWebsite")}
                      placeholder="https://company.com"
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 pb-2 pt-1 outline-none"
                    />
                  </div>
                </div>

                {/* Board Interaction Experience */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    Board Interaction Experience
                  </label>
                  <div className="relative border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <select
                      {...register("boardExperience")}
                      className="w-full bg-transparent text-sm sm:text-base text-white pb-2 pt-1 outline-none cursor-pointer appearance-none pr-6 [&>option]:bg-[#1A1D27] [&>option]:text-white"
                    >
                      <option value="">Select Board Experience</option>
                      {BOARD_EXPERIENCE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-0 bottom-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* ROW 5: Leadership Experience (Years) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8 items-end">
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    Leadership Experience (Years)
                  </label>
                  <div className="border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <input
                      type="text"
                      {...register("leadershipExperience")}
                      placeholder="e.g. 15+ years"
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 pb-2 pt-1 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ROW 6: Would you like to contribute via, Strategic Areas of Interest, Industry */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8 items-end">
                {/* Would you like to contribute via */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Would you like to contribute via
                  </label>
                  <div className="relative border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <select
                      {...register("contributeVia")}
                      className="w-full bg-transparent text-sm sm:text-base text-white pb-2 pt-1 outline-none cursor-pointer appearance-none pr-6 [&>option]:bg-[#1A1D27] [&>option]:text-white"
                    >
                      <option value="">Select Contribution Track</option>
                      {CONTRIBUTE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-0 bottom-2.5 pointer-events-none" />
                  </div>
                  {errors.contributeVia && <p className="text-rose-400 text-xs mt-1">{errors.contributeVia.message}</p>}
                </div>

                {/* Strategic Areas of Interest */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Strategic Areas of Interest
                  </label>
                  <div className="relative border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <select
                      {...register("strategicInterests")}
                      className="w-full bg-transparent text-sm sm:text-base text-white pb-2 pt-1 outline-none cursor-pointer appearance-none pr-6 [&>option]:bg-[#1A1D27] [&>option]:text-white"
                    >
                      <option value="">Select Focus Area</option>
                      {FOCUS_AREAS.map((focus) => (
                        <option key={focus} value={focus}>
                          {focus}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-0 bottom-2.5 pointer-events-none" />
                  </div>
                  {errors.strategicInterests && <p className="text-rose-400 text-xs mt-1">{errors.strategicInterests.message}</p>}
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-300 font-medium mb-1">
                    <span className="text-[#FF6600] font-bold mr-1">*</span>Industry
                  </label>
                  <div className="relative border-b border-neutral-700/80 focus-within:border-[#C9A227] transition-colors">
                    <select
                      {...register("industry")}
                      className="w-full bg-transparent text-sm sm:text-base text-white pb-2 pt-1 outline-none cursor-pointer appearance-none pr-6 [&>option]:bg-[#1A1D27] [&>option]:text-white"
                    >
                      <option value="">Select Industry</option>
                      {INDUSTRY_OPTIONS.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-0 bottom-2.5 pointer-events-none" />
                  </div>
                  {errors.industry && <p className="text-rose-400 text-xs mt-1">{errors.industry.message}</p>}
                </div>
              </div>

              {/* Terms & Consent */}
              <div className="pt-4 border-t border-neutral-800/80">
                <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-neutral-800/30 transition-colors">
                  <input
                    type="checkbox"
                    {...register("termsConsent")}
                    className="mt-0.5 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[#C9A227] accent-[#C9A227] focus:ring-[#C9A227] shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-neutral-300 group-hover:text-white leading-relaxed">
                    I agree to the <a href="/terms" target="_blank" className="text-[#C9A227] underline">Terms of Service</a> and <a href="/privacy-policy" target="_blank" className="text-[#C9A227] underline">Privacy Policy</a>, and consent to confidential credential verification by the Digital CXOS Secretariat.
                  </span>
                </label>
                {errors.termsConsent && (
                  <p className="text-rose-400 text-xs pl-7 mt-1">{errors.termsConsent.message}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 rounded-lg font-bold text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#C9A227] hover:brightness-110 text-neutral-950 shadow-[0_4px_20px_rgba(201,162,39,0.35)] hover:shadow-[0_4px_28px_rgba(201,162,39,0.55)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit CXO Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Sovereign Tricolour Accent Line */}
                <div className="w-28 h-1 rounded-full flex overflow-hidden self-center sm:self-auto">
                  <div className="w-1/3 bg-[#FF9933]" />
                  <div className="w-1/3 bg-white" />
                  <div className="w-1/3 bg-[#138808]" />
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
