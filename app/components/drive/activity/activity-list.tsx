import { UploadItem, useUploadStore } from "@/app/store/useUploadStore";
import { ActivityItem } from "./activity-item";
import { Trash2 } from "lucide-react";

interface ActivityListProps {
  queue: UploadItem[];
  onCancel: (id: string) => void;
}

export function ActivityList({ queue, onCancel }: ActivityListProps) {
  const clearCompleted = useUploadStore(state => state.clearCompleted);
  const hasCompleted = queue.some(item => item.status === "completed");

  if (queue.length === 0) {
    return (
      <div className="bg-md-surface-container rounded-3xl border border-md-outline-variant/10 overflow-hidden p-16 text-center shadow-lg">
        <p className="text-md-on-surface-variant text-[15px] font-bold italic">No active operations at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasCompleted && (
        <div className="flex justify-end">
          <button
            onClick={clearCompleted}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-md-on-surface-variant hover:text-md-error hover:bg-md-error/10 rounded-full transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear all completed
          </button>
        </div>
      )}
      <div className="bg-md-surface-container rounded-3xl border border-md-outline-variant/10 overflow-hidden shadow-lg">
        <div className="divide-y divide-md-outline-variant/10">
          {queue.slice().reverse().map((item) => (
            <ActivityItem key={item.id} item={item} onCancel={onCancel} />
          ))}
        </div>
      </div>
    </div>
  );
}
