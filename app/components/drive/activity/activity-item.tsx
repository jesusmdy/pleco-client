import { UploadItem } from "@/app/store/useUploadStore";
import { XCircle, CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";

interface ActivityItemProps {
  item: UploadItem;
  onCancel: (id: string) => void;
}

export function ActivityItem({ item, onCancel }: ActivityItemProps) {
  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb > 1024) return `${(kb / 1024).toFixed(2)} MB`;
    return `${Math.round(kb)} KB`;
  };

  const getStatusIcon = (status: UploadItem["status"]) => {
    switch (status) {
      case "queue": return <Clock className="w-4 h-4 text-figma-text-muted" />;
      case "in_progress": return <Loader2 className="w-4 h-4 text-figma-blue animate-spin" />;
      case "completed": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-figma-text-muted" />;
      case "error": return <AlertCircle className="w-4 h-4 text-discord-red" />;
    }
  };

  return (
    <div className="p-3 flex items-center justify-between hover:bg-figma-hover transition-colors group">
      <div className="flex items-center gap-3">
        {getStatusIcon(item.status)}
        <div>
          <p className="text-white text-[13px] font-medium leading-tight">{item.file.name}</p>
          <p className="text-figma-text-muted text-[11px] mt-0.5 uppercase tracking-wide font-semibold">
            {formatSize(item.file.size)} • {item.status.replace("_", " ")}
          </p>
        </div>
      </div>
      
      {(item.status === "queue" || item.status === "in_progress") && (
        <button
          onClick={() => onCancel(item.id)}
          className="text-figma-text-muted hover:text-discord-red text-[11px] font-bold uppercase tracking-wider px-2 py-1 hover:bg-discord-red/10 rounded-md transition-all"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
