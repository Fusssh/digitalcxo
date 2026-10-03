"use client";

import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/apiClient";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2
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
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("digitalcxo_admin_token") || "DEMO_TOKEN";
      const res = await adminApi.get<{ data: AdminProfileData }>("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (err: any) {
      setError(err.message || "Failed to load profile data");
      // Fallback
      setProfile({
        _id: "demo-id",
        name: "Demo Admin",
        email: "admin@example.com",
        role: "admin",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setName("Demo Admin");
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
      if (newPassword && newPassword !== confirmPassword) {
        throw new Error("New password and confirmation do not match.");
      }

      const payload: any = {};
      if (name !== profile?.name) payload.name = name;
      if (email !== profile?.email) payload.email = email;
      
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
        payload.confirmPassword = confirmPassword;
      }

      if (Object.keys(payload).length === 0) {
        setIsUpdating(false);
        return;
      }

      const token = localStorage.getItem("digitalcxo_admin_token") || "DEMO_TOKEN";
      
      // Use /auth/update-credentials since it supports all field updates in one go
      const res = await adminApi.patch<{ data: { admin: any } }>("/auth/update-credentials", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg("Profile credentials updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Update local storage if needed
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
          My Profile & Settings
        </h2>
        <p className="text-sm text-slate-400 mt-1">Manage your account details and security credentials.</p>
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
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-4xl text-[#C9A227] mb-4">
              {profile?.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-bold text-white">{profile?.name}</h3>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-sky-300 border border-sky-400/20 mt-2">
              {profile?.role}
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 space-y-4">
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
                {profile?.lastLoginAt ? formatDate(profile.lastLoginAt) : "Unknown"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Member Since</p>
              <p className="text-sm text-slate-300">
                {profile?.createdAt ? formatDate(profile.createdAt) : "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/50 border border-white/5">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                Security & Password
              </h4>
              <p className="text-xs text-slate-400 mb-2">Leave these fields blank if you do not wish to change your password.</p>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Required if changing password"
                    className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-100 focus:border-[#C9A227] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-sm flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
