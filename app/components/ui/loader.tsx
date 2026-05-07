"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Loader({ className, size = "md", label }: LoaderProps) {
  const sizeMap = {
    sm: { container: "w-5 h-5", stroke: 4, radius: 18 },
    md: { container: "w-10 h-10", stroke: 4.5, radius: 18 },
    lg: { container: "w-16 h-16", stroke: 5, radius: 18 },
  };

  const { container, stroke, radius } = sizeMap[size];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className={cn("relative animate-md-circular", container)}>
        <svg
          viewBox="0 0 48 48"
          className="absolute inset-0 w-full h-full"
        >
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            className="text-md-primary animate-md-circular-dash"
          />
        </svg>
      </div>
      {label && (
        <p className="text-[14px] font-bold text-md-on-surface-variant tracking-tight animate-pulse opacity-90">
          {label}
        </p>
      )}
    </div>
  );
}
