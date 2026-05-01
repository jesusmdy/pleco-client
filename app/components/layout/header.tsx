"use client";

import { useSession } from "next-auth/react";
import { Search, Bell } from "lucide-react";
import { UserProfileBar } from "@/app/components/ui/user-profile-bar";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-discord-bg-primary shrink-0">
      <div className="flex-1 max-w-2xl mr-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-discord-text-muted" />
          <input 
            type="text" 
            placeholder="Search files and folders..." 
            className="w-full bg-discord-bg-tertiary text-white text-[14px] rounded-full pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-discord-blurple border border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2 text-discord-text-muted mr-2">
          <Link href="/drive/activity" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </Link>
        </div>
        <UserProfileBar username={session?.username} />
      </div>
    </header>
  );
}
