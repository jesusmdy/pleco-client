"use client";

import { formatBytes } from "@/app/lib/utils";
import { File } from "lucide-react";
import { FILE_TYPE_CONFIG } from "./storage-config";

interface StorageLegendProps {
  breakdown: Record<string, number>;
}

export function StorageLegend({ breakdown }: StorageLegendProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 mt-5">
      {Object.entries(breakdown).map(([label, size]) => {
        const config = Object.values(FILE_TYPE_CONFIG).find(c => c.label === label) || { icon: File, color: "bg-figma-text-muted" };
        
        if (size <= 0) return null;

        return (
          <div key={label} className="space-y-0.5 group cursor-default">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${config.color} shadow-[0_0_8px_rgba(24,160,251,0.1)]`} />
              <span className="text-figma-text-muted text-[9px] font-bold uppercase tracking-[0.05em] group-hover:text-white transition-colors">
                {label}
              </span>
            </div>
            <div className="text-white font-bold text-sm leading-none">{formatBytes(size)}</div>
          </div>
        );
      })}
    </div>
  );
}
