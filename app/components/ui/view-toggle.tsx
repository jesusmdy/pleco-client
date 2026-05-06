"use client";

import { Grid, List as ListIcon } from "lucide-react";
import { useViewStore } from "@/app/store/viewStore";

interface ViewToggleProps {
  className?: string;
}

export function ViewToggle({ className = "" }: ViewToggleProps) {
  const { viewMode, setViewMode } = useViewStore();

  return (
    <div className={`flex bg-figma-bg p-0.5 rounded-md border border-white/5 ${className}`}>
      <button
        onClick={() => setViewMode("grid")}
        className={`p-1 rounded transition-all ${viewMode === "grid" ? "bg-figma-hover text-white shadow-sm" : "text-figma-text-muted hover:text-white"}`}
        title="Grid View"
      >
        <Grid className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`p-1 rounded transition-all ${viewMode === "list" ? "bg-figma-hover text-white shadow-sm" : "text-figma-text-muted hover:text-white"}`}
        title="List View"
      >
        <ListIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
