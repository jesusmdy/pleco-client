"use client";

import { HardDrive, Activity, Trash2, Database } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStorageUsage } from "@/app/hooks/useStorageUsage";
import { useProfile } from "@/app/hooks/useProfile";
import { formatBytes } from "@/app/lib/utils";

import { StorageChip } from "@/app/components/ui/storage-chip";
import { cn } from "@/app/lib/utils";
import { DriveTree } from "./drive-tree";

export function Sidebar() {
  const pathname = usePathname();

  const isTrashActive = pathname === "/fm/drive/trash-bin";

  const { data: usage } = useStorageUsage();
  const { data: profile } = useProfile();

  const used = usage?.totalSize || 0;
  const limit = profile?.storageLimitBytes || 1;
  const percentage = Math.min(100, (used / limit) * 100);

  return (
    <div className="w-sidebar flex flex-col hidden md:flex bg-md-surface-container-low h-full border-r border-md-outline-variant/10 z-10 transition-all duration-500 ease-in-out">
      <div className="flex-1 p-3 flex flex-col gap-1 mt-6 overflow-y-auto custom-scrollbar">
        <DriveTree />

        <div className="my-1 border-t border-md-outline-variant/5 mx-2" />

        <Link
          href="/fm/drive/trash-bin"
          className={cn(
            "rounded-full px-6 py-3 flex items-center gap-4 transition-all duration-300 group",
            isTrashActive 
              ? 'bg-md-primary-container text-md-on-primary-container font-semibold' 
              : 'bg-transparent text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface'
          )}
        >
          <Trash2 className={cn(
            "w-5 h-5 transition-colors",
            isTrashActive ? 'text-md-primary' : 'text-md-on-surface-variant group-hover:text-md-on-surface'
          )} />
          <span className="text-[14px] tracking-wide">Trash</span>
        </Link>
      </div>

      <div className="p-4 mt-auto mb-6 border-t border-md-outline-variant/10 bg-md-surface-container-lowest/30">
        {usage && profile && (
          <StorageChip used={used} limit={limit} percentage={percentage} />
        )}
      </div>
    </div>
  );
}
