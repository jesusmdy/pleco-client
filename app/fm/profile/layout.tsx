"use client";

import { ProfileSidebar } from "@/app/components/profile/profile-sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex overflow-hidden">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex h-full p-8 max-w-7xl mx-auto w-full gap-8 overflow-hidden">
          <ProfileSidebar />
          <main className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10 pb-20">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
