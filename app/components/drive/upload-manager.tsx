"use client";

import { useEffect, useRef } from "react";
import { useUploadStore } from "@/app/store/useUploadStore";
import { uploadDriveFile } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

export function UploadManager() {
  const { queue, updateItemStatus } = useUploadStore();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const processingRef = useRef(false);

  useEffect(() => {
    if (!session?.backendToken || processingRef.current) return;

    const nextItem = queue.find(item => item.status === "queue");
    if (!nextItem) return;

    const processNext = async () => {
      processingRef.current = true;
      updateItemStatus(nextItem.id, "in_progress", 0);

      try {
        await uploadDriveFile(nextItem.file, nextItem.parentId, session.backendToken);
        updateItemStatus(nextItem.id, "completed", 100);
        // Invalidate cache to show new file
        queryClient.invalidateQueries({ queryKey: ["folderContent", nextItem.parentId || "root"] });
      } catch (error) {
        updateItemStatus(nextItem.id, "error");
      } finally {
        processingRef.current = false;
        // The dependency array will re-trigger this effect
      }
    };

    processNext();
  }, [queue, session, updateItemStatus, queryClient]);

  return null; // Invisible manager
}
