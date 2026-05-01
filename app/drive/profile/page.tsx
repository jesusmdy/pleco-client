"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/app/lib/user";
import { useSession } from "next-auth/react";
import { AccountDetails } from "@/app/components/profile/account-details";
import { SignOutSection } from "@/app/components/profile/sign-out-section";

export default function ProfilePage() {
  const { data: session } = useSession();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(session!.backendToken),
    enabled: !!session?.backendToken,
  });

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-white mb-8">User Profile</h1>

      <div className="w-full">
        <h2 className="text-xl font-semibold text-white mb-6">Account Details</h2>

        <AccountDetails profile={profile} session={session} isLoading={isLoading} />
        
        <SignOutSection />
      </div>
    </div>
  );
}
