import React from "react";
import { cn } from "@/app/lib/utils";
import { Plus, X } from "lucide-react";

interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "surface";
}

export function Fab({
  isOpen,
  variant = "primary",
  className,
  ...props
}: FabProps) {
  const variants = {
    primary: "bg-md-primary text-md-on-primary hover:bg-md-primary/90",
    secondary: "bg-md-secondary-container text-md-on-secondary-container hover:bg-opacity-90",
    tertiary: "bg-md-tertiary-container text-md-on-tertiary-container hover:bg-opacity-90",
    surface: "bg-md-surface-container-highest text-md-on-surface hover:bg-md-surface-variant/40",
  };

  return (
    <button
      className={cn(
        "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-400",
        "cubic-bezier(0.2, 0, 0, 1) hover:scale-105 hover:shadow-xl active:scale-95 outline-none cursor-pointer",
        "border",
        isOpen
          ? "bg-md-surface-container-highest text-md-on-surface border-md-outline-variant/30 rotate-180 scale-100"
          : cn("border-md-outline-variant/10", variants[variant]),
        className
      )}
      {...props}
    >
      <div className="relative w-6 h-6">
        <Plus className={cn(
          "absolute inset-0 transition-all duration-400 cubic-bezier(0.2, 0, 0, 1)",
          isOpen ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0"
        )} />
        <X className={cn(
          "absolute inset-0 transition-all duration-400 cubic-bezier(0.2, 0, 0, 1)",
          isOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"
        )} />
      </div>
    </button>
  );
}

interface FabActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "surface";
  delay?: number;
}

export function FabAction({
  icon,
  label,
  variant = "primary",
  delay = 0,
  className,
  ...props
}: FabActionProps) {
  const variants = {
    primary: "bg-md-primary-container text-md-on-primary-container hover:bg-md-primary/20",
    secondary: "bg-md-secondary-container text-md-on-secondary-container hover:bg-opacity-90",
    tertiary: "bg-md-tertiary-container text-md-on-tertiary-container hover:bg-opacity-90",
    surface: "bg-md-surface-container-highest text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary",
  };

  return (
    <button
      className={cn(
        "flex items-center gap-3 px-6 h-12 rounded-full shadow-md transition-all duration-400",
        "cubic-bezier(0.2, 0, 0, 1) hover:scale-102 hover:shadow-lg active:scale-98",
        "whitespace-nowrap border border-md-outline-variant/10 outline-none cursor-pointer",
        variants[variant],
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      <span className="shrink-0 transition-transform duration-400">{icon}</span>
      <span className="font-bold text-[14px] tracking-tight">{label}</span>
    </button>
  );
}

interface FabMenuProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function FabMenu({ children, isOpen, onOpenChange, className }: FabMenuProps) {
  return (
    <div className={cn("fixed bottom-8 right-8 flex flex-col items-end gap-4 z-[100]", className)}>
      {/* Menu Actions Container */}
      <div className={cn(
        "flex flex-col items-end gap-3 transition-all duration-400 cubic-bezier(0.05, 0.7, 0.1, 1.0)",
        "origin-[calc(100%-28px)_bottom]",
        isOpen
          ? "opacity-100 translate-y-0 scale-100 rotate-0 blur-0"
          : "opacity-0 translate-y-16 scale-50 -rotate-6 blur-sm pointer-events-none"
      )}>
        {children}
      </div>

      {/* Main FAB Trigger */}
      <Fab
        isOpen={isOpen}
        onClick={() => onOpenChange(!isOpen)}
        variant="primary"
      />

      {/* Subtle Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/5 z-[-1] transition-opacity duration-400",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => onOpenChange(false)}
      />
    </div>
  );
}
