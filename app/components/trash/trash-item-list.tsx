import { Trash2 } from "lucide-react";
import { TrashItem } from "@/app/lib/drive";
import { TrashItemRow } from "./trash-item-row";

interface TrashItemListProps {
  items: TrashItem[];
  isLoading: boolean;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Trash2 className="w-12 h-12 text-discord-text-muted opacity-40" />
      <p className="text-discord-text-muted text-[15px]">Trash is empty</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-lg animate-pulse">
          <div className="w-4 h-4 bg-white/10 rounded" />
          <div className="w-5 h-5 bg-white/10 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-white/10 rounded w-48" />
            <div className="h-2 bg-white/5 rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrashItemList({ items, isLoading, selectedIds, onToggle }: TrashItemListProps) {
  if (isLoading) return <LoadingSkeleton />;
  if (items.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-1">
      {items.map(item => (
        <TrashItemRow
          key={item.id}
          item={item}
          isSelected={selectedIds.has(item.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
