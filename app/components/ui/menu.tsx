import React, { ReactNode, forwardRef } from "react";
import { cn } from "@/app/lib/utils";

interface MenuProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Material Design 3 Menu Container
 * Level 2 Tonal Elevation with subtle borders and shadow.
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(
  ({ children, className, style }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-md-surface-container rounded-2xl shadow-xl border border-md-outline-variant/10 py-2 px-2 animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        style={style}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {children}
      </div>
    );
  }
);

Menu.displayName = "Menu";

interface MenuItemProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  icon?: ReactNode;
  variant?: "default" | "error";
  className?: string;
}

/**
 * Material Design 3 Menu Item
 * Follows Label-Large specs with expressive states.
 */
export function MenuItem({
  children,
  onClick,
  icon,
  variant = "default",
  className,
}: MenuItemProps) {
  const variantClasses =
    variant === "error"
      ? "text-md-error hover:bg-md-error/10"
      : "text-md-on-surface hover:bg-md-primary/10 hover:text-md-primary";

  const iconClasses =
    variant === "error"
      ? "text-md-error"
      : "text-md-on-surface-variant group-hover:text-md-primary";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-2.5 text-[14px] font-bold flex items-center gap-3.5 rounded-xl transition-all group active:scale-[0.98] outline-none",
        variantClasses,
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "w-5 h-5 flex items-center justify-center transition-all",
            iconClasses,
            variant === "error" && "group-hover:scale-110"
          )}
        >
          {icon}
        </div>
      )}
      <span className="truncate">{children}</span>
    </button>
  );
}

/**
 * Menu Separator
 */
export function MenuSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-[1px] bg-md-outline-variant/10 my-2 mx-2", className)}
    />
  );
}
