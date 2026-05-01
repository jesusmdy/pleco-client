"use client";

import { useUploadStore } from "@/app/store/useUploadStore";
import { ActivityHeader } from "@/app/components/drive/activity/activity-header";
import { ActivityList } from "@/app/components/drive/activity/activity-list";

export default function ActivityPage() {
  const { queue, cancelItem } = useUploadStore();

  return (
    <div>
      <ActivityHeader />
      <ActivityList queue={queue} onCancel={cancelItem} />
    </div>
  );
}
