"use client";

import { HardDrive, Activity, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const isDriveActive = pathname === "/drive" || pathname.startsWith("/drive/folders");
  const isActivityActive = pathname === "/drive/activity";
  const isTrashActive = pathname === "/drive/trash";

  return (
    <div className="w-[240px] flex flex-col hidden md:flex">
      <div className="p-4 h-14 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-discord-blurple rounded-lg flex items-center justify-center shrink-0 shadow-lg">
          <HardDrive className="w-5 h-5 text-white transform -rotate-6" />
        </div>
        <h1 className="font-black text-white text-xl tracking-tight truncate">Pleco</h1>
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

        <Link
          href="/drive/trash"
          className={`rounded p-2 flex items-center gap-3 text-white transition-colors hover:bg-discord-bg-modifier-hover ${isTrashActive ? 'bg-discord-bg-modal/50' : 'bg-transparent'}`}
        >
          <Trash2 className={`w-5 h-5 ${isTrashActive ? 'text-white' : 'text-discord-text-muted'}`} />
          <span className="font-medium text-[15px]">Trash</span>
        </Link>
      </div>
    </div>
  );
}
