"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "@/app/lib/user";
import { useSession } from "next-auth/react";
import { MfaSetupSection } from "@/app/components/profile/mfa-setup-section";
import { ShieldCheck } from "lucide-react";

export default function ManageMfaPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(session!.backendToken),
    enabled: !!session?.backendToken,
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl bg-figma-dark/40 rounded-xl border border-white/5 p-8 text-center text-figma-text-muted animate-pulse">
        <p className="text-[13px] font-medium">Analyzing security settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-figma-text-muted">
          <ShieldCheck className="w-3.5 h-3.5" />
          <h2 className="text-[10px] font-bold uppercase tracking-wider opacity-80">Two-Factor Authentication</h2>
        </div>
        <div className="bg-figma-dark/40 rounded-xl border border-white/5 p-5">
          <p className="text-figma-text-muted text-[12px] mb-5 leading-relaxed">
            Secure your account with an extra layer of protection. Once enabled, you'll need to provide a code from your authenticator app to sign in.
          </p>
          <MfaSetupSection mfaEnabled={!!profile?.mfaEnabled} onRefresh={handleRefresh} />
        </div>
      </section>
    </div>
  );
}
