import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UploadStatus = "queue" | "in_progress" | "completed" | "cancelled" | "error";

export interface UploadItem {
  id: string;
  file?: File; // Non-serializable, omitted in persistence
  name: string;
  size: number;
  parentId: string | null;
  status: UploadStatus;
  progress: number;
  type: "file" | "folder";
  relativePath?: string;
  children?: UploadItem[];
  error?: string;
  remoteId?: string;
}

interface UploadState {
  queue: UploadItem[];
  addFilesToQueue: (files: File[], parentId: string | null, isFolder?: boolean) => void;
  updateItemStatus: (id: string, status: UploadStatus, progress?: number, error?: string, remoteId?: string) => void;
  updateChildStatus: (parentId: string, childId: string, status: UploadStatus, progress?: number, remoteId?: string, resolvedParentId?: string) => void;
  cancelItem: (id: string) => void;
  dismissItem: (id: string) => void;
  clearCompleted: () => void;
}

export const useUploadStore = create<UploadState>()(
  persist(
    (set) => ({
      queue: [],
      
      addFilesToQueue: (files, parentId, isFolder = false) => set((state) => {
        if (!isFolder) {
          const newItems: UploadItem[] = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
            name: file.name,
            size: file.size,
            parentId,
            status: "queue",
            progress: 0,
            type: "file",
          }));
          return { queue: [...state.queue, ...newItems] };
        }

        // Folder logic: Group by top-level folder name
        const folderName = files[0].webkitRelativePath.split('/')[0];
        const group: UploadItem = {
          id: crypto.randomUUID(),
          name: folderName,
          size: files.reduce((acc, f) => acc + f.size, 0),
          parentId,
          status: "queue",
          progress: 0,
          type: "folder",
          children: files.map(file => ({
            id: crypto.randomUUID(),
            file,
            name: file.name,
            size: file.size,
            parentId: null, // Will be resolved during upload
            status: "queue",
            progress: 0,
            type: "file",
            relativePath: file.webkitRelativePath
          }))
        };

        return { queue: [...state.queue, group] };
      }),

      updateItemStatus: (id, status, progress, error, remoteId) => set((state) => ({
        queue: state.queue.map(item => 
          item.id === id 
            ? { 
                ...item, 
                status, 
                ...(progress !== undefined ? { progress } : {}), 
                ...(error ? { error } : {}),
                ...(remoteId ? { remoteId } : {})
              } 
            : item
        )
      })),

      updateChildStatus: (parentId, childId, status, progress, remoteId, resolvedParentId) => set((state) => ({
        queue: state.queue.map(item => {
          if (item.id === parentId && item.children) {
            const newChildren = item.children.map(child =>
              child.id === childId 
                ? { 
                    ...child, 
                    status, 
                    progress: progress ?? child.progress,
                    ...(remoteId ? { remoteId } : {}),
                    ...(resolvedParentId ? { parentId: resolvedParentId } : {})
                  } 
                : child
            );
            // Calculate overall progress for parent
            const totalProgress = newChildren.reduce((acc, c) => acc + c.progress, 0) / newChildren.length;
            const isAllDone = newChildren.every(c => c.status === "completed");
            const isAnyError = newChildren.some(c => c.status === "error");
            
            return { 
              ...item, 
              children: newChildren, 
              progress: totalProgress,
              status: isAllDone ? "completed" : isAnyError ? "error" : "in_progress"
            };
          }
          return item;
        })
      })),

      cancelItem: (id) => set((state) => ({
        queue: state.queue.map(item =>
          item.id === id && (item.status === "queue" || item.status === "in_progress")
            ? { ...item, status: "cancelled" }
            : item
        )
      })),

      dismissItem: (id) => set((state) => ({
        queue: state.queue.filter(item => item.id !== id)
      })),

      clearCompleted: () => set((state) => ({
        queue: state.queue.filter(item => item.status !== "completed")
      })),
    }),
    {
      name: 'pleco-upload-activity',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        queue: state.queue.map(({ file, ...rest }) => ({
          ...rest,
          // Omit file object, but preserve metadata
          status: (rest.status === "in_progress" || rest.status === "queue") ? "error" : rest.status,
          error: (rest.status === "in_progress" || rest.status === "queue") ? "Upload interrupted" : rest.error,
          children: rest.children?.map(({ file, ...childRest }) => ({ ...childRest }))
        }))
      }),
    }
  )
);
