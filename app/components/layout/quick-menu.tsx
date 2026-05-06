"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Settings2, 
  Sun, 
  Moon, 
  Monitor, 
  Maximize, 
  Minimize, 
  HelpCircle, 
  Keyboard 
} from "lucide-react";
import { useViewStore, ThemeMode, DensityMode } from "@/app/store/viewStore";
import { cn } from "@/app/lib/utils";

export function QuickMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, density, setDensity } = useViewStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const THEMES: { id: ThemeMode; label: string; icon: any }[] = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  const DENSITIES: { id: DensityMode; label: string; icon: any }[] = [
    { id: "standard", label: "Standard", icon: Maximize },
    { id: "compact", label: "Compact", icon: Minimize },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
          isOpen 
            ? "bg-md-primary text-md-on-primary scale-110" 
            : "text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface"
        )}
      >
        <Settings2 className={cn("w-5 h-5 transition-transform duration-500", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute bottom-0 left-14 w-64 bg-md-surface-container-highest border border-md-outline-variant/10 rounded-[28px] shadow-xl p-4 z-[100] animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="space-y-6">
            {/* Theme Section */}
            <section className="space-y-3">
              <h3 className="text-[13px] font-semibold text-md-on-surface-variant tracking-tight px-2">
                Color scheme
              </h3>
              <div className="grid grid-cols-3 gap-2 bg-md-surface-container-low p-1.5 rounded-2xl">
                {THEMES.map((t) => {
                  const Icon = t.icon;
                  const isActive = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all",
                        isActive 
                          ? "bg-md-primary-container text-md-on-primary-container border border-md-primary/10" 
                          : "text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-bold">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Density Section */}
            <section className="space-y-3">
              <h3 className="text-[13px] font-semibold text-md-on-surface-variant tracking-tight px-2">
                UI density
              </h3>
              <div className="flex gap-2">
                {DENSITIES.map((d) => {
                  const Icon = d.icon;
                  const isActive = density === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDensity(d.id)}
                      className={cn(
                        "flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border border-transparent",
                        isActive 
                          ? "bg-md-secondary-container text-md-on-secondary-container border border-md-outline-variant/10" 
                          : "bg-md-surface-container-low text-md-on-surface-variant hover:bg-md-surface-variant/20"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[12px] font-bold">{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Extra Options */}
            <div className="pt-2 border-t border-md-outline-variant/10 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface transition-all">
                <Keyboard className="w-4 h-4" />
                <span className="text-[13px] font-medium">Keyboard Shortcuts</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface transition-all">
                <HelpCircle className="w-4 h-4" />
                <span className="text-[13px] font-medium">Help & Support</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
