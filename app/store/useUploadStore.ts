import { create } from 'zustand';

export type UploadStatus = "queue" | "in_progress" | "completed" | "cancelled" | "error";

export interface UploadItem {
  id: string;
  file: File;
  parentId: string | null;
  status: UploadStatus;
  progress: number;
}

interface UploadState {
  queue: UploadItem[];
  addFilesToQueue: (files: File[], parentId: string | null) => void;
  updateItemStatus: (id: string, status: UploadStatus, progress?: number) => void;
  cancelItem: (id: string) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  queue: [],
  addFilesToQueue: (files, parentId) => set((state) => {
    const newItems: UploadItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      parentId,
      status: "queue",
      progress: 0,
    }));
    return { queue: [...state.queue, ...newItems] };
  }),
  updateItemStatus: (id, status, progress) => set((state) => ({
    queue: state.queue.map(item => 
      item.id === id 
        ? { ...item, status, ...(progress !== undefined ? { progress } : {}) } 
        : item
    )
  })),
  cancelItem: (id) => set((state) => ({
    queue: state.queue.map(item =>
      item.id === id && (item.status === "queue" || item.status === "in_progress")
        ? { ...item, status: "cancelled" }
        : item
    )
  })),
}));
