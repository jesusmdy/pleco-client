import { UploadItem } from "@/app/store/useUploadStore";
import { ActivityItem } from "./activity-item";

interface ActivityListProps {
  queue: UploadItem[];
  onCancel: (id: string) => void;
}

export function ActivityList({ queue, onCancel }: ActivityListProps) {
  if (queue.length === 0) {
    return (
      <div className="bg-figma-dark rounded-lg border border-black/50 overflow-hidden p-12 text-center shadow-xl">
        <p className="text-figma-text-muted text-[13px] font-medium italic">No active operations.</p>
      </div>
    );
  }

  return (
    <div className="bg-figma-dark rounded-lg border border-black/50 overflow-hidden shadow-xl">
      <div className="divide-y divide-white/5">
        {queue.slice().reverse().map((item) => (
          <ActivityItem key={item.id} item={item} onCancel={onCancel} />
        ))}
      </div>
    </div>
  );
}
