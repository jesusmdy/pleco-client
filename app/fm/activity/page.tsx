"use client";

import { useUploadStore } from "@/app/store/useUploadStore";
import { ActivityHeader } from "@/app/components/drive/activity/activity-header";
import { ActivityList } from "@/app/components/drive/activity/activity-list";
import { RecentHistory } from "@/app/components/drive/activity/recent-history";
import { CloudUpload } from "lucide-react";

export default function ActivityPage() {
  const { queue, cancelItem } = useUploadStore();

  return (
    <div className="h-full overflow-y-auto p-6 w-[60%] mx-auto space-y-10 scrollbar-thin scrollbar-thumb-white/5">
      <ActivityHeader />

      <div className="flex flex-col gap-10">
        {/* Section 1: Live Uploads (On Top) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-figma-text-muted">
            <CloudUpload className="w-4 h-4" />
            <h2 className="text-[11px] font-bold uppercase tracking-wider">Live Activity</h2>
          </div>
          <ActivityList queue={queue} onCancel={cancelItem} />
        </section>

        {/* Section 2: Recent History (Below) */}
        <RecentHistory />
      </div>
    </div>
  );
}
