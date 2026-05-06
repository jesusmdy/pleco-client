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
    <div className="bg-figma-dark rounded-lg p-5 border border-white/5 shadow-2xl relative overflow-hidden group">
      <StorageTierBadge tierName={tierName} />

      <div className="space-y-0.5 mb-6">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-white tracking-tight">
            {formatBytes(used).split(' ')[0]}
          </span>
          <span className="text-sm font-bold text-figma-text-muted">
            {formatBytes(used).split(' ')[1]} used
          </span>
        </div>
        <p className="text-figma-text-muted text-[11px] font-semibold tracking-wide uppercase opacity-80">
          of {formatBytes(limit)} capacity
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
