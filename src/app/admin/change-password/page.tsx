"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Shield, 
  Key, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Loader2, 
  Mail, 
  Check, 
  X,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { adminApi } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

export default function AdminChangePasswordPage() {
  const router = useRouter();
  
  // Tab state: "update" (logged-in password change) vs "recovery" (forgot / reset token)
  const [activeMode, setActiveMode] = useState<"update" | "recovery">("update");
  
  // Form fields - Update Mode
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Form fields - Recovery Mode
  const [recoveryStep, setRecoveryStep] = useState<"request" | "reset">("request");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [recoveryNewPassword, setRecoveryNewPassword] = useState("");
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState("");

  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Password validation rules
  const activePassword = activeMode === "update" ? newPassword : recoveryNewPassword;
  const activeConfirm = activeMode === "update" ? confirmPassword : recoveryConfirmPassword;

  const hasMinLength = activePassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(activePassword);
  const hasLowercase = /[a-z]/.test(activePassword);
  const hasNumber = /[0-9]/.test(activePassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(activePassword);
  const passwordsMatch = activePassword.length > 0 && activePassword === activeConfirm;

  const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPassword) {
      setErrorMsg("Please provide your current password.");
      return;
    }

    if (!hasMinLength) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      
      const res = await adminApi.patch<{ message?: string; data?: any }>("/auth/update-credentials", {
        currentPassword,
        newPassword,
        confirmPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg(res.message || "Your password has been changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect back to admin console after 2s
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password. Please check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!recoveryEmail.trim()) {
      setErrorMsg("Please enter your official administrator email.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminApi.post<{ message?: string }>("/auth/forgot-password", {
        email: recoveryEmail.trim()
      });

      setSuccessMsg(res.message || "Password recovery token has been generated. Enter the token below to complete reset.");
      setRecoveryStep("reset");
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to process recovery request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!resetToken.trim()) {
      setErrorMsg("Please enter the reset token received.");
      return;
    }

    if (!hasMinLength) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (recoveryNewPassword !== recoveryConfirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminApi.post<{ message?: string }>("/auth/reset-password", {
        token: resetToken.trim(),
        newPassword: recoveryNewPassword,
        confirmPassword: recoveryConfirmPassword
      });

      setSuccessMsg(res.message || "Password reset successful! You can now log in with your new credentials.");
      setResetToken("");
      setRecoveryNewPassword("");
      setRecoveryConfirmPassword("");

      setTimeout(() => {
        router.push("/admin");
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password. Token may be invalid or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 flex flex-col antialiased selection:bg-[#C9A227] selection:text-slate-950 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#C9A227]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-[#070E22]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-[#C9A227]" />
            <span>Back to Console</span>
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="hidden sm:block">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] font-mono block">
              Security Gateway
            </span>
            <h1 className="text-sm font-serif font-bold text-white leading-none mt-0.5">
              Password &amp; Credential Management
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-400 font-medium">SSL Encrypted Session</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center relative z-10 my-auto">
        
        <div className="bg-[#091228]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Card Title & Icon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227] shadow-lg shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                  Update Administrator Password
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Protect your executive console by maintaining strict password security standards.
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => { setActiveMode("update"); setErrorMsg(""); setSuccessMsg(""); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                  activeMode === "update" 
                    ? "bg-[#C9A227] text-slate-950 font-bold shadow-md" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                Direct Change
              </button>
              <button
                type="button"
                onClick={() => { setActiveMode("recovery"); setErrorMsg(""); setSuccessMsg(""); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                  activeMode === "recovery" 
                    ? "bg-[#C9A227] text-slate-950 font-bold shadow-md" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                Token Recovery
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-rose-300">Security Notification</p>
                <p className="text-rose-200/90 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-emerald-300">Operation Successful</p>
                <p className="text-emerald-200/90 leading-relaxed">{successMsg}</p>
              </div>
            </div>
          )}

          {/* MODE 1: DIRECT UPDATE (Logged-in user) */}
          {activeMode === "update" && (
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Current Master Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    New Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Confirm New Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Checklist */}
              {newPassword && (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Password Strength:</span>
                    <span className={cn(
                      "font-bold uppercase tracking-wider text-[11px]",
                      strengthScore <= 2 ? "text-rose-400" :
                      strengthScore <= 4 ? "text-amber-400" : "text-emerald-400"
                    )}>
                      {strengthScore <= 2 ? "Weak" : strengthScore <= 4 ? "Moderate" : "Strong & Secure"}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    <div className={cn("h-full flex-1 rounded-full transition-all", strengthScore >= 1 ? (strengthScore <= 2 ? "bg-rose-500" : strengthScore <= 4 ? "bg-amber-400" : "bg-emerald-400") : "bg-transparent")} />
                    <div className={cn("h-full flex-1 rounded-full transition-all", strengthScore >= 2 ? (strengthScore <= 2 ? "bg-rose-500" : strengthScore <= 4 ? "bg-amber-400" : "bg-emerald-400") : "bg-transparent")} />
                    <div className={cn("h-full flex-1 rounded-full transition-all", strengthScore >= 3 ? (strengthScore <= 4 ? "bg-amber-400" : "bg-emerald-400") : "bg-transparent")} />
                    <div className={cn("h-full flex-1 rounded-full transition-all", strengthScore >= 4 ? (strengthScore <= 4 ? "bg-amber-400" : "bg-emerald-400") : "bg-transparent")} />
                    <div className={cn("h-full flex-1 rounded-full transition-all", strengthScore >= 5 ? "bg-emerald-400" : "bg-transparent")} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className={cn("flex items-center gap-1.5", hasMinLength ? "text-emerald-400" : "text-slate-400")}>
                      {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-500" />}
                      <span>8+ Characters</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5", hasUppercase && hasLowercase ? "text-emerald-400" : "text-slate-400")}>
                      {hasUppercase && hasLowercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-500" />}
                      <span>Upper &amp; Lowercase</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5", hasNumber ? "text-emerald-400" : "text-slate-400")}>
                      {hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-500" />}
                      <span>At least 1 Number</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5", hasSpecial ? "text-emerald-400" : "text-slate-400")}>
                      {hasSpecial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-500" />}
                      <span>Special Symbol</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5", passwordsMatch ? "text-emerald-400" : "text-slate-400")}>
                      {passwordsMatch ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-500" />}
                      <span>Passwords Match</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href="/admin"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold text-center transition-colors"
                >
                  Cancel &amp; Return
                </Link>

                <button
                  type="submit"
                  disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50 transition-transform active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>Commit Password Change</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: TOKEN RECOVERY (Forgot password / token reset) */}
          {activeMode === "recovery" && (
            <div className="space-y-6">
              {recoveryStep === "request" ? (
                <form onSubmit={handleRequestResetLink} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Enter your official administrator email below. The security system will dispatch a unique recovery token.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Official Executive Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="admin@digitalcxos.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setRecoveryStep("reset")}
                      className="text-xs text-[#C9A227] hover:underline"
                    >
                      Already have a recovery token?
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading || !recoveryEmail.trim()}
                      className="px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      <span>Generate Reset Token</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCompleteReset} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Security Reset Token <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Paste verification token here"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-100 font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        New Password <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={recoveryNewPassword}
                        onChange={(e) => setRecoveryNewPassword(e.target.value)}
                        placeholder="Min 8 chars"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Confirm New Password <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={recoveryConfirmPassword}
                        onChange={(e) => setRecoveryConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-slate-100 focus:outline-none focus:border-[#C9A227]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setRecoveryStep("request")}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ← Request New Token
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading || !resetToken || !recoveryNewPassword || !recoveryConfirmPassword}
                      className="px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      <span>Apply New Password</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Security Footer Note */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>Digital CXOS Executive Security • Automated audit trail recording active</p>
          <p className="text-[11px] text-slate-600">All password modifications invalidate previous active sessions across secondary devices.</p>
        </div>
      </main>
    </div>
  );
}
