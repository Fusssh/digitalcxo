"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/apiClient";
import { 
  Sliders, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  RotateCcw, 
  Send, 
  KeyRound, 
  Bell, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  Info
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UpdatedByInfo {
  _id?: string;
  name?: string;
  email?: string;
}

interface AdminSettingsData {
  _id?: string;
  notificationEmail: string;
  notificationEmailVerified: boolean;
  pendingNotificationEmail?: string | null;
  contactEmailNotificationEnabled: boolean;
  joinUsEmailNotificationEnabled: boolean;
  updatedBy?: UpdatedByInfo | string;
  updatedAt?: string;
  createdAt?: string;
}

export default function AdminSettingsManager() {
  const [settings, setSettings] = useState<AdminSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Toggle saving states
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);
  
  // Step 3: Change Email Form
  const [newEmailInput, setNewEmailInput] = useState("");
  const [isRequestingEmail, setIsRequestingEmail] = useState(false);

  // Step 4: Verification Form
  const [verifyTokenInput, setVerifyTokenInput] = useState("");
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);

  const showToast = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  // Step 1: GET /admin/settings
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const res = await adminApi.get<{ data: AdminSettingsData }>("/admin/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setSettings(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load admin settings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Step 2: PATCH /admin/settings (Update Notification Settings)
  const handleToggleNotification = async (
    field: "contactEmailNotificationEnabled" | "joinUsEmailNotificationEnabled",
    currentValue: boolean
  ) => {
    if (!settings) return;
    setIsUpdatingNotifications(true);
    const newValue = !currentValue;

    // Optimistic update
    setSettings(prev => prev ? { ...prev, [field]: newValue } : null);

    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const payload = {
        [field]: newValue
      };

      const res = await adminApi.patch<{ data: AdminSettingsData }>("/admin/settings", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        setSettings(res.data);
      }
      showToast("success", `${field === "contactEmailNotificationEnabled" ? "Contact Form" : "Join Us Application"} notification ${newValue ? "enabled" : "disabled"}.`);
    } catch (err: any) {
      // Revert optimistic update
      setSettings(prev => prev ? { ...prev, [field]: currentValue } : null);
      showToast("error", err.message || "Failed to update notification settings.");
    } finally {
      setIsUpdatingNotifications(false);
    }
  };

  // Step 3: POST /admin/settings/request-notification-email
  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput.trim()) {
      showToast("error", "Please provide a valid new notification email address.");
      return;
    }

    setIsRequestingEmail(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const res = await adminApi.post<{ data: { pendingNotificationEmail: string }; message?: string }>("/admin/settings/request-notification-email", {
        newNotificationEmail: newEmailInput.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast("success", res.message || "Verification email sent to new address. It will become active once verified.");
      setNewEmailInput("");
      fetchSettings();
    } catch (err: any) {
      showToast("error", err.message || "Failed to request email change.");
    } finally {
      setIsRequestingEmail(false);
    }
  };

  // Step 4: POST /admin/settings/verify-notification-email
  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyTokenInput.trim()) {
      showToast("error", "Please paste the verification token from your email.");
      return;
    }

    setIsVerifyingToken(true);
    try {
      const res = await adminApi.post<{ data: { notificationEmail: string; notificationEmailVerified: boolean }; message?: string }>(
        "/admin/settings/verify-notification-email",
        { token: verifyTokenInput.trim() }
      );

      showToast("success", res.message || "Notification email successfully verified and activated.");
      setVerifyTokenInput("");
      fetchSettings();
    } catch (err: any) {
      showToast("error", err.message || "Invalid or expired verification token.");
    } finally {
      setIsVerifyingToken(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A227] mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loading System Settings...</p>
      </div>
    );
  }

  const updatedByName = typeof settings?.updatedBy === "object" ? settings.updatedBy?.name : null;
  const updatedByEmail = typeof settings?.updatedBy === "object" ? settings.updatedBy?.email : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div 
          className={`fixed top-6 right-6 z-[1000] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-semibold animate-in fade-in slide-in-from-top-3 duration-300 ${
            feedbackMsg.type === "success" 
              ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/50 backdrop-blur-md" 
              : "bg-red-950/90 text-red-300 border-red-500/50 backdrop-blur-md"
          }`}
        >
          {feedbackMsg.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Management Portal</span>
            <span className="text-xs text-slate-400">• System Notification Settings</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            Admin Notification &amp; Email Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure system alerts for contact inquiries, manage the primary notification dispatch email, and verify pending addresses.
          </p>
        </div>
        
        <button 
          onClick={fetchSettings}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Notification Toggles & Email Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step 2: Email Notification Toggles */}
        <div className="lg:col-span-6 rounded-3xl bg-[#091228] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-[#C9A227]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Automated Email Alerts
              </h3>
              <p className="text-xs text-slate-400">Step 2: Enable or disable instant email alerts</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Contact Form Notification */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Contact Form Inquiries</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Send email notification whenever a visitor submits the Secretariat Contact form.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings?.contactEmailNotificationEnabled}
                disabled={isUpdatingNotifications}
                onClick={() => handleToggleNotification("contactEmailNotificationEnabled", settings?.contactEmailNotificationEnabled ?? true)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings?.contactEmailNotificationEnabled ? "bg-[#C9A227]" : "bg-slate-700"
                } ${isUpdatingNotifications ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings?.contactEmailNotificationEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Join Us / Applications Notification */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Join Us &amp; Applications</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Send email notification when an executive or organization submits membership/partnership applications.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings?.joinUsEmailNotificationEnabled}
                disabled={isUpdatingNotifications}
                onClick={() => handleToggleNotification("joinUsEmailNotificationEnabled", settings?.joinUsEmailNotificationEnabled ?? false)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings?.joinUsEmailNotificationEnabled ? "bg-[#C9A227]" : "bg-slate-700"
                } ${isUpdatingNotifications ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings?.joinUsEmailNotificationEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Audit Trail Info */}
          {(updatedByName || updatedByEmail) && (
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
              <UserCheck className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                Last updated by <strong className="text-white">{updatedByName}</strong> ({updatedByEmail})
              </span>
            </div>
          )}
        </div>

        {/* Step 1 & Step 3: Active Notification Email Status */}
        <div className="lg:col-span-6 rounded-3xl bg-[#091228] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Notification Dispatch Address
                </h3>
                <p className="text-xs text-slate-400">Step 1: Current active inbox for system alerts</p>
              </div>
            </div>

            {/* Current Active Email Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Verified Email</span>
                {settings?.notificationEmailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Clock className="w-3 h-3" /> Unverified
                  </span>
                )}
              </div>
              <p className="text-lg font-serif font-bold text-[#C9A227] truncate">
                {settings?.notificationEmail || "admin@example.com"}
              </p>
            </div>

            {/* Pending Email Alert Banner */}
            {settings?.pendingNotificationEmail && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Pending Email Verification</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  A verification email was sent to <strong className="text-white">{settings.pendingNotificationEmail}</strong>. 
                  It will replace the current email once verified with the token.
                </p>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 text-[11px] text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              All settings changes automatically record a <code className="text-[#C9A227]">SETTINGS_UPDATED</code> audit trail entry.
            </span>
          </div>
        </div>

      </div>

      {/* Step 3 & Step 4: Change Request & Token Verification Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step 3: Request New Email */}
        <div className="lg:col-span-6 rounded-3xl bg-[#091228] border border-white/10 p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Request Email Address Change
              </h3>
              <p className="text-xs text-slate-400">Step 3: Dispatch verification link to new inbox</p>
            </div>
          </div>

          <form onSubmit={handleRequestEmailChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Notification Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  placeholder="new-notifications@domain.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                A verification token will be generated and dispatched to this address.
              </p>
            </div>

            <button
              type="submit"
              disabled={isRequestingEmail}
              className="w-full py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              {isRequestingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Verification Email
            </button>
          </form>
        </div>

        {/* Step 4: Token Verification Form */}
        <div className="lg:col-span-6 rounded-3xl bg-[#091228] border border-white/10 p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-[#C9A227]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Verify &amp; Activate New Email
              </h3>
              <p className="text-xs text-slate-400">Step 4: Paste verification token to activate</p>
            </div>
          </div>

          <form onSubmit={handleVerifyToken} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Verification Token <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={verifyTokenInput}
                  onChange={(e) => setVerifyTokenInput(e.target.value)}
                  placeholder="Paste RAW_VERIFICATION_TOKEN"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-[#C9A227] font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Paste the token code from the email to verify and activate the new address immediately.
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifyingToken}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              {isVerifyingToken ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              Verify &amp; Activate Email
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
