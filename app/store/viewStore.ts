import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "grid" | "list";
export type ThemeMode = "light" | "dark" | "system";
export type DensityMode = "standard" | "compact";

interface ViewState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  density: DensityMode;
  setDensity: (density: DensityMode) => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      viewMode: "grid",
      setViewMode: (mode) => set({ viewMode: mode }),
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      density: "standard",
      setDensity: (density) => set({ density }),
    }),
    {
      name: "view-preferences-storage",
    }
  )
);
