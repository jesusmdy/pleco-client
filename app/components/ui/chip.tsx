import React, { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface ChipProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "surface" | "error" | "success";
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Material Design 3 Expressive Chip
 * Pill-shaped container for labels, counts, and filters.
 */
export function Chip({
  children,
  variant = "surface",
  icon,
  className,
  onClick,
}: ChipProps) {
  const variants = {
    primary: "bg-md-primary/10 text-md-primary border-md-primary/20",
    secondary: "bg-md-primary-container/30 text-md-on-primary-container border-md-primary-container/20",
    surface: "bg-md-surface-container-high text-md-on-surface-variant border-md-outline-variant/10",
    error: "bg-md-error/10 text-md-error border-md-error/20",
    success: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-[13px] font-bold tracking-tight transition-all select-none",
        onClick && "cursor-pointer active:scale-[0.98] hover:bg-opacity-80",
        variants[variant],
        className
      )}
    >
      {icon && (
        <div className="w-4 h-4 flex items-center justify-center transition-transform group-hover:scale-110">
          {icon}
        </div>
      )}
      <span className="truncate">{children}</span>
    </Component>
  );
}
