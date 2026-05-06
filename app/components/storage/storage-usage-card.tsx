"use client";

import { formatBytes } from "@/app/lib/utils";
import { StorageProgressBar } from "./storage-progress-bar";
import { StorageLegend } from "./storage-legend";
import { StorageTierBadge } from "./storage-tier-badge";

interface StorageUsageCardProps {
  used: number;
  limit: number;
  tierName: string;
  breakdown: Record<string, number>;
}

export function StorageUsageCard({ used, limit, tierName, breakdown }: StorageUsageCardProps) {
  const percentage = Math.min(100, (used / limit) * 100);

  return (
    <div className="bg-md-surface-container-high rounded-[28px] p-8 shadow-[0_12px_48px_rgba(0,0,0,0.3)] relative overflow-hidden group border border-md-outline-variant/10">
      <StorageTierBadge tierName={tierName} />

      <div className="space-y-1 mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-md-on-surface tracking-tighter">
            {formatBytes(used).split(' ')[0]}
          </span>
          <span className="text-[18px] font-bold text-md-on-surface-variant">
            {formatBytes(used).split(' ')[1]} used
          </span>
        </div>
        <p className="text-md-primary text-[14px] font-bold tracking-wide uppercase">
          of {formatBytes(limit)} total capacity
        </p>
      </div>

      <StorageProgressBar 
        breakdown={breakdown} 
        limit={limit} 
        percentage={percentage} 
      />

      <StorageLegend breakdown={breakdown} />
    </div>
  );
}
