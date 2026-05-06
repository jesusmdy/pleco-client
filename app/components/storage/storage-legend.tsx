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
        const config = Object.values(FILE_TYPE_CONFIG).find(c => c.label === label) || { icon: File, color: "bg-md-on-surface-variant" };
        
        if (size <= 0) return null;

        return (
          <div key={label} className="space-y-1 group cursor-default">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${config.color} shadow-sm`} />
              <span className="text-md-on-surface-variant text-[10px] font-bold uppercase tracking-widest group-hover:text-md-primary transition-all">
                {label}
              </span>
            </div>
            <div className="text-md-on-surface font-bold text-[15px] leading-none px-4">{formatBytes(size)}</div>
          </div>
        );
      })}
    </div>
  );
}
