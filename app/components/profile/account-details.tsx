"use client";

import { User, Mail, Crown, ShieldCheck, Copy } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Session } from "next-auth";

export interface UserProfile {
  id?: string;
  email?: string;
  username?: string;
  createdAt?: string;
  role?: string;
  mfaEnabled?: boolean;
  tierName?: string;
}

interface AccountDetailsProps {
  profile?: UserProfile;
  session?: any;
  isLoading: boolean;
}

interface InfoRowProps {
  icon: any;
  label: string;
  value: React.ReactNode;
  canCopy?: boolean;
}

function InfoRow({ icon: Icon, label, value, canCopy }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between group py-3 px-2 rounded-2xl hover:bg-md-primary/5 transition-all">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-md-surface-container-highest border border-md-outline-variant/10 flex items-center justify-center shrink-0">
          <Icon className="w-5.5 h-5.5 text-md-on-surface-variant group-hover:text-md-primary transition-colors" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-md-on-surface-variant text-[12px] font-semibold tracking-tight leading-none mb-1.5">{label}</span>
          <div className="text-md-on-surface font-semibold text-[15px] leading-tight truncate">{value}</div>
        </div>
      </div>
      {canCopy && (
        <button 
          className="w-10 h-10 rounded-full hover:bg-md-primary/10 text-md-on-surface-variant hover:text-md-primary transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
          title={`Copy ${label}`}
          onClick={() => typeof value === 'string' && navigator.clipboard.writeText(value)}
        >
          <Copy className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function AccountDetails({ profile, session, isLoading }: AccountDetailsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-5 animate-pulse py-3 px-2">
            <div className="w-12 h-12 rounded-full bg-md-surface-container-highest shrink-0" />
            <div className="space-y-2">
              <div className="h-3 w-16 bg-md-surface-container-highest rounded-full" />
              <div className="h-4 w-40 bg-md-surface-container-highest/60 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const username = profile?.username || session?.user?.name || session?.username || "Guest user";
  const email = profile?.email || session?.user?.email || "No email linked";

  return (
    <div className="flex flex-col gap-1">
      <InfoRow icon={User} label="Display name" value={username} canCopy />
      <InfoRow icon={Mail} label="Email address" value={email} canCopy />
      <InfoRow 
        icon={Crown} 
        label="Membership" 
        value={
          <span className="text-md-primary font-bold">{profile?.tierName || "Free tier"}</span>
        } 
      />
      <InfoRow 
        icon={ShieldCheck} 
        label="Verification" 
        value={
          <div className="flex items-center gap-2">
            <span className="text-md-primary text-[14px] font-bold">Verified professional</span>
            <div className="w-1.5 h-1.5 rounded-full bg-md-primary" />
          </div>
        } 
      />
    </div>
  );
}
