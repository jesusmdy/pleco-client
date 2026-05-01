import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link";
  isLoading?: boolean;
}

export function Button({ variant = "primary", isLoading, className = "", children, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded font-medium transition-all cursor-pointer text-[14px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none";
  
  const variants = {
    primary: "bg-discord-blurple hover:bg-discord-blurple/90 text-white shadow-sm hover:shadow-md",
    secondary: "bg-discord-bg-tertiary hover:bg-discord-bg-modifier-hover text-white shadow-sm hover:shadow-md",
    ghost: "bg-transparent text-white hover:underline hover:bg-white/5 active:bg-white/10",
    link: "bg-transparent text-discord-text-link hover:underline px-0 py-0 disabled:hover:no-underline"
  };

  return (
    <button 
      disabled={isLoading || props.disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
