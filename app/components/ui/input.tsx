import React, { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * Material Design 3 Expressive Input
 * Supports leading/trailing icons and stadium rounding.
 */
export function Input({
  leading,
  trailing,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn("relative group w-full", containerClassName)}>
      {leading && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-md-on-surface-variant group-focus-within:text-md-primary transition-colors pointer-events-none">
          {leading}
        </div>
      )}
      <input
        {...props}
        className={cn(
          "w-full bg-md-surface-container-highest text-md-on-surface rounded-full outline-none border border-transparent focus:border-md-primary/30 focus:ring-4 focus:ring-md-primary/10 transition-all placeholder:text-md-on-surface-variant/40 font-semibold tracking-tight",
          leading ? "pl-12" : "pl-6",
          trailing ? "pr-12" : "pr-6",
          "h-11 text-[14px]",
          className
        )}
      />
      {trailing && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-md-on-surface-variant">
          {trailing}
        </div>
      )}
    </div>
  );
}
