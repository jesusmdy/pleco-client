import { FileCard } from "@/app/components/drive/file-card";
import { UnifiedDriveItem } from "@/app/lib/api";

interface FileGridProps {
  items: UnifiedDriveItem[];
  isLoading: boolean;
}

export function FileGrid({ items, isLoading }: FileGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-discord-text-muted min-h-[200px]">
        <div className="w-10 h-10 border-4 border-white/10 border-t-discord-blurple rounded-full animate-spin" />
        <p>Fetching...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-discord-text-muted">
        <p>This folder is empty.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <FileCard key={item.id} item={item} />
      ))}
    </div>
  );
}
