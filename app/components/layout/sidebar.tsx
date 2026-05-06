"use client";

import { HardDrive, Activity, Trash2, Database } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStorageUsage } from "@/app/hooks/useStorageUsage";
import { useProfile } from "@/app/hooks/useProfile";
import { formatBytes } from "@/app/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const isDriveActive = (pathname === "/fm/drive" || pathname.startsWith("/fm/drive/folders")) && !pathname.includes("trash-bin");
  const isTrashActive = pathname === "/fm/drive/trash-bin";

  return (
    <div className="w-[200px] flex flex-col hidden md:flex bg-figma-dark h-full border-r border-white/5">
      <div className="flex-1 p-1.5 flex flex-col gap-0.5 mt-1">
        <Link
          href="/fm/drive"
          className={`rounded-md px-2 py-1.5 flex items-center gap-2 text-white transition-all hover:bg-figma-hover group ${isDriveActive ? 'bg-figma-blue/10 text-figma-blue shadow-[inset_0_0_0_1px_rgba(24,160,251,0.2)]' : 'bg-transparent text-figma-text-muted hover:text-white'}`}
        >
          <HardDrive className={`w-3.5 h-3.5 ${isDriveActive ? 'text-figma-blue' : 'text-figma-text-muted group-hover:text-white'}`} />
          <span className={`text-[12px] ${isDriveActive ? 'font-semibold' : 'font-medium'}`}>My Drive</span>
        </Link>



        <Link
          href="/fm/drive/trash-bin"
          className={`rounded-md px-2 py-1.5 flex items-center gap-2 text-white transition-all hover:bg-figma-hover group ${isTrashActive ? 'bg-figma-blue/10 text-figma-blue shadow-[inset_0_0_0_1px_rgba(24,160,251,0.2)]' : 'bg-transparent text-figma-text-muted hover:text-white'}`}
        >
          <Trash2 className={`w-3.5 h-3.5 ${isTrashActive ? 'text-figma-blue' : 'text-figma-text-muted group-hover:text-white'}`} />
          <span className={`text-[12px] ${isTrashActive ? 'font-semibold' : 'font-medium'}`}>Trash</span>
        </Link>
      </div>

      <div className="p-3 border-t border-white/5 bg-figma-bg/20">
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
    <Link href="/fm/storage" className="block group">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-figma-text-muted group-hover:text-white transition-colors">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Storage</span>
          </div>
          <span className="text-[10px] font-bold text-figma-blue">{Math.round(percentage)}%</span>
        </div>

        <div className="h-1.5 bg-figma-bg rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-figma-blue transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(24,160,251,0.4)]"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="text-[11px] text-figma-text-muted leading-tight">
          Using <span className="text-white font-semibold">{formatBytes(used)}</span><br />
          of {formatBytes(limit)}
        </div>
      </div>
    </Link>
  );
}
