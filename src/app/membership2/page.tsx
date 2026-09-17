"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cxoMembershipSchema, CxoMembershipFormData } from "@/lib/schemas/cxoSchema";
import { PageHero } from "@/components/layout/PageHero";
import { getCountries, getStatesForCountry, getCitiesForState } from "@/lib/data/geoData";
import { Send, CheckCircle, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-[#060B18]">
      <PageHero
        title="CXO Membership"
        subtitle="Join India's premier executive peer network shaping enterprise technology, cyber defense, and digital transformation."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Join Us", href: "/membership2" },
          { label: "CXOS Signup" }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {submittedSuccess ? (
          <div className="rounded-3xl glass-panel-gold p-8 sm:p-12 border border-amber-400/40 text-center space-y-6 animate-fade-in shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif heading-gold">
              CXO Membership Application Received
            </h3>

            <p className="text-base text-slate-200 max-w-xl mx-auto leading-relaxed">
              Thank you for submitting your application to Digital CXOS. Our Executive Advisory Board reviews all submissions to verify credentials. Our secretariat will reach out to you within 48 business hours.
            </p>

            <div className="pt-4">
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-amber-300 border border-amber-400/30 hover:bg-slate-800 transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl glass-panel p-6 sm:p-10 lg:p-12 border border-white/10 shadow-2xl space-y-8">
            {/* Header info */}
            <div className="border-b border-white/10 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
                  Membership Intake
                </span>
                <span className="text-xs text-rose-400 font-medium flex items-center gap-1">
                  <span>* Indicates Required Fields</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Exclusively open to CIOs, CISOs, CTOs, CDOs, and executive technology leaders.
              </p>
            </div>

            {serverError && (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Row 1: Title, First Name, Middle Name, Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Title <span className="text-rose-400">*</span>
                  </label>
                  <select
                    {...register("title")}
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.title ? "border-rose-500" : "border-white/10"
                    )}
                  >
                    <option value="">Select Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  {errors.title && <p className="text-rose-400 text-[11px] mt-1">{errors.title.message}</p>}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    First Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    placeholder="Enter first name"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.firstName ? "border-rose-500" : "border-white/10"
                    )}
                  />
                  {errors.firstName && <p className="text-rose-400 text-[11px] mt-1">{errors.firstName.message}</p>}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    {...register("middleName")}
                    placeholder="Middle name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    placeholder="Last name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Official Email & Mobile (WhatsApp preferred) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("officialEmail")}
                    placeholder="name@organization.com"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.officialEmail ? "border-rose-500" : "border-white/10"
                    )}
                  />
                  {errors.officialEmail && <p className="text-rose-400 text-[11px] mt-1">{errors.officialEmail.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mobile (WhatsApp preferred) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("mobile")}
                    placeholder="+91 98765 43210"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.mobile ? "border-rose-500" : "border-white/10"
                    )}
                  />
                  {errors.mobile && <p className="text-rose-400 text-[11px] mt-1">{errors.mobile.message}</p>}
                </div>
              </div>

              {/* Row 3: Organization & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Organization <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("organization")}
                    placeholder="Enter your enterprise name"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.organization ? "border-rose-500" : "border-white/10"
                    )}
                  />
                  {errors.organization && <p className="text-rose-400 text-[11px] mt-1">{errors.organization.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Designation <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("designation")}
                    placeholder="e.g. CIO, CISO, CTO, CDO, VP Technology"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.designation ? "border-rose-500" : "border-white/10"
                    )}
                  />
                  {errors.designation && <p className="text-rose-400 text-[11px] mt-1">{errors.designation.message}</p>}
                </div>
              </div>

              {/* Cascading Country -> State -> City Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Choose Country <span className="text-rose-400">*</span>
                  </label>
                  <select
                    {...register("country")}
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.country ? "border-rose-500" : "border-white/10"
                    )}
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Choose State <span className="text-rose-400">*</span>
                  </label>
                  <select
                    {...register("state")}
                    disabled={!selectedCountry || states.length === 0}
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50",
                      errors.state ? "border-rose-500" : "border-white/10"
                    )}
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Choose City <span className="text-rose-400">*</span>
                  </label>
                  <select
                    {...register("city")}
                    disabled={!selectedState || cities.length === 0}
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50",
                      errors.city ? "border-rose-500" : "border-white/10"
                    )}
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

              {/* Row 4: LinkedIn & Organization Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    LinkedIn (or &apos;NA&apos;) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("linkedin")}
                    placeholder="https://linkedin.com/in/yourprofile or NA"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.linkedin ? "border-rose-500" : "border-white/10"
                    )}
                  />
                  {errors.linkedin && <p className="text-rose-400 text-[11px] mt-1">{errors.linkedin.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Organization Website
                  </label>
                  <input
                    type="text"
                    {...register("organizationWebsite")}
                    placeholder="https://organization.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Row 5: Board Interaction Experience & Leadership Experience (Years) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Board Interaction Experience
                  </label>
                  <select
                    {...register("boardExperience")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors"
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

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Leadership Experience (Years)
                  </label>
                  <input
                    type="text"
                    {...register("leadershipExperience")}
                    placeholder="e.g. 15+"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Row 6: Would you like to contribute via, Strategic Areas of Interest, Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Would you like to contribute via <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("contributeVia")}
                    placeholder="e.g. Mentorship, Roundtables, AI Labs"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.contributeVia ? "border-rose-500" : "border-white/10"
                    )}
                  />
                  {errors.contributeVia && <p className="text-rose-400 text-[11px] mt-1">{errors.contributeVia.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Strategic Areas of Interest <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("strategicInterests")}
                    placeholder="e.g. Cyber Defense, GenAI, Cloud"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.strategicInterests ? "border-rose-500" : "border-white/10"
                    )}
                  />
                  {errors.strategicInterests && <p className="text-rose-400 text-[11px] mt-1">{errors.strategicInterests.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Industry <span className="text-rose-400">*</span>
                  </label>
                  <select
                    {...register("industry")}
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.industry ? "border-rose-500" : "border-white/10"
                    )}
                  >
                    <option value="">Select Industry</option>
                    <option value="Banking, Financial Services & Insurance (BFSI)">
                      Banking, Financial Services & Insurance (BFSI)
                    </option>
                    <option value="Information Technology & ITES">
                      Information Technology & ITES
                    </option>
                    <option value="Manufacturing & Industrial Automation">
                      Manufacturing & Industrial Automation
                    </option>
                    <option value="Telecom & 5G Infrastructure">
                      Telecom & 5G Infrastructure
                    </option>
                    <option value="Healthcare & Life Sciences">
                      Healthcare & Life Sciences
                    </option>
                    <option value="Aerospace & Defense">Aerospace & Defense</option>
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                    <option value="Consulting & Advisory">Consulting & Advisory</option>
                    <option value="Energy, Oil & Utilities">Energy, Oil & Utilities</option>
                    <option value="Other Enterprise Sector">Other Enterprise Sector</option>
                  </select>
                  {errors.industry && <p className="text-rose-400 text-[11px] mt-1">{errors.industry.message}</p>}
                </div>
              </div>

              {/* Row 7: Preferred Mode of Engagement, How did you hear, Other CXO networks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Mode of Engagement <span className="text-rose-400">*</span>
                  </label>
                  <select
                    {...register("preferredModeOfEngagement")}
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.preferredModeOfEngagement ? "border-rose-500" : "border-white/10"
                    )}
                  >
                    <option value="">Select Engagement Mode</option>
                    <option value="In-person Physical Conclaves & Roundtables">
                      In-person Physical Conclaves & Roundtables
                    </option>
                    <option value="Virtual Strategic Pods & Webinars">
                      Virtual Strategic Pods & Webinars
                    </option>
                    <option value="Hybrid (Both Physical and Virtual)">
                      Hybrid (Both Physical and Virtual)
                    </option>
                  </select>
                  {errors.preferredModeOfEngagement && (
                    <p className="text-rose-400 text-[11px] mt-1">
                      {errors.preferredModeOfEngagement.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    How did you hear about us? <span className="text-rose-400">*</span>
                  </label>
                  <select
                    {...register("howDidYouHear")}
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.howDidYouHear ? "border-rose-500" : "border-white/10"
                    )}
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
                    <p className="text-rose-400 text-[11px] mt-1">{errors.howDidYouHear.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Are you part of any other CXO networks?
                  </label>
                  <select
                    {...register("otherCxoNetworks")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {/* Verbatim Consent Checkboxes */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("termsConsent")}
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 shrink-0"
                  />
                  <span className="text-xs text-slate-300 group-hover:text-white leading-relaxed">
                    I have read and agree to the Terms and Conditions &amp; Privacy Policy. (✓)
                  </span>
                </label>
                {errors.termsConsent && (
                  <p className="text-rose-400 text-[11px] pl-7">{errors.termsConsent.message}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("accuracyConsent")}
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 shrink-0"
                  />
                  <span className="text-xs text-slate-300 group-hover:text-white leading-relaxed">
                    I confirm that the information provided is accurate and consent to its use in accordance with the Terms and Conditions &amp; Privacy Policy. (✓)
                  </span>
                </label>
                {errors.accuracyConsent && (
                  <p className="text-rose-400 text-[11px] pl-7">{errors.accuracyConsent.message}</p>
                )}
              </div>

              {/* Green Submit Button with Paper Plane Icon */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-sm tracking-wider uppercase bg-[#138808] hover:bg-[#0f6b06] text-white shadow-[0_0_25px_rgba(19,136,8,0.4)] hover:shadow-[0_0_35px_rgba(19,136,8,0.6)] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting Application..." : "➤ SUBMIT"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
