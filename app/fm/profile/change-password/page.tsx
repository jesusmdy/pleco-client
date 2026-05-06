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
      <div className="max-w-3xl bg-md-surface-container rounded-2xl border border-md-outline-variant/10 p-12 animate-pulse text-center font-medium text-[14px] text-md-on-surface-variant">
        Verifying security context...
      </div>
    );
  }

  if (!session?.backendToken) return null;

  return (
    <div className="max-w-3xl space-y-12">
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-md-on-surface-variant px-1">
          <Lock className="w-5 h-5" />
          <h2 className="text-lg font-medium">Security Settings</h2>
        </div>
        <div className="bg-md-surface-container rounded-2xl border border-md-outline-variant/10 p-8 shadow-sm">
          <ChangePasswordSection 
            token={session.backendToken} 
            mfaEnabled={!!profile?.mfaEnabled} 
          />
        </div>
      </section>
    </div>
  );
}
