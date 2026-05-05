"use client";

import { HardDrive, Activity, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStorageUsage } from "@/app/hooks/useStorageUsage";
import { useProfile } from "@/app/hooks/useProfile";
import { formatBytes } from "@/app/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const isDriveActive = pathname === "/drive" || pathname.startsWith("/drive/folders");
  const isActivityActive = pathname === "/drive/activity";
  const isTrashActive = pathname === "/drive/trash";

  return (
    <div className="w-[240px] flex flex-col hidden md:flex bg-discord-bg-secondary h-screen">
      <div className="p-4 h-14 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-discord-blurple rounded-lg flex items-center justify-center shrink-0 shadow-lg">
          <HardDrive className="w-5 h-5 text-white transform -rotate-6" />
        </div>
        <h1 className="text-xl font-semibold text-white tracking-tight truncate">Pleco</h1>
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

      <div className="p-4 mt-auto">
        <StorageChip />
      </div>
    </div>
  );
}

function StorageChip() {
  const { data: usage } = useStorageUsage();
  const { data: profile } = useProfile();
  
  if (!usage || !profile) return null;

  const used = usage.totalSize;
  const limit = profile.storageLimitBytes;
  const percentage = Math.min(100, (used / limit) * 100);

  return (
    <Link href="/drive/storage" className="block group">
      <div className="bg-discord-bg-tertiary rounded-xl p-3 transition-colors group-hover:bg-discord-bg-modifier-hover border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-discord-text-muted text-xs font-bold uppercase tracking-wider">Storage</span>
          <span className="text-white text-[10px] font-bold bg-discord-blurple px-1.5 py-0.5 rounded uppercase">
            {profile.tierName}
          </span>
        </div>
        
        <div className="h-2 bg-discord-bg-tertiary rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-discord-blurple transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="text-discord-text-muted text-[11px] font-medium">
          <span className="text-white font-bold">{formatBytes(used)}</span> of {formatBytes(limit)} used
        </div>
      </div>
    </Link>
  );
}
