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
      <div className="flex flex-col gap-2 w-full group">
        <label className="text-[12px] font-bold text-md-on-surface-variant select-none tracking-wide group-focus-within:text-md-primary transition-colors">
          {label}
          {required && <span className="text-md-error ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`
            w-full h-10 px-3.5 
            bg-md-surface-container-highest 
            text-md-on-surface 
            text-[14px]
            rounded-xl
            transition-all duration-200
            border border-md-outline-variant
            focus:border-md-primary focus:ring-2 focus:ring-md-primary/20
            outline-none
            placeholder:text-md-on-surface-variant/40
          `}
          {...props}
        />
        {error && (
          <span className="text-[12px] text-md-error font-bold">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
