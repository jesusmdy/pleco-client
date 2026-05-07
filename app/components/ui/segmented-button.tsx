import React, { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface SegmentedButtonProps {
  children: ReactNode;
  className?: string;
}

/**
 * Material Design 3 Expressive Segmented Button Container
 * Used for toggling between related options or views.
 */
export function SegmentedButton({ children, className }: SegmentedButtonProps) {
  return (
    <div className={cn(
      "inline-flex p-1 rounded-2xl bg-md-surface-container-low border border-md-outline-variant/10",
      className
    )}>
      {children}
    </div>
  );
}

interface SegmentedButtonItemProps {
  children?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Material Design 3 Expressive Segmented Button Item
 */
export function SegmentedButtonItem({
  children,
  active,
  onClick,
  title,
  icon,
  className,
}: SegmentedButtonItemProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center justify-center gap-2 px-3 h-9 rounded-xl text-[13px] font-medium transition-all duration-200 select-none active:scale-[0.98] min-w-[36px] border border-transparent",
        active
          ? "bg-md-primary text-md-on-primary shadow-sm border-md-primary/10"
          : "text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface active:bg-md-surface-variant/30",
        className
      )}
    >
      {icon && <div className="shrink-0 transition-transform duration-200 group-active:scale-110">{icon}</div>}
      {children}
    </button>
  );
}
