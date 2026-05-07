import React, { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface CardProps {
  children: ReactNode;
  variant?: "elevated" | "filled" | "outlined";
  selected?: boolean;
  className?: string;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

/**
 * Material Design 3 Expressive Card
 * Supports elevated, filled, and outlined types with high-density rounding.
 */
export function Card({
  children,
  variant = "elevated",
  selected = false,
  className,
  onClick,
  onContextMenu,
}: CardProps) {
  const baseStyles =
    "rounded-2xl transition-all duration-300 border overflow-hidden select-none";

  const variants = {
    elevated: selected
      ? "bg-md-primary-container text-md-on-primary-container border-md-primary/30"
      : "bg-md-surface-container-low hover:bg-md-surface-container-high border-md-outline-variant/10 shadow-sm hover:shadow-md text-md-on-surface",
    filled: selected
      ? "bg-md-primary-container text-md-on-primary-container border-md-primary/30"
      : "bg-md-surface-container-highest border-transparent hover:bg-opacity-80 text-md-on-surface",
    outlined: selected
      ? "bg-md-primary-container text-md-on-primary-container border-md-primary/30"
      : "bg-md-surface border-md-outline-variant/20 hover:bg-md-surface-variant/10 text-md-on-surface",
  };

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={cn(
        baseStyles,
        variants[variant],
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  );
}
