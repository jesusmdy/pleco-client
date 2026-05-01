import { UploadItem } from "@/app/store/useUploadStore";
import { ActivityItem } from "./activity-item";

interface ActivityListProps {
  queue: UploadItem[];
  onCancel: (id: string) => void;
}

export function ActivityList({ queue, onCancel }: ActivityListProps) {
  if (queue.length === 0) {
    return (
      <div className="bg-discord-bg-secondary rounded-lg border border-white/5 overflow-hidden p-12 text-center">
        <p className="text-discord-text-muted font-medium">No recent activity.</p>
        <p className="text-discord-text-muted/60 text-[14px] mt-1">Uploads will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-discord-bg-secondary rounded-lg border border-white/5 overflow-hidden">
      <div className="divide-y divide-white/5">
        {queue.slice().reverse().map((item) => (
          <ActivityItem key={item.id} item={item} onCancel={onCancel} />
        ))}
      </div>
    </div>
  );
}
