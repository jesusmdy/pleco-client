"use client";

import { useStorageUsage } from "@/app/hooks/useStorageUsage";
import { useProfile } from "@/app/hooks/useProfile";
import { useRecentFiles } from "@/app/hooks/useRecentFiles";
import { formatBytes } from "@/app/lib/utils";
import { getHealth } from "@/app/lib/drive";
import { useEffect, useState } from "react";
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
  const [health, setHealth] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then(res => setHealth(res.status))
      .catch(() => setHealth("DOWN"));
  }, []);

  if (usageLoading || profileLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <p className="text-md-on-surface-variant animate-pulse font-medium text-[13px]">Analyzing your storage usage...</p>
        <div className="flex items-center gap-2 text-[12px] font-medium text-md-on-surface-variant/60 bg-md-surface-container rounded-full px-4 py-2 border border-md-outline-variant/10">
          <div className={`w-2 h-2 rounded-full ${health === "UP" ? "bg-green-500" : "bg-red-500"}`} />
          <span>Drive Service: {health === "UP" ? "Online" : health || "Checking..."}</span>
        </div>
      </div>
    );
  }

  if (!usage || !profile) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-8 px-8">
        <div className="text-center space-y-2">
          <Database className="w-12 h-12 text-md-primary/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-md-on-surface">Unable to load storage data</h2>
          <p className="text-md-on-surface-variant max-w-sm mx-auto">
            We couldn't reach the storage service. Please check your connection or contact support.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-[13px] font-semibold text-md-on-surface-variant bg-md-surface-container-high rounded-2xl px-6 py-4 border border-md-outline-variant/20 shadow-sm">
          <div className={`w-2.5 h-2.5 rounded-full ${health === "UP" ? "bg-green-500" : "bg-red-500"} shadow-[0_0_8px_rgba(34,197,94,0.4)]`} />
          <span>System Health: {health === "UP" ? "Service is Online" : "Service is Offline (403/500)"}</span>
        </div>
      </div>
    );
  }

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
