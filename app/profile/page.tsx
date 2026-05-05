"use client";

import { useState } from "react";
import { useProfile } from "@/app/hooks/useProfile";
import { useSession } from "next-auth/react";
import { changePassword, disableMfa } from "@/app/lib/user";
import { 
  User, 
  Lock, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function ProfilePage() {
  const { data: profile, refetch } = useProfile();
  const { data: session } = useSession();
  const token = (session as any)?.backendToken;

  const [pwLoading, setPwLoading] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  const [pwStatus, setPwStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [mfaStatus, setMfaStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwLoading(true);
    setPwStatus(null);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      await changePassword(data, token!);
      setPwStatus({ type: 'success', msg: "Password updated successfully!" });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setPwStatus({ type: 'error', msg: err.message || "Failed to update password" });
    } finally {
      setPwLoading(false);
    }
  };

  const handleDisableMfa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMfaLoading(true);
    setMfaStatus(null);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await disableMfa(data, token!);
      setMfaStatus({ type: 'success', msg: "MFA disabled successfully!" });
      refetch();
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setMfaStatus({ type: 'error', msg: err.message || "Failed to disable MFA" });
    } finally {
      setMfaLoading(false);
    }
  };

  if (!profile) return <div className="p-8 text-discord-text-muted">Loading profile...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-discord-blurple rounded-2xl flex items-center justify-center shadow-xl shadow-discord-blurple/20">
          <User className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">{profile.username}</h1>
          <p className="text-discord-text-muted font-medium flex items-center gap-2">
            {profile.email} • <span className="bg-white/5 px-2 py-0.5 rounded text-[12px] uppercase font-bold tracking-wider">{profile.tierName} Plan</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Change Password Card */}
        <section className="bg-discord-bg-secondary rounded-xl border border-white/5 p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <Key className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Security</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label className="text-discord-text-muted text-[11px] font-bold uppercase tracking-widest">Current Password</label>
              <input 
                name="oldPassword"
                type="password" 
                required
                className="w-full bg-discord-bg-tertiary border border-white/5 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-discord-blurple transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-discord-text-muted text-[11px] font-bold uppercase tracking-widest">New Password</label>
              <input 
                name="newPassword"
                type="password" 
                required
                className="w-full bg-discord-bg-tertiary border border-white/5 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-discord-blurple transition-all"
              />
            </div>
            {profile.mfaEnabled && (
              <div className="space-y-2">
                <label className="text-discord-text-muted text-[11px] font-bold uppercase tracking-widest">TOTP Code</label>
                <input 
                  name="totpCode"
                  type="text" 
                  maxLength={6}
                  required
                  className="w-full bg-discord-bg-tertiary border border-white/5 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-discord-blurple transition-all tracking-[1em] text-center font-mono"
                />
              </div>
            )}

            {pwStatus && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${pwStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {pwStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-sm font-medium">{pwStatus.msg}</span>
              </div>
            )}

            <button 
              disabled={pwLoading}
              className="w-full bg-discord-blurple hover:bg-discord-blurple/80 text-white font-bold p-3 rounded-lg transition-all shadow-lg shadow-discord-blurple/20 disabled:opacity-50"
            >
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

        {/* MFA Status Card */}
        <section className="bg-discord-bg-secondary rounded-xl border border-white/5 p-6 space-y-6 shadow-2xl flex flex-col">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${profile.mfaEnabled ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'} rounded-xl flex items-center justify-center border`}>
              {profile.mfaEnabled ? <ShieldCheck className="w-5 h-5 text-green-500" /> : <ShieldAlert className="w-5 h-5 text-yellow-500" />}
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Two-Factor Auth</h2>
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-discord-text-muted text-sm font-medium leading-relaxed">
              Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.
            </p>

            <div className={`p-4 rounded-xl border ${profile.mfaEnabled ? 'bg-green-500/5 border-green-500/10' : 'bg-discord-bg-tertiary border-white/5'}`}>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Status</span>
                <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${profile.mfaEnabled ? 'bg-green-500 text-white' : 'bg-discord-text-muted/20 text-discord-text-muted'}`}>
                  {profile.mfaEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {profile.mfaEnabled ? (
              <form onSubmit={handleDisableMfa} className="pt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-discord-text-muted text-[11px] font-bold uppercase tracking-widest">Confirm Password</label>
                  <input 
                    name="password"
                    type="password" 
                    required
                    className="w-full bg-discord-bg-tertiary border border-white/5 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-discord-red transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-discord-text-muted text-[11px] font-bold uppercase tracking-widest">Current TOTP Code</label>
                  <input 
                    name="totpCode"
                    type="text" 
                    maxLength={6}
                    required
                    className="w-full bg-discord-bg-tertiary border border-white/5 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-discord-red transition-all tracking-[1em] text-center font-mono"
                  />
                </div>

                {mfaStatus && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${mfaStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {mfaStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{mfaStatus.msg}</span>
                  </div>
                )}

                <button 
                  disabled={mfaLoading}
                  className="w-full bg-discord-red/10 hover:bg-discord-red text-discord-red hover:text-white border border-discord-red/20 font-bold p-3 rounded-lg transition-all disabled:opacity-50"
                >
                  {mfaLoading ? "Processing..." : "Disable 2FA"}
                </button>
              </form>
            ) : (
              <button className="w-full bg-discord-blurple hover:bg-discord-blurple/80 text-white font-bold p-3 rounded-lg transition-all shadow-lg shadow-discord-blurple/20">
                Setup 2FA
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
