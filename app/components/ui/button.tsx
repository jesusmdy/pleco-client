import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/app/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "tonal" | "outlined" | "text" | "error";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

/**
 * Material Design 3 Expressive Button
 * Follows stadium rounding and tonal elevation guidelines.
 */
export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2.5 rounded-full font-bold tracking-tight transition-all duration-200 cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-md-primary/50 border";

  const variants = {
    primary: "bg-md-primary text-md-on-primary hover:shadow-md hover:bg-opacity-90 border-md-primary/10",
    tonal: "bg-md-primary/10 text-md-primary hover:bg-md-primary/20 hover:shadow-sm border-md-primary/10",
    outlined: "bg-transparent text-md-primary border-md-outline-variant hover:bg-md-primary/5",
    text: "bg-transparent text-md-on-surface-variant hover:bg-md-surface-variant/20 border-transparent",
    error: "bg-md-error text-md-on-error hover:shadow-md hover:bg-opacity-90 border-md-error/10",
  };

  const sizes = {
    sm: "px-4 h-8 text-[12px]",
    md: "px-6 h-10 text-[13px]",
    lg: "px-8 h-12 text-[15px]",
    icon: "p-2.5 h-10 w-10",
  };

  return (
    <button
      disabled={isLoading || props.disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
