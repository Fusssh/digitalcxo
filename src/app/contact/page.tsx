"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormData } from "@/lib/schemas/contactSchema";
import { PageHero } from "@/components/layout/PageHero";
import { CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";
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
      const { adminApi } = await import("@/lib/apiClient");
      await adminApi.post("/contact", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        subject: data.title ? `${data.title} ${data.name} Inquiry` : "New Website Inquiry"
      });

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
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
                      {errors.title && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.title.message}</p>}
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
                      {errors.name && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.name.message}</p>}
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
                      {errors.email && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.email.message}</p>}
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
                      {errors.phone && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Message (max 500 chars) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label-exec mb-0">
                        Inquiry Details <span className="text-rose-400">*</span>
                      </label>
                      <span className={cn(
                        "text-xs",
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

                    <p className="text-xs sm:text-sm text-[#C9A227]/90 mt-1.5 leading-relaxed">
                      (Please do not enter sensitive financial or confidential credentials such as PAN, Aadhar, or Account numbers.)
                    </p>

                    {errors.message && <p className="text-rose-400 text-xs sm:text-sm mt-1">{errors.message.message}</p>}
                  </div>

                  {/* Security Verification Indicator */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5 text-neutral-300">
                      <ShieldCheck className="w-5 h-5 text-[#C9A227]" />
                      <div>
                        <span className="font-semibold block text-white">Enterprise Security Verification</span>
                        <span className="text-xs text-neutral-400">Automated spam &amp; bot mitigation active</span>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/30 font-semibold">
                      Secured
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-10 py-4 rounded-lg font-bold text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#C9A227] hover:brightness-110 text-neutral-950 shadow-[0_4px_20px_rgba(201,162,39,0.35)] hover:shadow-[0_4px_28px_rgba(201,162,39,0.55)] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
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
      </div>
    </div>
  );
}
