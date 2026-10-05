"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  Mail,
  Shield
} from "lucide-react";
import { adminApi } from "@/lib/apiClient";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [activatedEmail, setActivatedEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setIsSuccess(false);
      setMessage("No verification token was provided in the link.");
      return;
    }

    setIsLoading(true);

    // Option 1 & 2: Verify via POST /admin/settings/verify-notification-email (or GET)
    adminApi.post<{ data: { notificationEmail: string; notificationEmailVerified: boolean }; message?: string }>(
      "/admin/settings/verify-notification-email",
      { token }
    )
      .then((res) => {
        setIsSuccess(true);
        setMessage(res.message || "Notification email successfully verified and activated.");
        if (res.data?.notificationEmail) {
          setActivatedEmail(res.data.notificationEmail);
        }
      })
      .catch((err: any) => {
        // Fallback to GET /admin/settings/verify-notification-email?token=...
        adminApi.get<{ data: { notificationEmail: string }; message?: string }>(
          `/admin/settings/verify-notification-email?token=${token}`
        )
          .then((res) => {
            setIsSuccess(true);
            setMessage(res.message || "Notification email successfully verified and activated.");
            if (res.data?.notificationEmail) {
              setActivatedEmail(res.data.notificationEmail);
            }
          })
          .catch((getErr: any) => {
            setIsSuccess(false);
            setMessage(getErr.message || err.message || "Invalid or expired verification token.");
          });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex items-center justify-center p-4 selection:bg-[#C9A227] selection:text-slate-950">
      <div className="w-full max-w-md bg-[#0B132B] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
        
        {isLoading ? (
          <div className="py-8 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#C9A227] mx-auto" />
            <h2 className="text-xl font-serif font-bold text-white">
              Verifying Notification Email...
            </h2>
            <p className="text-xs text-slate-400">
              Validating security token with the Digital CXOS administration cluster.
            </p>
          </div>
        ) : isSuccess ? (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-white">
                Email Address Verified!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {message}
              </p>
              {activatedEmail && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 inline-flex items-center gap-2 text-xs font-semibold text-[#C9A227] mt-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{activatedEmail}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/admin"
                className="w-full py-3 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-transform hover:scale-[1.02]"
              >
                <span>Return to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-xl">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-white">
                Verification Failed
              </h2>
              <p className="text-xs text-rose-300/90 leading-relaxed">
                {message}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/admin"
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>Go to Admin Dashboard</span>
              </Link>
            </div>
          </div>
        )}

        <div className="border-t border-white/5 pt-4 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Digital CXOS System Administration Security</span>
        </div>
      </div>
    </div>
  );
}

export default function VerifyNotificationEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070D1F] flex items-center justify-center text-slate-400">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
