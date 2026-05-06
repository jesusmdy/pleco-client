"use client";

import { useStorageUsage } from "@/app/hooks/useStorageUsage";
import { useProfile } from "@/app/hooks/useProfile";
import { useRecentFiles } from "@/app/hooks/useRecentFiles";
import { formatBytes } from "@/app/lib/utils";
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Archive, 
  File, 
  ChevronRight, 
  History,
  Database
} from "lucide-react";
import Link from "next/link";
import { StorageHeader } from "@/app/components/storage/storage-header";
import { StorageUsageCard } from "@/app/components/storage/storage-usage-card";
import { RecentHistory } from "@/app/components/drive/activity/recent-history";
import { FILE_TYPE_CONFIG } from "@/app/components/storage/storage-config";

export default function StoragePage() {
  const { data: usage, isLoading: usageLoading } = useStorageUsage();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (usageLoading || profileLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-figma-text-muted animate-pulse font-medium">Loading storage dashboard...</p>
      </div>
    );
  }

  if (!usage || !profile) return null;

  const used = usage.totalSize;
  const limit = profile.storageLimitBytes;

  const breakdown = Object.entries(usage.sizeByType || {}).reduce((acc, [mime, size]) => {
    let category = "Others";
    for (const [key, config] of Object.entries(FILE_TYPE_CONFIG)) {
      if (mime.startsWith(key)) {
        category = config.label;
        break;
      }
    }
    acc[category] = (acc[category] || 0) + size;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full overflow-y-auto p-5 w-[65%] mx-auto space-y-8 scrollbar-thin scrollbar-thumb-white/5">
      <StorageHeader />

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-figma-text-muted">
          <Database className="w-3.5 h-3.5" />
          <h2 className="text-[10px] font-bold uppercase tracking-wider opacity-80">Usage Statistics</h2>
        </div>
        <StorageUsageCard 
          used={used} 
          limit={limit} 
          tierName={profile.tierName} 
          breakdown={breakdown} 
        />
      </section>

      <RecentHistory title="Recent Distributions" />
    </div>
  );
}
