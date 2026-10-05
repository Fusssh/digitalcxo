"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Shield, 
  Mail, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminApi } from "@/lib/apiClient";

export default function ForgotPasswordPage() {
  const [authTab, setAuthTab] = useState<"forgot" | "reset">("forgot");
  const [authEmail, setAuthEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");
    setAuthLoading(true);

    try {
      if (authTab === "forgot") {
        const res = await adminApi.post<{ message?: string }>("/auth/forgot-password", { 
          email: authEmail.trim() 
        });
        setAuthSuccessMsg(res.message || "If an account exists with that email, a password reset link has been sent.");
        
      } else if (authTab === "reset") {
        if (!resetToken.trim()) {
          throw new Error("Please provide reset token and new password");
        }
        if (authPassword !== authConfirmPassword) {
          throw new Error("Passwords do not match");
        }
        const res = await adminApi.post<{ message?: string }>("/auth/reset-password", {
          token: resetToken.trim(),
          newPassword: authPassword,
          confirmPassword: authConfirmPassword
        });
        setAuthSuccessMsg(res.message || "Password has been reset successfully. You may now login.");
        setTimeout(() => {
          window.location.href = "/admin";
        }, 2500);
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication error contacting server.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Ambient luxury lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#C9A227]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 bg-[#0B132B]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex items-center">
          <Link href="/admin" className="text-slate-400 hover:text-white flex items-center gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>

        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C9A227]/20 to-amber-400/10 border border-[#C9A227]/40 shadow-xl mb-1">
            <Key className="w-7 h-7 text-[#C9A227]" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Password Recovery
          </h1>
          <p className="text-xs text-slate-400">
            Secure token validation for executive accounts
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-semibold">
          <button
            onClick={() => { setAuthTab("forgot"); setAuthError(""); setAuthSuccessMsg(""); }}
            className={cn(
              "py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              authTab === "forgot"
                ? "bg-[#C9A227] text-slate-950 font-bold shadow-lg"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Link</span>
          </button>
          <button
            onClick={() => { setAuthTab("reset"); setAuthError(""); setAuthSuccessMsg(""); }}
            className={cn(
              "py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              authTab === "reset"
                ? "bg-[#C9A227] text-slate-950 font-bold shadow-lg"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {authError && (
          <div className="p-3.5 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}
        {authSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{authSuccessMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {authTab === "forgot" && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Official Executive Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@digitalcxos.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>
          )}

          {authTab === "reset" && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Reset Token</label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Paste reset token from email"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-[#C9A227] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="New password (min 8 chars)"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-[#C9A227]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs bg-gradient-to-r from-[#C9A227] to-[#E5C058] hover:from-[#D4AF37] hover:to-[#F3CF65] text-slate-950 transition-all duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : authTab === "forgot" ? (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send Reset Link</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
