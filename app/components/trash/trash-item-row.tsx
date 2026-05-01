import { FileIcon, Folder } from "lucide-react";
import { TrashItem } from "@/app/lib/drive";

interface TrashItemRowProps {
  item: TrashItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function TrashItemRow({ item, isSelected, onToggle }: TrashItemRowProps) {
  const isFolder = item.itemType === "FOLDER";

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors cursor-pointer group ${
        isSelected ? "bg-white/5" : "hover:bg-white/5"
      }`}
      onClick={() => onToggle(item.id)}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(item.id)}
        onClick={e => e.stopPropagation()}
        className="w-4 h-4 rounded accent-discord-blurple cursor-pointer shrink-0"
      />

      <div className={`shrink-0 ${isFolder ? "text-discord-text-muted" : "text-discord-text-muted"}`}>
        {isFolder ? (
          <Folder className="w-5 h-5 text-yellow-400/70" />
        ) : (
          <FileIcon className="w-5 h-5 text-discord-text-muted" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-[14px] font-medium truncate">{item.name}</p>
        <p className="text-discord-text-muted text-[12px]">
          {formatDate(item.trashedAt) ? `Deleted ${formatDate(item.trashedAt)}` : ""}
          {item.mimeType && formatDate(item.trashedAt) ? ` · ${item.mimeType}` : item.mimeType ?? ""}
        </p>
      </div>

      {item.size && (
        <span className="text-discord-text-muted text-[13px] shrink-0">
          {formatBytes(item.size)}
        </span>
      )}
    </div>
  );
}
