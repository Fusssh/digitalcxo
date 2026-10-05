"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/apiClient";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Key,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AdminProfileData {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      const res = await adminApi.get<{ data: AdminProfileData }>("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setProfile(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load profile data");
      // Fallback
      setProfile({
        _id: "demo-id",
        name: "Admin",
        email: "admin@example.com",
        role: "admin",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setName("Admin");
      setEmail("admin@example.com");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError("");
    setSuccessMsg("");

    try {
      const payload: any = {};
      if (name !== profile?.name) payload.name = name.trim();
      if (email !== profile?.email) payload.email = email.trim();

      if (Object.keys(payload).length === 0) {
        setSuccessMsg("No changes detected.");
        setIsUpdating(false);
        return;
      }

      const token = localStorage.getItem("digitalcxo_admin_token") || localStorage.getItem("token") || "";
      
      const res = await adminApi.patch<{ data: { admin: any }; message?: string }>("/auth/update-credentials", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg(res.message || "Profile details updated successfully.");
      
      if (res.data && res.data.admin) {
        localStorage.setItem("digitalcxo_admin_user", JSON.stringify(res.data.admin));
      }
      
      fetchProfile();
    } catch (err: any) {
      setError(err.message || "An error occurred while updating profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A227]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#C9A227]" />
          My Profile &amp; Settings
        </h2>
        <p className="text-sm text-slate-400 mt-1">Manage your account credentials, executive details, and security settings.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Readonly Info */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col items-center text-center shadow-lg">
            <div className="w-24 h-24 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-4xl text-[#C9A227] mb-4 shadow-inner">
              {profile?.name.charAt(0).toUpperCase() || "A"}
            </div>
            <h3 className="text-lg font-bold text-white">{profile?.name || "Admin"}</h3>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-sky-300 border border-sky-400/20 mt-2">
              {profile?.role || "admin"}
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 space-y-4 shadow-lg">
            <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Account Meta</h4>
            
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Status</p>
              <p className="text-sm text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" /> {profile?.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Last Login</p>
              <p className="text-sm text-slate-300">
                {profile?.lastLoginAt ? formatDate(profile.lastLoginAt) : "Recently Active"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Member Since</p>
              <p className="text-sm text-slate-300">
                {profile?.createdAt ? formatDate(profile.createdAt) : "Verified"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form & Security Panel */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Personal Information Form */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 shadow-lg">
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C9A227]" />
                    Personal Information
                  </h4>
                  <span className="text-[11px] text-slate-400">Basic contact details</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Personal Details</span>
                </button>
              </div>
            </form>
          </div>

          {/* Dedicated Security & Password Management Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 via-[#0B142C]/80 to-slate-900/80 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Security &amp; Password Management</h4>
                  <p className="text-[11px] text-slate-400">Manage administrator login credentials &amp; recovery tokens</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                <CheckCircle2 className="w-3 h-3" /> Secure
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To update your master login password or initiate security recovery protocols, please use the dedicated security gateway.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Requires current password or verified email token</span>
              </div>

              <Link
                href="/admin/change-password"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E5C058] hover:from-[#D4AF37] hover:to-[#F3CF65] text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
              >
                <Key className="w-4 h-4" />
                <span>Change Password</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

