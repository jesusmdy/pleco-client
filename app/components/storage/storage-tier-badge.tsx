"use client";

interface StorageTierBadgeProps {
  tierName: string;
}

export function StorageTierBadge({ tierName }: StorageTierBadgeProps) {
  return (
    <div className="absolute top-0 right-0 p-3">
      <div className="bg-figma-blue/10 px-2 py-0.5 rounded-full border border-figma-blue/20">
        <span className="text-figma-blue font-bold text-[9px] uppercase tracking-widest">
          {tierName}
        </span>
      </div>
    </div>
  );
}
