import { create } from "zustand";

interface SelectionState {
  selectedIds: Set<string>;
  toggle: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set(),

  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { selectedIds: next };
    }),

  clear: () => set({ selectedIds: new Set() }),

  isSelected: (id) => get().selectedIds.has(id),
}));
