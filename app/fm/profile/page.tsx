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
    <div className="max-w-2xl space-y-10">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-figma-text-muted">
          <User className="w-4 h-4" />
          <h2 className="text-[11px] font-bold uppercase tracking-wider">Account Details</h2>
        </div>
        <div className="bg-figma-dark/40 rounded-xl border border-white/5 p-6 shadow-2xl">
          <AccountDetails profile={profile} session={session} isLoading={isLoading} />
        </div>
      </section>

      <div className="pt-6 border-t border-white/5">
        <SignOutSection />
      </div>
    </div>
  );
}
