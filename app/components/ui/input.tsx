import React, { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  error?: boolean;
  className?: string;
  containerClassName?: string;
}

/**
 * Material Design 3 Expressive Input
 * Supports labels, helper text, and leading/trailing slots with stadium rounding.
 */
export function Input({
  label,
  helperText,
  leading,
  trailing,
  error,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
      {label && (
        <label className="text-[12px] font-bold text-md-on-surface-variant ml-4 tracking-tight">
          {label}
        </label>
      )}
      
      <div className="relative group w-full">
        {leading && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-md-on-surface-variant group-focus-within:text-md-primary transition-colors pointer-events-none">
            {leading}
          </div>
        )}
        
        <input
          {...props}
          className={cn(
            "w-full bg-md-surface-container-highest text-md-on-surface rounded-full outline-none border transition-all placeholder:text-md-on-surface-variant/40 font-semibold tracking-tight",
            error 
              ? "border-md-error/50 focus:ring-4 focus:ring-md-error/10" 
              : "border-transparent focus:border-md-primary/30 focus:ring-4 focus:ring-md-primary/10",
            leading ? "pl-12" : "pl-6",
            trailing ? "pr-12" : "pr-6",
            "h-12 text-[14px]",
            className
          )}
        />
        
        {trailing && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-md-on-surface-variant">
            {trailing}
          </div>
        )}
      </div>

      {helperText && (
        <p className={cn(
          "text-[11px] font-medium ml-4 tracking-tight",
          error ? "text-md-error" : "text-md-on-surface-variant/60"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
}
