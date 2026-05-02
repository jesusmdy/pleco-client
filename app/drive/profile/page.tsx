"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "@/app/lib/user";
import { useSession } from "next-auth/react";
import { AccountDetails } from "@/app/components/profile/account-details";
import { SignOutSection } from "@/app/components/profile/sign-out-section";
import { MfaSetupSection } from "@/app/components/profile/mfa-setup-section";

export default function ProfilePage() {
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

  return (
    <div className="w-full p-4 grid md:grid-cols-2 grid-cols-1 gap-4">
      <div className="border rounded-xl border-white/10 overflow-hidden">
        <div className="border-b border-inherit p-4">
          <h2 className="text-xl font-semibold text-white">Account Details</h2>
        </div>
        <div className="p-4">
          <AccountDetails profile={profile} session={session} isLoading={isLoading} />
        </div>
        <div className="border-t border-inherit p-4">
          <SignOutSection />

        </div>
      </div>

      <div className="border rounded-xl border-white/10 overflow-hidden h-fit">
        <div className="border-b border-inherit p-4">
          <h2 className="text-xl font-semibold text-white">Security</h2>
        </div>
        <div className="p-4">
          <MfaSetupSection mfaEnabled={!!profile?.mfaEnabled} onRefresh={handleRefresh} />
        </div>
      </div>
    </div>
  );
}
