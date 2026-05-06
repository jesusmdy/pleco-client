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
    <div className="flex items-center justify-between group py-1.5">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-figma-bg border border-white/5 flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-figma-text-muted group-hover:text-white transition-colors" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-figma-text-muted text-[9px] font-bold uppercase tracking-[0.05em] leading-none mb-1">{label}</span>
          <div className="text-white font-medium text-[13px] leading-tight truncate">{value}</div>
        </div>
      </div>
      {canCopy && (
        <button 
          className="w-7 h-7 rounded-md hover:bg-white/5 text-figma-text-muted hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
          title={`Copy ${label}`}
          onClick={() => typeof value === 'string' && navigator.clipboard.writeText(value)}
        >
          <Copy className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export function AccountDetails({ profile, session, isLoading }: AccountDetailsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2.5 animate-pulse py-1.5">
            <div className="w-7 h-7 rounded-md bg-white/5 shrink-0" />
            <div className="space-y-1.5">
              <div className="h-2 w-12 bg-white/5 rounded" />
              <div className="h-3 w-28 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const username = profile?.username || session?.user?.name || session?.username || "Guest User";
  const email = profile?.email || session?.user?.email || "No email linked";

  return (
    <div className="flex flex-col gap-1">
      <InfoRow icon={User} label="Display Name" value={username} canCopy />
      <InfoRow icon={Mail} label="Email Address" value={email} canCopy />
      <InfoRow 
        icon={Crown} 
        label="Membership" 
        value={
          <span className="text-figma-blue font-bold">{profile?.tierName || "Free Tier"}</span>
        } 
      />
      <InfoRow 
        icon={ShieldCheck} 
        label="Verification" 
        value={
          <div className="flex items-center gap-1.5">
            <span className="text-figma-blue text-[12px] font-bold">Verified</span>
            <div className="w-1 h-1 rounded-full bg-figma-blue" />
          </div>
        } 
      />
    </div>
  );
}
