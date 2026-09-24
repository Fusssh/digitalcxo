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
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Building2, 
  UserCheck, 
  Briefcase, 
  Globe2, 
  Sparkles,
  Mail,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      title: undefined,
      middleName: "",
      lastName: "",
      organizationWebsite: "",
      boardExperience: "",
      leadershipExperience: "",
      otherCxoNetworks: "",
      country: "",
      state: "",
      city: "",
      termsConsent: false,
      accuracyConsent: false
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
    <div className="min-h-screen bg-[#141414] text-neutral-100">
      <PageHero
        title="CXO Membership Application"
        subtitle="Join India's premier executive peer network shaping enterprise technology, cyber defense, and sovereign digital transformation."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Join Us", href: "/membership2" },
          { label: "CXO Intake" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {submittedSuccess ? (
          <div className="max-w-2xl mx-auto bg-[#1C1C1C] border border-[#C9A227]/40 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fade-in">
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
              Thank you for submitting your application to Digital CXOS. Our Executive Advisory Board reviews all submissions to verify credentials. Our secretariat will reach out to you within <span className="text-white font-semibold">48 business hours</span>.
            </p>

            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-[#C9A227] hover:text-[#C9A227] transition-all"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Executive Membership Dossier & Vetting Protocol */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              {/* Card 1: Vetting Protocol */}
              <div className="bg-[#1C1C1C] rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] border border-neutral-700/80 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#C9A227]">
                    <Sparkles className="w-4 h-4" />
                    <span>Intentionally Selective</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Executive Membership Protocol
                  </h3>
                  <p className="text-base text-neutral-300 leading-relaxed">
                    Reserved exclusively for CIOs, CISOs, CTOs, CDOs, and enterprise technology decision-makers driving national transformation.
                  </p>
                </div>

                <div className="border-t border-neutral-800 pt-6 space-y-5">
                  <h4 className="text-base font-bold uppercase tracking-widest text-[#C9A227]">
                    3-Stage Vetting Lifecycle
                  </h4>

                  <div className="space-y-5 text-neutral-200">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-bold text-white text-base sm:text-lg">Confidential Profile Intake</p>
                        <p className="text-neutral-300 text-sm sm:text-base mt-1 leading-relaxed">Submission of credentials, leadership scope, and strategic interests.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-bold text-white text-base sm:text-lg">Secretariat Peer Verification</p>
                        <p className="text-neutral-300 text-sm sm:text-base mt-1 leading-relaxed">Advisory Board verification against enterprise leadership criteria.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-bold text-white text-base sm:text-lg">Induction &amp; Chapter Access</p>
                        <p className="text-neutral-300 text-sm sm:text-base mt-1 leading-relaxed">Welcome briefing, private roundtable access, and conclave credentials.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Privileges */}
                <div className="border-t border-neutral-800 pt-6 space-y-4">
                  <h4 className="text-base font-bold uppercase tracking-widest text-[#C9A227]">
                    Member Privileges
                  </h4>
                  <ul className="space-y-3.5 text-sm sm:text-base text-neutral-200">
                    <li className="flex items-center gap-3">
                      <span className="text-[#C9A227] font-bold text-lg">›</span>
                      <span>Chatham House Rule Closed-Door Roundtables</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#C9A227] font-bold text-lg">›</span>
                      <span>Horizon Annual Residential Leadership Conclave</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#C9A227] font-bold text-lg">›</span>
                      <span>Boardroom Crisis &amp; Cyber Simulation Labs</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#C9A227] font-bold text-lg">›</span>
                      <span>Confidential CXO Peer Advisory Circles</span>
                    </li>
                  </ul>
                </div>

                {/* Direct Secretariat Contact */}
                <div className="border-t border-neutral-800 pt-5 flex items-center gap-3 text-base text-neutral-300">
                  <Mail className="w-5 h-5 text-[#C9A227] shrink-0" />
                  <span>Secretariat: <strong className="text-neutral-100 font-semibold">contact@digitalcxos.com</strong></span>
                </div>
              </div>

              {/* Card 2: DPDP Privacy Pledge */}
              <div className="bg-[#181818] rounded-xl p-5 border border-neutral-800 flex items-start gap-3.5 text-sm sm:text-base text-neutral-300">
                <Lock className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Strict non-commercial exchange. Information submitted is handled with utmost discretion under India&apos;s DPDP Act standards.
                </p>
              </div>
            </aside>

            {/* Right Column: Structured Executive Form */}
            <main className="lg:col-span-8">
              <div className="bg-[#1C1C1C] rounded-2xl p-6 sm:p-10 border border-neutral-800 shadow-2xl space-y-8">
                {/* Form Header */}
                <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      CXO Application Form
                    </h2>
                    <p className="text-sm text-neutral-300 mt-1">
                      Please provide your official enterprise details for committee verification.
                    </p>
                  </div>
                  <span className="text-sm text-[#C9A227] font-semibold bg-[#C9A227]/10 px-3.5 py-1 rounded border border-[#C9A227]/20 self-start sm:self-auto">
                    * Required Fields
                  </span>
                </div>

                {serverError && (
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-200 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                    <span>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  {/* SECTION 1: Personal & Executive Identity */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-800">
                      <span className="text-sm font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded">
                        01
                      </span>
                      <h3 className="text-base font-bold uppercase tracking-wider text-white">
                        Executive Identity &amp; Direct Access
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Title */}
                      <div className="sm:col-span-3">
                        <label className="label-exec">
                          Title <span className="text-rose-400">*</span>
                        </label>
                        <select
                          {...register("title")}
                          className={cn("input-exec", errors.title && "input-exec-error")}
                        >
                          <option value="">Select</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Dr.">Dr.</option>
                        </select>
                        {errors.title && <p className="text-rose-400 text-[11px] mt-1">{errors.title.message}</p>}
                      </div>

                      {/* First Name */}
                      <div className="sm:col-span-5">
                        <label className="label-exec">
                          First Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("firstName")}
                          placeholder="e.g. Rajesh"
                          className={cn("input-exec", errors.firstName && "input-exec-error")}
                        />
                        {errors.firstName && <p className="text-rose-400 text-[11px] mt-1">{errors.firstName.message}</p>}
                      </div>

                      {/* Last Name */}
                      <div className="sm:col-span-4">
                        <label className="label-exec">
                          Last Name
                        </label>
                        <input
                          type="text"
                          {...register("lastName")}
                          placeholder="e.g. Sharma"
                          className="input-exec"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Middle Name (optional) */}
                      <div className="sm:col-span-4">
                        <label className="label-exec">
                          Middle Name (Optional)
                        </label>
                        <input
                          type="text"
                          {...register("middleName")}
                          placeholder="Middle name"
                          className="input-exec"
                        />
                      </div>

                      {/* Official Email */}
                      <div className="sm:col-span-4">
                        <label className="label-exec">
                          Official Corporate Email <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="email"
                          {...register("officialEmail")}
                          placeholder="name@enterprise.com"
                          className={cn("input-exec", errors.officialEmail && "input-exec-error")}
                        />
                        {errors.officialEmail && <p className="text-rose-400 text-[11px] mt-1">{errors.officialEmail.message}</p>}
                      </div>

                      {/* Mobile / WhatsApp */}
                      <div className="sm:col-span-4">
                        <label className="label-exec">
                          Mobile (WhatsApp Preferred) <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="tel"
                          {...register("mobile")}
                          placeholder="+91 98765 43210"
                          className={cn("input-exec", errors.mobile && "input-exec-error")}
                        />
                        {errors.mobile && <p className="text-rose-400 text-[11px] mt-1">{errors.mobile.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Enterprise & Boardroom Credentials */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-800">
                      <span className="text-sm font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded">
                        02
                      </span>
                      <h3 className="text-base font-bold uppercase tracking-wider text-white">
                        Enterprise &amp; Governance Credentials
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Organization */}
                      <div>
                        <label className="label-exec">
                          Enterprise / Organization <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("organization")}
                          placeholder="Enter your enterprise name"
                          className={cn("input-exec", errors.organization && "input-exec-error")}
                        />
                        {errors.organization && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.organization.message}</p>}
                      </div>

                      {/* Designation */}
                      <div>
                        <label className="label-exec">
                          Official Designation <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("designation")}
                          placeholder="e.g. Chief Information Officer, CISO, CTO"
                          className={cn("input-exec", errors.designation && "input-exec-error")}
                        />
                        {errors.designation && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.designation.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* LinkedIn */}
                      <div>
                        <label className="label-exec">
                          LinkedIn Profile URL (or &apos;NA&apos;) <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("linkedin")}
                          placeholder="https://linkedin.com/in/profile or NA"
                          className={cn("input-exec", errors.linkedin && "input-exec-error")}
                        />
                        {errors.linkedin && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.linkedin.message}</p>}
                      </div>

                      {/* Organization Website */}
                      <div>
                        <label className="label-exec">
                          Enterprise Website
                        </label>
                        <input
                          type="text"
                          {...register("organizationWebsite")}
                          placeholder="https://enterprise.com"
                          className="input-exec"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Board Experience */}
                      <div>
                        <label className="label-exec">
                          Board Interaction Experience
                        </label>
                        <select
                          {...register("boardExperience")}
                          className="input-exec"
                        >
                          <option value="">Select Board Experience</option>
                          <option value="Extensive (Regular Board Presenter / Member)">
                            Extensive (Regular Board Presenter / Member)
                          </option>
                          <option value="Moderate (Quarterly Risk/Audit Committee)">
                            Moderate (Quarterly Risk/Audit Committee)
                          </option>
                          <option value="Occasional">Occasional</option>
                          <option value="None">None</option>
                        </select>
                      </div>

                      {/* Leadership Experience */}
                      <div>
                        <label className="label-exec">
                          Leadership Experience (Years)
                        </label>
                        <input
                          type="text"
                          {...register("leadershipExperience")}
                          placeholder="e.g. 15+"
                          className="input-exec"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Chapter & Geographic Alignment */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-800">
                      <span className="text-sm font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded">
                        03
                      </span>
                      <h3 className="text-base font-bold uppercase tracking-wider text-white">
                        Chapter &amp; Regional Alignment
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                      {/* Country */}
                      <div>
                        <label className="label-exec">
                          Country <span className="text-rose-400">*</span>
                        </label>
                        <select
                          {...register("country")}
                          className={cn("input-exec", errors.country && "input-exec-error")}
                        >
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {errors.country && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.country.message}</p>}
                      </div>

                      {/* State */}
                      <div>
                        <label className="label-exec">
                          State / Province <span className="text-rose-400">*</span>
                        </label>
                        <select
                          {...register("state")}
                          disabled={!selectedCountry || states.length === 0}
                          className={cn("input-exec", errors.state && "input-exec-error")}
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
                        {errors.state && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.state.message}</p>}
                      </div>

                      {/* City */}
                      <div>
                        <label className="label-exec">
                          City / Chapter <span className="text-rose-400">*</span>
                        </label>
                        <select
                          {...register("city")}
                          disabled={!selectedState || cities.length === 0}
                          className={cn("input-exec", errors.city && "input-exec-error")}
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
                        {errors.city && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.city.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: Strategic Interests & Contribution */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-800">
                      <span className="text-sm font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded">
                        04
                      </span>
                      <h3 className="text-base font-bold uppercase tracking-wider text-white">
                        Strategic Focus &amp; Peer Contribution
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Industry */}
                      <div>
                        <label className="label-exec">
                          Industry Sector <span className="text-rose-400">*</span>
                        </label>
                        <select
                          {...register("industry")}
                          className={cn("input-exec", errors.industry && "input-exec-error")}
                        >
                          <option value="">Select Industry</option>
                          <option value="Banking, Financial Services & Insurance (BFSI)">
                            Banking, Financial Services &amp; Insurance (BFSI)
                          </option>
                          <option value="Information Technology & ITES">
                            Information Technology &amp; ITES
                          </option>
                          <option value="Manufacturing & Industrial Automation">
                            Manufacturing &amp; Industrial Automation
                          </option>
                          <option value="Telecom & 5G Infrastructure">
                            Telecom &amp; 5G Infrastructure
                          </option>
                          <option value="Healthcare & Life Sciences">
                            Healthcare &amp; Life Sciences
                          </option>
                          <option value="Aerospace & Defense">Aerospace &amp; Defense</option>
                          <option value="Retail & E-commerce">Retail &amp; E-commerce</option>
                          <option value="Consulting & Advisory">Consulting &amp; Advisory</option>
                          <option value="Energy, Oil & Utilities">Energy, Oil &amp; Utilities</option>
                          <option value="Other Enterprise Sector">Other Enterprise Sector</option>
                        </select>
                        {errors.industry && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.industry.message}</p>}
                      </div>

                      {/* Strategic Areas of Interest */}
                      <div>
                        <label className="label-exec">
                          Strategic Focus Areas <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("strategicInterests")}
                          placeholder="e.g. AI Governance, Cyber Defense, Cloud Sovereignty"
                          className={cn("input-exec", errors.strategicInterests && "input-exec-error")}
                        />
                        {errors.strategicInterests && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.strategicInterests.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Would like to contribute via */}
                      <div>
                        <label className="label-exec">
                          Would You Like to Contribute Via <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("contributeVia")}
                          placeholder="e.g. Peer Mentorship, Roundtables, AI Labs"
                          className={cn("input-exec", errors.contributeVia && "input-exec-error")}
                        />
                        {errors.contributeVia && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.contributeVia.message}</p>}
                      </div>

                      {/* Preferred Mode of Engagement */}
                      <div>
                        <label className="label-exec">
                          Preferred Engagement Mode <span className="text-rose-400">*</span>
                        </label>
                        <select
                          {...register("preferredModeOfEngagement")}
                          className={cn("input-exec", errors.preferredModeOfEngagement && "input-exec-error")}
                        >
                          <option value="">Select Engagement Mode</option>
                          <option value="In-person Physical Conclaves & Roundtables">
                            In-person Physical Conclaves &amp; Roundtables
                          </option>
                          <option value="Virtual Strategic Pods & Webinars">
                            Virtual Strategic Pods &amp; Webinars
                          </option>
                          <option value="Hybrid (Both Physical and Virtual)">
                            Hybrid (Both Physical and Virtual)
                          </option>
                        </select>
                        {errors.preferredModeOfEngagement && (
                          <p className="text-rose-400 text-xs sm:text-sm mt-1">
                            {errors.preferredModeOfEngagement.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* How did you hear */}
                      <div>
                        <label className="label-exec">
                          How did you hear about us? <span className="text-rose-400">*</span>
                        </label>
                        <select
                          {...register("howDidYouHear")}
                          className={cn("input-exec", errors.howDidYouHear && "input-exec-error")}
                        >
                          <option value="">Select Source</option>
                          <option value="Invited by Founding CXO / Advisor">
                            Invited by Founding CXO / Advisor
                          </option>
                          <option value="Referred by Peer CXO Member">
                            Referred by Peer CXO Member
                          </option>
                          <option value="LinkedIn Leadership Community">
                            LinkedIn Leadership Community
                          </option>
                          <option value="Industry Conclave / Event Highlight">
                            Industry Conclave / Event Highlight
                          </option>
                          <option value="Digital CXOS Podcast Series">
                            Digital CXOS Podcast Series
                          </option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.howDidYouHear && (
                          <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.howDidYouHear.message}</p>
                        )}
                      </div>

                      {/* Other CXO networks */}
                      <div>
                        <label className="label-exec">
                          Are you part of any other CXO networks?
                        </label>
                        <select
                          {...register("otherCxoNetworks")}
                          className="input-exec"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: Verification & Declarations */}
                  <div className="space-y-4 pt-4 border-t border-neutral-800">
                    <label className="flex items-start gap-3.5 cursor-pointer group p-3 rounded-lg hover:bg-neutral-800/40 transition-colors">
                      <input
                        type="checkbox"
                        {...register("termsConsent")}
                        className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[#C9A227] accent-[#C9A227] focus:ring-[#C9A227] shrink-0"
                      />
                      <span className="text-sm sm:text-base text-neutral-300 group-hover:text-white leading-relaxed">
                        I have read and agree to the <a href="/terms" target="_blank" className="text-[#C9A227] underline">Terms and Conditions</a> &amp; <a href="/privacy-policy" target="_blank" className="text-[#C9A227] underline">Privacy Policy</a>.
                      </span>
                    </label>
                    {errors.termsConsent && (
                      <p className="text-rose-400 text-xs sm:text-sm pl-8">{errors.termsConsent.message}</p>
                    )}

                    <label className="flex items-start gap-3.5 cursor-pointer group p-3 rounded-lg hover:bg-neutral-800/40 transition-colors">
                      <input
                        type="checkbox"
                        {...register("accuracyConsent")}
                        className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[#C9A227] accent-[#C9A227] focus:ring-[#C9A227] shrink-0"
                      />
                      <span className="text-sm sm:text-base text-neutral-300 group-hover:text-white leading-relaxed">
                        I confirm that the information provided is accurate and consent to its use for committee vetting in accordance with the Digital CXOS Governance Policy.
                      </span>
                    </label>
                    {errors.accuracyConsent && (
                      <p className="text-rose-400 text-xs sm:text-sm pl-8">{errors.accuracyConsent.message}</p>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-6 border-t border-neutral-800 space-y-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-10 py-4 rounded-lg font-bold text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#C9A227] hover:brightness-110 text-neutral-950 shadow-[0_4px_20px_rgba(201,162,39,0.35)] hover:shadow-[0_4px_28px_rgba(201,162,39,0.55)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                          <span>Processing Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit CXO Application</span>
                          <span className="font-bold text-base leading-none">›</span>
                        </>
                      )}
                    </button>

                    {/* Sovereign Tricolour Accent Line */}
                    <div className="w-32 h-1 rounded-full flex overflow-hidden">
                      <div className="w-1/3 bg-[#FF9933]" />
                      <div className="w-1/3 bg-white" />
                      <div className="w-1/3 bg-[#138808]" />
                    </div>
                  </div>
                </form>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
