"use client";

import { Database } from "lucide-react";
import Link from "next/link";
import { formatBytes } from "@/app/lib/utils";

interface StorageChipProps {
  used: number;
  limit: number;
  percentage: number;
}

export function StorageChip({ used, limit, percentage }: StorageChipProps) {
  return (
    <Link href="/fm/storage" className="block group">
      <div className="relative overflow-hidden bg-md-surface-container-high rounded-[24px] p-5 border border-md-outline-variant/10 transition-all duration-300 shadow-sm hover:bg-md-surface-container-highest active:scale-[0.98]">
        {/* Progress Background */}
        <div className="absolute inset-0 bg-md-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative space-y-4">
          <div className="flex items-center justify-between text-md-on-surface-variant">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-md-primary/10 rounded-xl">
                <Database className="w-4 h-4 text-md-primary" />
              </div>
              <span className="text-[12px] font-semibold tracking-tight opacity-80">Storage</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[16px] font-black text-md-primary leading-none">{Math.round(percentage)}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-2.5 bg-md-surface-container-highest rounded-full overflow-hidden p-0.5 border border-md-outline-variant/5">
              <div
                className="h-full bg-md-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex justify-between items-baseline px-0.5">
              <div className="text-[12px] text-md-on-surface-variant leading-none">
                <span className="text-md-on-surface font-bold">{formatBytes(used)}</span>
                <span className="mx-1 opacity-40">/</span>
                <span className="opacity-70">{formatBytes(limit)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
