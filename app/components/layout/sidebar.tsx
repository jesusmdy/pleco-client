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
    <div className="w-[240px] flex flex-col hidden md:flex bg-md-surface-container-low h-full border-r border-md-outline-variant/10 shadow-2xl z-10">
      <div className="flex-1 p-3 flex flex-col gap-2 mt-4">
        <Link
          href="/fm/drive"
          className={`rounded-2xl px-5 py-3 flex items-center gap-3.5 transition-all group ${isDriveActive ? 'bg-md-primary-container text-md-on-primary-container font-semibold shadow-md shadow-black/20' : 'bg-transparent text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface'}`}
        >
          <HardDrive className={`w-5 h-5 ${isDriveActive ? 'text-md-primary' : 'text-md-on-surface-variant group-hover:text-md-on-surface'}`} />
          <span className="text-[15px]">My Drive</span>
        </Link>

        <Link
          href="/fm/drive/trash-bin"
          className={`rounded-2xl px-5 py-3 flex items-center gap-3.5 transition-all group ${isTrashActive ? 'bg-md-primary-container text-md-on-primary-container font-semibold shadow-md shadow-black/20' : 'bg-transparent text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface'}`}
        >
          <Trash2 className={`w-5 h-5 ${isTrashActive ? 'text-md-primary' : 'text-md-on-surface-variant group-hover:text-md-on-surface'}`} />
          <span className="text-[15px]">Trash</span>
        </Link>
      </div>

      <div className="p-6 border-t border-md-outline-variant/10 bg-md-surface-container-lowest/30">
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
      <div className="space-y-4">
        <div className="flex items-center justify-between text-md-on-surface-variant group-hover:text-md-on-surface transition-colors">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="text-[12px] font-bold uppercase tracking-[0.1em]">Storage</span>
          </div>
          <span className="text-[11px] font-bold text-md-primary">{Math.round(percentage)}%</span>
        </div>

        <div className="h-2 bg-md-surface-container-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-md-primary transition-all duration-500 rounded-full shadow-lg shadow-md-primary/20"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="text-[12px] text-md-on-surface-variant leading-relaxed">
          Using <span className="text-md-on-surface font-semibold">{formatBytes(used)}</span><br />
          of {formatBytes(limit)}
        </div>
      </div>
    </Link>
  );
}
