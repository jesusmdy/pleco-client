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
      <div className="flex flex-col gap-2 w-full">
        <label className="text-[12px] font-bold uppercase text-discord-text-muted select-none">
          {label}
          {required && <span className="text-discord-red ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`
            w-full h-10 px-3 
            bg-discord-bg-input 
            text-discord-text-primary 
            rounded-[3px] 
            transition-colors duration-200
            border-0
            focus:ring-0
          `}
          {...props}
        />
        {error && (
          <span className="text-[12px] text-discord-text-danger italic">
            - {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
