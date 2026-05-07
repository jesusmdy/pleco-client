import React, { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface ListProps {
  children: ReactNode;
  className?: string;
}

/**
 * Material Design 3 Expressive List Container
 */
export function List({ children, className }: ListProps) {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      {children}
    </div>
  );
}

interface ListItemProps {
  children: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  supportingText?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  className?: string;
}

/**
 * Material Design 3 Expressive List Item
 * Supports leading/trailing slots and tactile feedback.
 */
export function ListItem({
  children,
  leading,
  trailing,
  supportingText,
  selected = false,
  onClick,
  onContextMenu,
  className,
}: ListItemProps) {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={cn(
        "flex items-center gap-4 py-3 px-4 cursor-pointer group transition-all duration-300 rounded-2xl active:scale-[0.98] select-none mx-2 my-0.5",
        selected 
          ? "bg-md-primary-container text-md-on-primary-container" 
          : "hover:bg-md-surface-container-low text-md-on-surface",
        className
      )}
    >
      {leading && <div className="shrink-0 flex items-center justify-center">{leading}</div>}
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="text-[15px] font-medium tracking-tight truncate">
          {children}
        </div>
        {supportingText && (
          <div className={cn(
            "text-[12px] font-medium opacity-60 truncate mt-0.5",
            selected ? "text-md-on-primary-container/80" : "text-md-on-surface-variant"
          )}>
            {supportingText}
          </div>
        )}
      </div>

      {trailing && <div className="shrink-0 flex items-center gap-4">{trailing}</div>}
    </div>
  );
}
