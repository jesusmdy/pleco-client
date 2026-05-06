import { UploadItem } from "@/app/store/useUploadStore";
import { ActivityItem } from "./activity-item";

interface ActivityListProps {
  queue: UploadItem[];
  onCancel: (id: string) => void;
}

export function ActivityList({ queue, onCancel }: ActivityListProps) {
  if (queue.length === 0) {
    return (
      <div className="bg-md-surface-container rounded-2xl border border-md-outline-variant/10 overflow-hidden p-16 text-center shadow-lg">
        <p className="text-md-on-surface-variant text-[15px] font-bold italic">No active operations at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-md-surface-container rounded-2xl border border-md-outline-variant/10 overflow-hidden shadow-lg">
      <div className="divide-y divide-md-outline-variant/10">
        {queue.slice().reverse().map((item) => (
          <ActivityItem key={item.id} item={item} onCancel={onCancel} />
        ))}
      </div>
    </div>
  );
}
