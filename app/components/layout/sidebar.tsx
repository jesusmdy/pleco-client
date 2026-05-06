"use client";

import { HardDrive, Activity, Trash2, Database } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStorageUsage } from "@/app/hooks/useStorageUsage";
import { useProfile } from "@/app/hooks/useProfile";
import { formatBytes } from "@/app/lib/utils";

import { StorageChip } from "@/app/components/ui/storage-chip";

export function Sidebar() {
  const pathname = usePathname();

  const isDriveActive = (pathname === "/fm/drive" || pathname.startsWith("/fm/drive/folders")) && !pathname.includes("trash-bin");
  const isTrashActive = pathname === "/fm/drive/trash-bin";

  const { data: usage } = useStorageUsage();
  const { data: profile } = useProfile();

  const used = usage?.totalSize || 0;
  const limit = profile?.storageLimitBytes || 1;
  const percentage = Math.min(100, (used / limit) * 100);

  return (
    <div className="w-sidebar flex flex-col hidden md:flex bg-md-surface-container-low h-full border-r border-md-outline-variant/10 z-10 transition-all duration-300 ease-in-out">
      <div className="flex-1 p-3 flex flex-col gap-2 mt-4">
        <Link
          href="/fm/drive"
          className={`rounded-2xl px-5 py-3 flex items-center gap-3.5 transition-all group ${isDriveActive ? 'bg-md-primary-container text-md-on-primary-container font-semibold' : 'bg-transparent text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface'}`}
        >
          <HardDrive className={`w-5 h-5 ${isDriveActive ? 'text-md-primary' : 'text-md-on-surface-variant group-hover:text-md-on-surface'}`} />
          <span className="text-[15px]">My Drive</span>
        </Link>

        <Link
          href="/fm/drive/trash-bin"
          className={`rounded-2xl px-5 py-3 flex items-center gap-3.5 transition-all group ${isTrashActive ? 'bg-md-primary-container text-md-on-primary-container font-semibold' : 'bg-transparent text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface'}`}
        >
          <Trash2 className={`w-5 h-5 ${isTrashActive ? 'text-md-primary' : 'text-md-on-surface-variant group-hover:text-md-on-surface'}`} />
          <span className="text-[15px]">Trash</span>
        </Link>
      </div>

      <div className="p-4 border-t border-md-outline-variant/10 bg-md-surface-container-lowest/30">
        {usage && profile && (
          <StorageChip used={used} limit={limit} percentage={percentage} />
        )}
      </div>
    </div>
  );
}
