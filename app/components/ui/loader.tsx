"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Loader({ className, size = "md", label }: LoaderProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        {/* Outer Ring */}
        <div className={cn(
          "rounded-full border-md-outline-variant/30",
          sizeClasses[size]
        )} />
        {/* Spinning Ring */}
        <div className={cn(
          "absolute inset-0 rounded-full border-transparent border-t-md-primary animate-spin",
          sizeClasses[size]
        )} />
      </div>
      {label && (
        <p className="text-[12px] font-bold text-md-on-surface-variant tracking-wide uppercase opacity-80">
          {label}
        </p>
      )}
    </div>
  );
}
