"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerMembershipSchema, PartnerMembershipFormData } from "@/lib/schemas/partnerSchema";
import { PageHero } from "@/components/layout/PageHero";
import { getCountries, getStatesForCountry, getCitiesForState } from "@/lib/data/geoData";
import { Send, CheckCircle, AlertCircle, Handshake, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const engagementOptions = [
  "Annual Strategic Sponsorship",
  "Event-Based Brand Engagement",
  "Content Marketing Partnership",
  "Podcast Thought Leadership",
  "Sector-Focused Campaigns",
  "City-Specific Initiatives",
  "Executive Roundtable Series",
  "Digital Awareness Campaigns",
  "Webinar Co-Hosting Opportunity",
  "Social Impact Programs",
  "CXO Networking Support",
  "Others"
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
    <div className="min-h-screen bg-[#060B18]">
      <PageHero
        title="Partners membership"
        subtitle="Collaborate with India's highest-caliber CXO decision-makers through strategic sponsorships, executive roundtables, and co-branded thought leadership."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Join Us", href: "/partnership2" },
          { label: "Partners Signup" }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {submittedSuccess ? (
          <div className="rounded-3xl glass-panel-gold p-8 sm:p-12 border border-amber-400/40 text-center space-y-6 animate-fade-in shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif heading-gold">
              Partner Inquiry Received
            </h3>

            <p className="text-base text-slate-200 max-w-xl mx-auto leading-relaxed">
              Thank you for expressing interest in partnering with Digital CXOS. Our Strategic Alliances team will evaluate your chosen engagement tracks and schedule an introductory briefing within 48 business hours.
            </p>

            <div className="pt-4">
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-amber-300 border border-amber-400/30 hover:bg-slate-800 transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl glass-panel p-6 sm:p-10 lg:p-12 border border-white/10 shadow-2xl space-y-8">
            <div className="border-b border-white/10 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
                  Partnership Enrollment
                </span>
                <span className="text-xs text-rose-400 font-medium flex items-center gap-1">
                  <span>* Indicates Required Fields</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Designed for global technology enterprises, consulting providers, and solution partners looking to engage ethically with CXO decision-makers.
              </p>
            </div>

            {serverError && (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Row 1: Title, First Name, Last Name */}
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

                <div className="sm:col-span-4">
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

                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Last Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    placeholder="Enter last name"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.lastName ? "border-rose-500" : "border-white/10"
                    )}
                  />
                  {errors.lastName && <p className="text-rose-400 text-[11px] mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Row 2: Business Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Business Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="partner@organization.com"
                    className={cn(
                      "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                      errors.email ? "border-rose-500" : "border-white/10"
                    )}
                  />
                  {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mobile / Direct Phone <span className="text-rose-400">*</span>
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
                    placeholder="Enter partner company name"
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
                    placeholder="e.g. VP Strategic Partnerships, Director"
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

              {/* Choose Presence in India */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Choose Presence in India <span className="text-rose-400">*</span>
                </label>
                <select
                  {...register("presenceInIndia")}
                  className={cn(
                    "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors max-w-sm",
                    errors.presenceInIndia ? "border-rose-500" : "border-white/10"
                  )}
                >
                  <option value="">Select Presence</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Others">Others</option>
                </select>
                {errors.presenceInIndia && (
                  <p className="text-rose-400 text-[11px] mt-1">{errors.presenceInIndia.message}</p>
                )}
              </div>

              {/* Multi-Select: Preferred Engagement Type(s) */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Engagement Type(s) <span className="text-rose-400">*</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Select all tracks of interest (at least one required):
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {engagementOptions.map((opt) => {
                    const isChecked = selectedTypes.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleEngagementType(opt)}
                        className={cn(
                          "px-3.5 py-2.5 rounded-xl text-xs text-left font-medium transition-all duration-200 flex items-center justify-between border cursor-pointer",
                          isChecked
                            ? "bg-amber-400/20 text-amber-300 border-amber-400/60 shadow-[0_0_12px_rgba(230,202,101,0.2)] font-semibold"
                            : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
                        )}
                      >
                        <span className="truncate pr-2">{opt}</span>
                        <span
                          className={cn(
                            "w-4 h-4 rounded flex items-center justify-center shrink-0 border text-[10px]",
                            isChecked
                              ? "bg-amber-400 border-amber-400 text-slate-950 font-bold"
                              : "border-slate-600 bg-slate-950"
                          )}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.preferredEngagementTypes && (
                  <p className="text-rose-400 text-[11px] mt-1">
                    {errors.preferredEngagementTypes.message}
                  </p>
                )}
              </div>

              {/* Verbatim Consent Checkboxes */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("professionalConductConsent")}
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 shrink-0"
                  />
                  <span className="text-xs text-slate-300 group-hover:text-white leading-relaxed">
                    I agree to engage professionally and uphold ethical conduct when collaborating with Digital CXOs, the CXO fraternity and authorized vendors. (✓)
                  </span>
                </label>
                {errors.professionalConductConsent && (
                  <p className="text-rose-400 text-[11px] pl-7">
                    {errors.professionalConductConsent.message}
                  </p>
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("privacyConsent")}
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 shrink-0"
                  />
                  <span className="text-xs text-slate-300 group-hover:text-white leading-relaxed">
                    By submitting this form, I consent to the collection and use of my business and contact information as described in the Terms and Conditions &amp; Privacy Policy, for communication and collaboration with Digital CXOs, the CXO fraternity and authorized vendors. (✓)
                  </span>
                </label>
                {errors.privacyConsent && (
                  <p className="text-rose-400 text-[11px] pl-7">{errors.privacyConsent.message}</p>
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
                  <span>{isSubmitting ? "Submitting Inquiry..." : "➤ SUBMIT"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
