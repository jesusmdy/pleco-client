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
      case "queue": return <Clock className="w-5 h-5 text-discord-text-muted" />;
      case "in_progress": return <Loader2 className="w-5 h-5 text-discord-blurple animate-spin" />;
      case "completed": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled": return <XCircle className="w-5 h-5 text-discord-text-muted" />;
      case "error": return <AlertCircle className="w-5 h-5 text-discord-red" />;
    }
  };

  return (
    <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-4">
        {getStatusIcon(item.status)}
        <div>
          <p className="text-white font-medium">{item.file.name}</p>
          <p className="text-discord-text-muted text-[12px]">
            {formatSize(item.file.size)} • {item.status.replace("_", " ")}
          </p>
        </div>
      </div>
      
      {(item.status === "queue" || item.status === "in_progress") && (
        <button
          onClick={() => onCancel(item.id)}
          className="text-discord-text-muted hover:text-discord-red text-[14px] px-3 py-1 rounded transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
