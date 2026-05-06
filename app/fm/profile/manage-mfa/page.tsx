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
      <div className="max-w-3xl bg-md-surface-container rounded-2xl border border-md-outline-variant/10 p-12 text-center text-md-on-surface-variant animate-pulse font-medium text-[14px]">
        Loading security configuration...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-12">
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-md-on-surface-variant px-1">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-lg font-medium">Two-Factor Authentication</h2>
        </div>
        <div className="bg-md-surface-container rounded-2xl border border-md-outline-variant/10 p-8 shadow-xl">
          <p className="text-md-on-surface-variant text-[15px] mb-8 leading-relaxed">
            Secure your account with an extra layer of protection. Once enabled, you'll need to provide a code from your authenticator app to sign in.
          </p>
          <MfaSetupSection mfaEnabled={!!profile?.mfaEnabled} onRefresh={handleRefresh} />
        </div>
      </section>
    </div>
  );
}
