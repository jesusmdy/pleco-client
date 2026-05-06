"use client";

import { formatBytes } from "@/app/lib/utils";
import { FILE_TYPE_CONFIG } from "./storage-config";

interface StorageProgressBarProps {
  breakdown: Record<string, number>;
  limit: number;
  percentage: number;
}

export function StorageProgressBar({ breakdown, limit, percentage }: StorageProgressBarProps) {
  return (
    <div className="relative">
      <div className="h-2.5 bg-figma-bg rounded-full overflow-hidden flex shadow-inner border border-white/5">
        {Object.entries(breakdown).map(([label, size]) => {
          const categoryPercentage = (size / limit) * 100;
          const config = Object.values(FILE_TYPE_CONFIG).find(c => c.label === label) || { color: "bg-figma-text-muted" };
          
          if (categoryPercentage <= 0) return null;

          return (
            <div 
              key={label}
              className={`h-full ${config.color} transition-all duration-700 ease-out`}
              style={{ width: `${categoryPercentage}%` }}
              title={`${label}: ${formatBytes(size)}`}
            />
          );
        })}
        {/* Remainder space */}
        <div 
          className="h-full bg-transparent" 
          style={{ width: `${Math.max(0, 100 - percentage)}%` }} 
        />
      </div>
    </div>
  );
}
