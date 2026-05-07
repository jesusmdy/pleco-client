"use client";

import { useEffect, useRef } from "react";
import { useUploadStore } from "@/app/store/useUploadStore";
import { uploadDriveFile, createFolder } from "@/app/lib/drive";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

export function UploadManager() {
  const { queue, updateItemStatus, updateChildStatus } = useUploadStore();
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
        if (nextItem.type === "file") {
          if (!nextItem.file) throw new Error("File missing");
          await uploadDriveFile(nextItem.file, nextItem.parentId, session.backendToken);
          updateItemStatus(nextItem.id, "completed", 100);
        } else {
          // Folder upload
          const folderCache: Record<string, string> = {};
          
          // 1. Create root folder
          const rootFolder = await createFolder(nextItem.name, nextItem.parentId, session.backendToken!);
          folderCache[nextItem.name] = rootFolder.id;
          
          // 2. Process children
          const children = nextItem.children || [];
          for (let idx = 0; idx < children.length; idx++) {
            const child = children[idx];
            updateChildStatus(nextItem.id, child.id, "in_progress", 0);
            
            try {
              // Resolve correct parentId based on path
              const parts = child.relativePath?.split('/') || [];
              let currentParentId = rootFolder.id;
              
              // Iterate through path parts (excluding root and file name)
              let pathAcc = parts[0];
              for (let i = 1; i < parts.length - 1; i++) {
                const part = parts[i];
                pathAcc += '/' + part;
                
                if (!folderCache[pathAcc]) {
                  const folder = await createFolder(part, currentParentId, session.backendToken!);
                  folderCache[pathAcc] = folder.id;
                }
                currentParentId = folderCache[pathAcc];
              }
              
              if (!child.file) throw new Error("File missing in child");
              await uploadDriveFile(child.file, currentParentId, session.backendToken!);
              updateChildStatus(nextItem.id, child.id, "completed", 100);
            } catch (err) {
              updateChildStatus(nextItem.id, child.id, "error", 0);
              // We continue with other files in the folder
            }
          }
          // Parent status is updated by updateChildStatus in store
        }
        
        // Invalidate cache to show new items
        queryClient.invalidateQueries({ queryKey: ["folderContent", nextItem.parentId || "root"] });
      } catch (error) {
        updateItemStatus(nextItem.id, "error", undefined, (error as Error).message);
      } finally {
        processingRef.current = false;
      }
    };

    processNext();
  }, [queue, session, updateItemStatus, updateChildStatus, queryClient]);

  return null; // Invisible manager
}
