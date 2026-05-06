"use client";

interface StorageTierBadgeProps {
  tierName: string;
}

export function StorageTierBadge({ tierName }: StorageTierBadgeProps) {
  return (
    <div className="absolute top-0 right-0 p-5">
      <div className="bg-md-primary-container px-3 py-1 rounded-full shadow-sm border border-md-primary/10">
        <span className="text-md-on-primary-container font-bold text-[11px] uppercase tracking-widest">
          {tierName}
        </span>
      </div>
    </div>
  );
}
