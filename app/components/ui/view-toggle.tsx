"use client";

import { Grid, List as ListIcon } from "lucide-react";
import { useViewStore } from "@/app/store/viewStore";
import { SegmentedButton, SegmentedButtonItem } from "./segmented-button";

interface ViewToggleProps {
  className?: string;
}

export function ViewToggle({ className = "" }: ViewToggleProps) {
  const { viewMode, setViewMode } = useViewStore();

  return (
    <SegmentedButton className={className}>
      <SegmentedButtonItem
        active={viewMode === "grid"}
        onClick={() => setViewMode("grid")}
        title="Grid View"
        icon={<Grid className="w-4 h-4" />}
      />
      <SegmentedButtonItem
        active={viewMode === "list"}
        onClick={() => setViewMode("list")}
        title="List View"
        icon={<ListIcon className="w-4 h-4" />}
      />
    </SegmentedButton>
  );
}
