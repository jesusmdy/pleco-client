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
    <div className="max-w-4xl space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-6">
        <div className="flex items-center gap-4 text-md-on-surface-variant px-1">
          <User className="w-6 h-6 text-md-primary" />
          <h2 className="text-2xl font-medium tracking-tight text-md-on-surface">Account details</h2>
        </div>
        <div className="bg-md-surface-container-low rounded-[32px] border border-md-outline-variant/10 p-10">
          <AccountDetails profile={profile} session={session} isLoading={isLoading} />
        </div>
      </section>

      <div className="pt-12 border-t border-md-outline-variant/10">
        <SignOutSection />
      </div>
    </div>
  );
}
