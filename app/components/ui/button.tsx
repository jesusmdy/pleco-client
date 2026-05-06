import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link";
  isLoading?: boolean;
}

export function Button({ variant = "primary", isLoading, className = "", children, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-3 h-8 rounded-md font-medium transition-all cursor-pointer text-[12px] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-figma-blue hover:bg-figma-blue/90 text-white shadow-sm",
    secondary: "bg-figma-hover hover:bg-[#4a4a4a] text-white border border-white/5",
    ghost: "bg-transparent text-figma-text-muted hover:text-white hover:bg-figma-hover active:bg-white/5",
    link: "bg-transparent text-figma-blue hover:underline px-0 py-0 disabled:hover:no-underline"
  };

  return (
    <button 
      disabled={isLoading || props.disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {isLoading ? (
        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
