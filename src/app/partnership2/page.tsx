"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerMembershipSchema, PartnerMembershipFormData } from "@/lib/schemas/partnerSchema";
import { PageHero } from "@/components/layout/PageHero";
import { getCountries, getStatesForCountry, getCitiesForState } from "@/lib/data/geoData";
import { 
  CheckCircle, 
  AlertCircle, 
  Handshake, 
  Check, 
  Sparkles, 
  Building2, 
  Mail, 
  Users, 
  Layers, 
  Radio, 
  ShieldCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";

const ENGAGEMENT_OPTIONS = [
  { id: "Annual Strategic Sponsorship", title: "Annual Strategic Sponsorship", desc: "Year-round brand positioning across all flagship summits and roundtables" },
  { id: "Event-Based Brand Engagement", title: "Event-Based Brand Engagement", desc: "Keynote sponsorship and exclusive branding at flagship conclaves" },
  { id: "Content Marketing Partnership", title: "Content Marketing Partnership", desc: "Co-authored research reports, whitepapers and executive digests" },
  { id: "Podcast Thought Leadership", title: "Podcast Thought Leadership", desc: "Spotlight interview on Digital CXOS Masterclass video series" },
  { id: "Executive Roundtable Series", title: "Executive Roundtable Series", desc: "Exclusive closed-door curated roundtables with target CXO peers" },
  { id: "Sector-Focused Campaigns", title: "Sector-Focused Campaigns", desc: "Targeted outreach across BFSI, ITES, Healthcare or Aerospace" },
  { id: "City-Specific Initiatives", title: "City-Specific Initiatives", desc: "Chapter-level engagement in Delhi NCR, Mumbai, Bangalore or Chennai" },
  { id: "Webinar Co-Hosting Opportunity", title: "Webinar Co-Hosting Opportunity", desc: "Virtual strategic pods with interactive Q&A and thought leadership" },
  { id: "Digital Awareness Campaigns", title: "Digital Awareness Campaigns", desc: "Multi-channel amplification across CXO leadership channels" },
  { id: "Social Impact Programs", title: "Social Impact Programs", desc: "Purpose-driven initiatives empowering digital education and equity" },
  { id: "CXO Networking Support", title: "CXO Networking Support", desc: "Facilitated private introductions with senior technology decision-makers" },
  { id: "Others", title: "Bespoke Collaboration", desc: "Customized strategic engagement designed around your enterprise goals" }
];

export default function PartnerMembershipPage() {
  const [countries] = useState<string[]>(getCountries());
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
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
  } = useForm<PartnerMembershipFormData>({
    resolver: zodResolver(partnerMembershipSchema),
    defaultValues: {
      title: undefined,
      country: "",
      state: "",
      city: "",
      preferredEngagementTypes: [],
      professionalConductConsent: false,
      privacyConsent: false
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

  const toggleEngagementType = (type: string) => {
    let updated: string[];
    if (selectedTypes.includes(type)) {
      updated = selectedTypes.filter((t) => t !== type);
    } else {
      updated = [...selectedTypes, type];
    }
    setSelectedTypes(updated);
    setValue("preferredEngagementTypes", updated, { shouldValidate: true });
  };

  const onSubmit = async (data: PartnerMembershipFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "partner", ...data })
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Submission failed. Please check form fields.");
      }

      setSubmittedSuccess(true);
      reset();
      setSelectedTypes([]);
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
        title="Enterprise Partnership Inquiry"
        subtitle="Collaborate with India's highest-caliber CXO decision-makers through strategic sponsorships, executive roundtables, and co-branded thought leadership."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Partnership", href: "/partnership2" },
          { label: "Enterprise Intake" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {submittedSuccess ? (
          <div className="max-w-2xl mx-auto bg-[#1C1C1C] border border-[#C9A227]/40 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
              <CheckCircle className="w-10 h-10" />
            </div>

            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#C9A227] px-3 py-1 rounded bg-[#C9A227]/10 border border-[#C9A227]/20">
              Inquiry Registered
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Partner Inquiry Received
            </h3>

            <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Thank you for expressing interest in partnering with Digital CXOS. Our Strategic Alliances team will evaluate your chosen engagement tracks and schedule an introductory briefing within <span className="text-white font-semibold">48 business hours</span>.
            </p>

            <div className="pt-4 border-t border-neutral-800 flex justify-center">
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-[#C9A227] hover:text-[#C9A227] transition-all"
              >
                Submit Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Partnership Pillars & Reach */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              <div className="bg-[#1C1C1C] rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-neutral-700/80 text-[11px] font-semibold tracking-wider uppercase text-[#C9A227]">
                    <Handshake className="w-3.5 h-3.5" />
                    <span>Strategic Collaboration</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Why Partner with Digital CXOS?
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Direct access to boardroom technology influencers commanding India&apos;s largest enterprise IT and cybersecurity budgets.
                  </p>
                </div>

                <div className="border-t border-neutral-800 pt-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
                    Partnership Value Pillars
                  </h4>

                  <div className="space-y-3.5 text-xs text-neutral-300">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Targeted CXO Engagement</p>
                        <p className="text-neutral-400 text-[11px]">Direct dialogue with CIOs, CISOs, and CTOs in high-trust closed environments.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        <Radio className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Executive Thought Leadership</p>
                        <p className="text-neutral-400 text-[11px]">Keynote sessions, masterclass video podcasts, and joint whitepaper publishing.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Cross-Sector Reach</p>
                        <p className="text-neutral-400 text-[11px]">Presence across BFSI, ITES, Telecom, HealthTech, Aerospace, and Defense.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4 flex items-center gap-2.5 text-xs text-neutral-400">
                  <Mail className="w-4 h-4 text-[#C9A227]" />
                  <span>Strategic Alliances: <strong className="text-neutral-200">contact@digitalcxos.com</strong></span>
                </div>
              </div>

              <div className="bg-[#181818] rounded-xl p-5 border border-neutral-800 flex items-start gap-3 text-xs text-neutral-400">
                <ShieldCheck className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  All enterprise partnerships are curated to align with executive ethics and Chatham House confidentiality standards.
                </p>
              </div>
            </aside>

            {/* Right Column: Structured Partner Form */}
            <main className="lg:col-span-8">
              <div className="bg-[#1C1C1C] rounded-2xl p-6 sm:p-10 border border-neutral-800 shadow-2xl space-y-8">
                <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white">
                      Partner Inquiry Form
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Select your preferred collaboration tracks and submit your enterprise credentials.
                    </p>
                  </div>
                  <span className="text-xs text-[#C9A227] font-semibold bg-[#C9A227]/10 px-3 py-1 rounded border border-[#C9A227]/20 self-start sm:self-auto">
                    * Required Fields
                  </span>
                </div>

                {serverError && (
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-200 text-xs flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                    <span>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  {/* SECTION 1: Enterprise Representative */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-800">
                      <span className="text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded">
                        01
                      </span>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                        Representative Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
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

                      <div className="sm:col-span-5">
                        <label className="label-exec">
                          First Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("firstName")}
                          placeholder="First name"
                          className={cn("input-exec", errors.firstName && "input-exec-error")}
                        />
                        {errors.firstName && <p className="text-rose-400 text-[11px] mt-1">{errors.firstName.message}</p>}
                      </div>

                      <div className="sm:col-span-4">
                        <label className="label-exec">
                          Last Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("lastName")}
                          placeholder="Last name"
                          className={cn("input-exec", errors.lastName && "input-exec-error")}
                        />
                        {errors.lastName && <p className="text-rose-400 text-[11px] mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label-exec">
                          Business Email <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="email"
                          {...register("email")}
                          placeholder="name@company.com"
                          className={cn("input-exec", errors.email && "input-exec-error")}
                        />
                        {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email.message}</p>}
                      </div>

                      <div>
                        <label className="label-exec">
                          Direct Mobile Number <span className="text-rose-400">*</span>
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

                  {/* SECTION 2: Organization Profile */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-800">
                      <span className="text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded">
                        02
                      </span>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                        Organization Profile &amp; Location
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label-exec">
                          Organization / Company Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("organization")}
                          placeholder="Enterprise name"
                          className={cn("input-exec", errors.organization && "input-exec-error")}
                        />
                        {errors.organization && <p className="text-rose-400 text-[11px] mt-1">{errors.organization.message}</p>}
                      </div>

                      <div>
                        <label className="label-exec">
                          Your Designation <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("designation")}
                          placeholder="e.g. VP Marketing, Head of Alliances"
                          className={cn("input-exec", errors.designation && "input-exec-error")}
                        />
                        {errors.designation && <p className="text-rose-400 text-[11px] mt-1">{errors.designation.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-xl bg-neutral-900/60 border border-neutral-800">
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
                        {errors.country && <p className="text-rose-400 text-[11px] mt-1">{errors.country.message}</p>}
                      </div>

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
                        {errors.state && <p className="text-rose-400 text-[11px] mt-1">{errors.state.message}</p>}
                      </div>

                      <div>
                        <label className="label-exec">
                          City <span className="text-rose-400">*</span>
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
                        {errors.city && <p className="text-rose-400 text-[11px] mt-1">{errors.city.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="label-exec">
                        Presence in India <span className="text-rose-400">*</span>
                      </label>
                      <select
                        {...register("presenceInIndia")}
                        className={cn("input-exec max-w-xs", errors.presenceInIndia && "input-exec-error")}
                      >
                        <option value="">Select Presence</option>
                        <option value="Yes">Yes (Registered Entity in India)</option>
                        <option value="No">No (International Headquarters)</option>
                        <option value="Others">Others / Exploring Entry</option>
                      </select>
                      {errors.presenceInIndia && (
                        <p className="text-rose-400 text-[11px] mt-1">{errors.presenceInIndia.message}</p>
                      )}
                    </div>
                  </div>

                  {/* SECTION 3: Preferred Engagement Tracks */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded">
                          03
                        </span>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                          Preferred Engagement Tracks <span className="text-rose-400">*</span>
                        </h3>
                      </div>
                      <span className="text-[11px] text-neutral-400">Select one or more tracks</span>
                    </div>

                    {errors.preferredEngagementTypes && (
                      <p className="text-rose-400 text-xs">{errors.preferredEngagementTypes.message}</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ENGAGEMENT_OPTIONS.map((opt) => {
                        const isSelected = selectedTypes.includes(opt.id);
                        return (
                          <div
                            key={opt.id}
                            onClick={() => toggleEngagementType(opt.id)}
                            className={cn(
                              "p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3 text-left select-none",
                              isSelected
                                ? "bg-[#C9A227]/10 border-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.15)]"
                                : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
                            )}
                          >
                            <div
                              className={cn(
                                "w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                                isSelected
                                  ? "bg-[#C9A227] border-[#C9A227] text-neutral-950"
                                  : "border-neutral-600 bg-neutral-800"
                              )}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div className="space-y-0.5">
                              <p className={cn("text-xs font-bold", isSelected ? "text-[#C9A227]" : "text-white")}>
                                {opt.title}
                              </p>
                              <p className="text-[11px] text-neutral-400 leading-relaxed">
                                {opt.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION 4: Professional Undertaking & Consent */}
                  <div className="space-y-4 pt-4 border-t border-neutral-800">
                    <label className="flex items-start gap-3.5 cursor-pointer group p-3 rounded-lg hover:bg-neutral-800/40 transition-colors">
                      <input
                        type="checkbox"
                        {...register("professionalConductConsent")}
                        className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[#C9A227] accent-[#C9A227] focus:ring-[#C9A227] shrink-0"
                      />
                      <span className="text-xs text-neutral-300 group-hover:text-white leading-relaxed">
                        We agree to engage professionally and uphold ethical conduct in line with Digital CXOS community standards.
                      </span>
                    </label>
                    {errors.professionalConductConsent && (
                      <p className="text-rose-400 text-[11px] pl-8">{errors.professionalConductConsent.message}</p>
                    )}

                    <label className="flex items-start gap-3.5 cursor-pointer group p-3 rounded-lg hover:bg-neutral-800/40 transition-colors">
                      <input
                        type="checkbox"
                        {...register("privacyConsent")}
                        className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[#C9A227] accent-[#C9A227] focus:ring-[#C9A227] shrink-0"
                      />
                      <span className="text-xs text-neutral-300 group-hover:text-white leading-relaxed">
                        We consent to the collection and use of corporate contact details for strategic alliance coordination under the <a href="/privacy-policy" target="_blank" className="text-[#C9A227] underline">Privacy Policy</a>.
                      </span>
                    </label>
                    {errors.privacyConsent && (
                      <p className="text-rose-400 text-[11px] pl-8">{errors.privacyConsent.message}</p>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-6 border-t border-neutral-800 space-y-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-10 py-4 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#C9A227] hover:brightness-110 text-neutral-950 shadow-[0_4px_20px_rgba(201,162,39,0.35)] hover:shadow-[0_4px_28px_rgba(201,162,39,0.55)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Partnership Inquiry</span>
                          <span className="font-bold text-base leading-none">›</span>
                        </>
                      )}
                    </button>

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
