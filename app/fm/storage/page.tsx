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
        <p className="text-md-on-surface-variant animate-pulse font-medium text-[13px]">Analyzing your storage usage...</p>
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
    <div className="w-full max-w-5xl mx-auto px-8 py-10 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StorageHeader />

      <section className="space-y-6">
        <div className="flex items-center gap-4 text-md-on-surface-variant px-1">
          <Database className="w-6 h-6 text-md-primary" />
          <h2 className="text-2xl font-medium tracking-tight text-md-on-surface">Usage statistics</h2>
        </div>
        <StorageUsageCard 
          used={used} 
          limit={limit} 
          tierName={profile.tierName} 
          breakdown={breakdown} 
        />
      </section>

      <RecentHistory title="Recent distributions" />
    </div>
  );
}
