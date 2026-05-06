"use client";

import { Grid, List as ListIcon } from "lucide-react";
import { useViewStore } from "@/app/store/viewStore";

interface ViewToggleProps {
  className?: string;
}

export function ViewToggle({ className = "" }: ViewToggleProps) {
  const { viewMode, setViewMode } = useViewStore();

  return (
    <div className={`flex bg-md-surface-container p-1 rounded-2xl border border-md-outline-variant/10 ${className}`}>
      <button
        onClick={() => setViewMode("grid")}
        className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-md-primary text-md-on-primary shadow-lg shadow-md-primary/20" : "text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-variant/20"}`}
        title="Grid View"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-md-primary text-md-on-primary shadow-lg shadow-md-primary/20" : "text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-surface-variant/20"}`}
        title="List View"
      >
        <ListIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
