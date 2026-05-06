"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/app/lib/user";
import { useSession } from "next-auth/react";
import { AccountDetails } from "@/app/components/profile/account-details";
import { SignOutSection } from "@/app/components/profile/sign-out-section";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(session!.backendToken),
    enabled: !!session?.backendToken,
  });

  return (
    <div className="max-w-3xl space-y-12">
      <section className="space-y-4">
        <div className="flex items-center gap-3 text-md-on-surface-variant px-1">
          <User className="w-5 h-5" />
          <h2 className="text-lg font-medium">Account Details</h2>
        </div>
        <div className="bg-md-surface-container rounded-2xl border border-md-outline-variant/10 p-8 shadow-xl">
          <AccountDetails profile={profile} session={session} isLoading={isLoading} />
        </div>
      </section>

      <div className="pt-8 border-t border-md-outline-variant/10">
        <SignOutSection />
      </div>
    </div>
  );
}
