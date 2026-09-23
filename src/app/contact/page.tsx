"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormData } from "@/lib/schemas/contactSchema";
import { PageHero } from "@/components/layout/PageHero";
import { MapPin, Mail, Send, CheckCircle, AlertCircle, ShieldCheck, Lock, Clock, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      title: undefined,
      message: "",
      honeypot: "",
      turnstileVerified: true
    }
  });

  const messageValue = watch("message") || "";
  const charCount = messageValue.length;

  const onSubmit = async (data: ContactFormData) => {
    // Check honeypot
    if (data.honeypot && data.honeypot.trim() !== "") {
      console.warn("Honeypot filled; discarding bot request");
      setSubmittedSuccess(true);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...data })
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to send message. Please try again.");
      }

      setSubmittedSuccess(true);
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-neutral-100">
      <PageHero
        title="Secretariat Contact"
        subtitle="Connect with the Digital CXOS leadership secretariat for executive inquiries, chapter access, and strategic partnerships."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Registered Office & Direct Details */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-[#1C1C1C] rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-neutral-700/80 text-[11px] font-semibold tracking-wider uppercase text-[#C9A227]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Executive Headquarters</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  Registered Secretariat
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800 pt-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Digital CXOS Private Limited</p>
                    <p className="text-neutral-400">Embassy Galaxy Business Park</p>
                    <p className="text-neutral-400">Tower-B, 1st Floor, A-44 &amp; 45, Sushil Marg,</p>
                    <p className="text-neutral-400">Sector 62, Noida – 201309, India</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#C9A227] shrink-0" />
                  <div>
                    <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
                      Official Secretariat
                    </p>
                    <a
                      href="mailto:contact@digitalcxos.com"
                      className="text-[#C9A227] hover:underline font-medium text-sm"
                    >
                      contact@digitalcxos.com
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-400 space-y-1">
                    <p className="font-semibold text-neutral-200">Office Hours &amp; Response SLA:</p>
                    <p>Monday to Friday: 09:30 AM – 06:30 PM IST</p>
                    <p>All executive inquiries receive a response within 24 to 48 business hours.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="bg-[#181818] rounded-xl p-5 border border-neutral-800 flex items-start gap-3 text-xs text-neutral-400">
              <Lock className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Communications are handled in strict adherence to Digital CXOS confidentiality protocols and India&apos;s DPDP data privacy standards.
              </p>
            </div>
          </aside>

          {/* Right Column: Contact Form */}
          <main className="lg:col-span-7">
            <div className="bg-[#1C1C1C] rounded-2xl p-6 sm:p-10 border border-neutral-800 shadow-2xl">
              {submittedSuccess ? (
                <div className="text-center py-10 space-y-5">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Message Dispatched Successfully
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you for contacting Digital CXOS Private Limited. Our secretariat team has received your message and will respond within 24 to 48 business hours.
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => setSubmittedSuccess(false)}
                      className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-[#C9A227] hover:text-[#C9A227] transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="border-b border-neutral-800 pb-4">
                    <h3 className="text-xl font-bold font-serif text-white">
                      Send an Executive Inquiry
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Direct inquiries to the Secretariat Advisory Board.
                    </p>
                  </div>

                  {serverError && (
                    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 text-rose-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Honeypot hidden field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="hp_field">Leave this field empty</label>
                    <input
                      id="hp_field"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("honeypot")}
                    />
                  </div>

                  {/* Title & Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-4">
                      <label className="label-exec">
                        Title <span className="text-rose-400">*</span>
                      </label>
                      <select
                        {...register("title")}
                        className={cn("input-exec", errors.title && "input-exec-error")}
                      >
                        <option value="">Title</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                      {errors.title && <p className="text-rose-400 text-[11px] mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="sm:col-span-8">
                      <label className="label-exec">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder="Enter your full name"
                        className={cn("input-exec", errors.name && "input-exec-error")}
                      />
                      {errors.name && <p className="text-rose-400 text-[11px] mt-1">{errors.name.message}</p>}
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-exec">
                        Official Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="name@organization.com"
                        className={cn("input-exec", errors.email && "input-exec-error")}
                      />
                      {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="label-exec">
                        Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="+91 98765 43210"
                        className={cn("input-exec", errors.phone && "input-exec-error")}
                      />
                      {errors.phone && <p className="text-rose-400 text-[11px] mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Message (max 500 chars) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label-exec mb-0">
                        Inquiry Details <span className="text-rose-400">*</span>
                      </label>
                      <span className={cn(
                        "text-[11px]",
                        charCount > 500 ? "text-rose-400 font-bold" : "text-neutral-400"
                      )}>
                        {charCount} / 500 characters
                      </span>
                    </div>

                    <textarea
                      rows={5}
                      maxLength={500}
                      {...register("message")}
                      placeholder="Write your inquiry or chapter query here (up to 500 characters)..."
                      className={cn(
                        "input-exec resize-none",
                        errors.message && "input-exec-error"
                      )}
                    />

                    <p className="text-[11px] text-[#C9A227]/80 mt-1.5 leading-relaxed italic">
                      (Please do not enter sensitive financial or confidential credentials such as PAN, Aadhar, or Account numbers.)
                    </p>

                    {errors.message && <p className="text-rose-400 text-[11px] mt-1">{errors.message.message}</p>}
                  </div>

                  {/* Security Verification Indicator */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-neutral-300">
                      <ShieldCheck className="w-5 h-5 text-[#C9A227]" />
                      <div>
                        <span className="font-semibold block text-white">Cloudflare Turnstile Protected</span>
                        <span className="text-[10px] text-neutral-400">Automated spam &amp; bot mitigation active</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/30 font-semibold">
                      Secured
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-10 py-4 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#C9A227] hover:brightness-110 text-neutral-950 shadow-[0_4px_20px_rgba(201,162,39,0.35)] hover:shadow-[0_4px_28px_rgba(201,162,39,0.55)] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <span className="font-bold text-base leading-none">›</span>
                        </>
                      )}
                    </button>

                    <div className="w-24 h-1 rounded-full flex overflow-hidden">
                      <div className="w-1/3 bg-[#FF9933]" />
                      <div className="w-1/3 bg-white" />
                      <div className="w-1/3 bg-[#138808]" />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
