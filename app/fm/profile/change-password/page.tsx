"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/app/lib/user";
import { ChangePasswordSection } from "@/app/components/profile/change-password-section";
import { Lock } from "lucide-react";

export default function ChangePasswordPage() {
  const { data: session } = useSession();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(session!.backendToken),
    enabled: !!session?.backendToken,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl bg-figma-dark/40 rounded-xl border border-white/5 p-8 animate-pulse text-center">
        <p className="text-figma-text-muted text-[13px]">Loading security context...</p>
      </div>
    );
  }

  if (!session?.backendToken) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-figma-text-muted">
          <Lock className="w-3.5 h-3.5" />
          <h2 className="text-[10px] font-bold uppercase tracking-wider opacity-80">Security Settings</h2>
        </div>
        <div className="bg-figma-dark/40 rounded-xl border border-white/5 p-5">
          <ChangePasswordSection 
            token={session.backendToken} 
            mfaEnabled={!!profile?.mfaEnabled} 
          />
        </div>
      </section>
    </div>
  );
}
