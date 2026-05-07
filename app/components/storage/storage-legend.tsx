"use client";

import { formatBytes, cn } from "@/app/lib/utils";
import { File } from "lucide-react";
import { FILE_TYPE_CONFIG } from "./storage-config";

interface StorageLegendProps {
  breakdown: Record<string, number>;
}

export function StorageLegend({ breakdown }: StorageLegendProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-6 mt-8">
      {Object.entries(breakdown).map(([label, size]) => {
        const config = Object.values(FILE_TYPE_CONFIG).find(c => c.label === label) || { icon: File, color: "bg-md-on-surface-variant" };
        
        if (size <= 0) return null;

        return (
          <div key={label} className="space-y-2 group cursor-default transition-all">
            <div className="flex items-center gap-3">
              <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", config.color)} />
              <span className="text-md-on-surface-variant text-[12px] font-semibold tracking-tight group-hover:text-md-primary transition-all">
                {label}
              </span>
            </div>
            <div className="text-md-on-surface font-semibold text-[15px] leading-none px-5 tracking-tight">{formatBytes(size)}</div>
          </div>
        );
      })}
    </div>
  );
}
