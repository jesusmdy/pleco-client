"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[11px] font-semibold text-figma-text-muted select-none uppercase tracking-wider opacity-80">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`
            w-full h-8 px-2.5 
            bg-figma-dark 
            text-white 
            text-[13px]
            rounded-md
            transition-all duration-200
            border border-white/5
            focus:border-figma-blue/50 focus:ring-1 focus:ring-figma-blue/30
            outline-none
            placeholder:text-figma-text-muted/30
          `}
          {...props}
        />
        {error && (
          <span className="text-[11px] text-red-400 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
