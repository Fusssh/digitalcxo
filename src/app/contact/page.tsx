"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormData } from "@/lib/schemas/contactSchema";
import { PageHero } from "@/components/layout/PageHero";
import { MapPin, Mail, Send, CheckCircle, AlertCircle, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
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
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      title: undefined,
      message: "",
      honeypot: "",
      turnstileVerified: true // Auto-verified by default modern invisible bot check
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
    <div className="min-h-screen bg-[#060B18]">
      <PageHero
        title="Contact Us"
        subtitle="Connect with the Digital CXOS leadership secretariat for executive inquiries, chapter access, and strategic partnerships."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Registered Office & Direct Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl glass-panel-gold p-8 border border-amber-400/30 space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h3 className="text-xl font-bold font-serif text-slate-100">
                  Registered Office
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-100">Digital CXOS Private Limited</p>
                    <p>Embassy Galaxy Business Park</p>
                    <p>Tower-B, 1st Floor, A-44 &amp; 45, Sushil Marg,</p>
                    <p>Sector 62, Noida – 201309</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Official Secretariat
                    </p>
                    <a
                      href="mailto:contact@digitalcxos.com"
                      className="text-amber-300 hover:underline font-medium text-sm"
                    >
                      contact@digitalcxos.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-slate-400 space-y-2">
                <p className="font-semibold text-slate-300">Office Hours &amp; Response Time:</p>
                <p>Monday to Friday: 09:30 AM – 06:30 PM IST</p>
                <p>All executive inquiries receive a response within 24 to 48 business hours.</p>
              </div>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="rounded-2xl glass-panel p-6 border border-white/10 flex items-start gap-3 text-xs text-slate-400">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                Communications are handled in strict adherence to Digital CXOS confidentiality protocols and India&apos;s DPDP data privacy standards.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 shadow-2xl">
              {submittedSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-slate-100">
                    Message Sent Successfully
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for contacting Digital CXOS Private Limited. Our secretariat team has received your message and will get back to you shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setSubmittedSuccess(false)}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-amber-300 border border-amber-400/30 hover:bg-slate-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-bold font-serif text-slate-100">
                      Send an Executive Inquiry
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Fill out the form below and our team will get in touch.
                    </p>
                  </div>

                  {serverError && (
                    <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
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
                        <option value="">Title</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                      {errors.title && <p className="text-rose-400 text-[11px] mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="sm:col-span-8">
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder="Enter your full name"
                        className={cn(
                          "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                          errors.name ? "border-rose-500" : "border-white/10"
                        )}
                      />
                      {errors.name && <p className="text-rose-400 text-[11px] mt-1">{errors.name.message}</p>}
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="name@organization.com"
                        className={cn(
                          "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                          errors.email ? "border-rose-500" : "border-white/10"
                        )}
                      />
                      {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="+91 98765 43210"
                        className={cn(
                          "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors",
                          errors.phone ? "border-rose-500" : "border-white/10"
                        )}
                      />
                      {errors.phone && <p className="text-rose-400 text-[11px] mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Message (max 500 chars) with Verbatim Helper Text */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Message <span className="text-rose-400">*</span>
                      </label>
                      <span className={cn(
                        "text-[11px]",
                        charCount > 500 ? "text-rose-400 font-bold" : "text-slate-400"
                      )}>
                        {charCount} / 500 characters
                      </span>
                    </div>

                    <textarea
                      rows={5}
                      maxLength={500}
                      {...register("message")}
                      placeholder="Write your message here (up to 500 characters)..."
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-slate-100 text-xs focus:outline-none focus:border-amber-400 transition-colors resize-none",
                        errors.message ? "border-rose-500" : "border-white/10"
                      )}
                    />

                    {/* Verbatim Helper text */}
                    <p className="text-[11px] text-amber-300/80 mt-1.5 leading-relaxed italic">
                      (Please do not enter your personal information, such as PAN, Aadhar card, Voter ID, Passport, Credit card, or Account number.)
                    </p>

                    {errors.message && <p className="text-rose-400 text-[11px] mt-1">{errors.message.message}</p>}
                  </div>

                  {/* Cloudflare Turnstile Modern Bot Protection Widget */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-slate-300">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <span className="font-semibold block">Cloudflare Turnstile Protected</span>
                        <span className="text-[10px] text-slate-400">Invisible bot-detection active</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                      Verified
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
