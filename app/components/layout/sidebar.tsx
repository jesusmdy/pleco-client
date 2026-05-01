"use client";

import { HardDrive, Activity } from "lucide-react";
import { UserProfileBar } from "@/app/components/ui/user-profile-bar";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  username?: string | null;
}

export function Sidebar({ username }: SidebarProps) {
  const pathname = usePathname();

  const isDriveActive = pathname === "/drive" || pathname.startsWith("/drive/folders");
  const isActivityActive = pathname === "/drive/activity";

  return (
    <div className="w-[240px] bg-discord-bg-secondary flex flex-col hidden md:flex border-r border-black/10">
      <div className="p-4 h-12 shadow-sm flex items-center border-b border-black/10">
        <h1 className="font-bold text-white truncate">Pleco Storage</h1>
      </div>

      <div className="flex-1 p-2 flex flex-col gap-1 mt-2">
        <Link 
          href="/drive"
          className={`rounded p-2 flex items-center gap-3 text-white transition-colors hover:bg-discord-bg-modifier-hover ${isDriveActive ? 'bg-discord-bg-modal/50' : 'bg-transparent'}`}
        >
          <HardDrive className={`w-5 h-5 ${isDriveActive ? 'text-white' : 'text-discord-text-muted'}`} />
          <span className="font-medium text-[15px]">My Drive</span>
        </Link>

        <Link 
          href="/drive/activity"
          className={`rounded p-2 flex items-center gap-3 text-white transition-colors hover:bg-discord-bg-modifier-hover ${isActivityActive ? 'bg-discord-bg-modal/50' : 'bg-transparent'}`}
        >
          <Activity className={`w-5 h-5 ${isActivityActive ? 'text-white' : 'text-discord-text-muted'}`} />
          <span className="font-medium text-[15px]">Activity</span>
        </Link>
      </div>

      <UserProfileBar username={username} />
    </div>
  );
}
