"use client";

import { useEffect } from "react";
import { useViewStore } from "@/app/store/viewStore";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { theme, density } = useViewStore();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply Theme
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", isDark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", theme);
    }

    // Apply Density
    root.setAttribute("data-density", density);
  }, [theme, density]);

  return <>{children}</>;
}
