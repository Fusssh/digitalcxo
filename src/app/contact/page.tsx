"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormData } from "@/lib/schemas/contactSchema";
import { PageHero } from "@/components/layout/PageHero";
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  MapPin,
  Send,
  ExternalLink,
  Building2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Shared style tokens ---------- */
const labelClass = "block text-sm font-medium text-slate-200 mb-1.5";
const baseFieldClass =
  "w-full h-12 px-4 rounded-xl bg-[#0B1530] border text-sm text-white placeholder:text-slate-500 " +
  "transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40";
const fieldClass = (hasError?: boolean) =>
  cn(
    baseFieldClass,
    hasError
      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
      : "border-white/10 hover:border-white/20 focus:border-[#C9A227]"
  );

const Required = () => (
  <span className="text-[#C9A227] ml-0.5" aria-hidden="true">
    *
  </span>
);

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  ) : null;

const MAP_LINK =
  "https://maps.google.com/?q=Embassy+Galaxy+Business+Park+Sector+62+Noida";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      title: "Mr.",
      firstName: "",
      lastName: "",
      subject: "",
      email: "",
      phone: "",
      message: "",
      honeypot: "",
      turnstileVerified: true,
    },
  });

  const charCount = (watch("message") || "").length;

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot check
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
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        subject: data.subject,
        email: data.email,
        phone: data.phone,
        message: data.message,
      });

      setSubmittedSuccess(true);
      reset();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[400px] bg-[#C9A227]/5 blur-[150px]"
      />

      <PageHero
        title="Contact Us"
        subtitle="Connect with the Digital CXOS leadership secretariat for executive inquiries, chapter access, and strategic partnerships."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      <main className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ================= LEFT: MAP + OFFICE ================= */}
          <aside className="order-2 lg:order-1 lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#091228] shadow-2xl">
              <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[380px] bg-slate-900">
                <iframe
                  title="Embassy Galaxy Business Park Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.564757697482!2d77.36191837617498!3d28.612826384976725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce566dc10c377%3A0xe541e25e36f95c47!2sEmbassy%20Galaxy%20Business%20Park!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-white/10 bg-[#0B132B] text-sm font-medium text-white hover:text-[#C9A227] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C9A227]" />
                  Open in Google Maps
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Registered office */}
            <div className="rounded-2xl border border-white/10 bg-[#091228] p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-white">Registered Office</h2>
                  <address className="not-italic mt-2 text-sm text-slate-300 leading-relaxed">
                    <span className="block font-medium text-slate-100">
                      Digital CXOS Private Limited
                    </span>
                    Embassy Galaxy Business Park
                    <br />
                    Tower-B, 1st Floor, A-44 &amp; 45, Sushil Marg,
                    <br />
                    Sector 62, Noida – 201309
                  </address>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Official Secretariat</p>
                  <a
                    href="mailto:contact@digitalcxos.com"
                    className="text-sm font-semibold text-[#C9A227] hover:underline break-all"
                  >
                    contact@digitalcxos.com
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT: FORM ================= */}
          <section className="order-1 lg:order-2 lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#091228] p-6 sm:p-8 lg:p-10 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Fields marked <span className="text-[#C9A227]">*</span> are required.
                </p>
              </div>

              {submittedSuccess ? (
                <div
                  role="status"
                  className="py-10 text-center space-y-5 animate-in zoom-in-95 duration-200"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    Message sent
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for contacting Digital CXOS Private Limited. Our secretariat team
                    has received your message and will respond within 24 to 48 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedSuccess(false)}
                    className="px-6 h-11 rounded-xl text-sm font-semibold bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:ring-offset-2 focus:ring-offset-[#091228]"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  {serverError && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-sm flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <input type="text" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
                  </div>

                  {/* Row 1: Title / First / Last */}
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-5">
                    <div className="sm:col-span-2">
                      <label htmlFor="title" className={labelClass}>
                        Title
                        <Required />
                      </label>
                      <div className="relative">
                        <select
                          id="title"
                          {...register("title")}
                          aria-invalid={!!errors.title}
                          className={cn(fieldClass(!!errors.title), "appearance-none pr-10 cursor-pointer")}
                        >
                          <option value="Mr." className="bg-[#091228]">Mr.</option>
                          <option value="Ms." className="bg-[#091228]">Ms.</option>
                          <option value="Mrs." className="bg-[#091228]">Mrs.</option>
                          <option value="Dr." className="bg-[#091228]">Dr.</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                      <FieldError id="title-error" message={errors.title?.message} />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="firstName" className={labelClass}>
                        First name
                        <Required />
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="First name"
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? "firstName-error" : undefined}
                        {...register("firstName")}
                        className={fieldClass(!!errors.firstName)}
                      />
                      <FieldError id="firstName-error" message={errors.firstName?.message} />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="lastName" className={labelClass}>
                        Last name
                        <Required />
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Last name"
                        aria-invalid={!!errors.lastName}
                        aria-describedby={errors.lastName ? "lastName-error" : undefined}
                        {...register("lastName")}
                        className={fieldClass(!!errors.lastName)}
                      />
                      <FieldError id="lastName-error" message={errors.lastName?.message} />
                    </div>
                  </div>

                  {/* Row 2: Email / Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email
                        <Required />
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@company.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        {...register("email")}
                        className={fieldClass(!!errors.email)}
                      />
                      <FieldError id="email-error" message={errors.email?.message} />
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone
                        <Required />
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        {...register("phone")}
                        className={fieldClass(!!errors.phone)}
                      />
                      <FieldError id="phone-error" message={errors.phone?.message} />
                    </div>
                  </div>

                  {/* Row 3: Subject (full width) */}
                  <div>
                    <label htmlFor="subject" className={labelClass}>
                      Subject
                      <Required />
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="What is your inquiry about?"
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? "subject-error" : undefined}
                      {...register("subject")}
                      className={fieldClass(!!errors.subject)}
                    />
                    <FieldError id="subject-error" message={errors.subject?.message} />
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="message" className={labelClass}>
                        Message
                        <Required />
                      </label>
                      <span
                        className={cn(
                          "text-xs font-mono mb-1.5",
                          charCount >= 480 ? "text-amber-400" : "text-slate-500"
                        )}
                      >
                        {charCount}/500
                      </span>
                    </div>
                    <textarea
                      id="message"
                      rows={5}
                      maxLength={500}
                      placeholder="Write your message here..."
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : "message-hint"}
                      {...register("message")}
                      className={cn(
                        baseFieldClass,
                        "h-auto py-3 resize-none leading-relaxed",
                        errors.message
                          ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                          : "border-white/10 hover:border-white/20 focus:border-[#C9A227]"
                      )}
                    />
                    <FieldError id="message-error" message={errors.message?.message} />
                    <p id="message-hint" className="mt-2 text-xs text-slate-400 leading-relaxed">
                      Please do not enter personal information such as PAN, Aadhaar, Voter ID,
                      passport, credit card, or account numbers.
                    </p>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto min-w-[200px] h-12 px-8 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#C9A227] via-[#D4AF37] to-[#C9A227] hover:brightness-110 text-slate-950 inline-flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C9A227]/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:ring-offset-2 focus:ring-offset-[#091228]"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}