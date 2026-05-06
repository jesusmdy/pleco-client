import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link";
  isLoading?: boolean;
}

export function Button({ variant = "primary", isLoading, className = "", children, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 h-9 rounded-full font-bold transition-all cursor-pointer text-[12px] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-md-primary text-md-on-primary hover:bg-md-primary/90 border border-md-primary/10",
    secondary: "bg-md-secondary-container text-md-on-secondary-container hover:bg-md-secondary-container/90",
    ghost: "bg-transparent text-md-on-surface-variant hover:bg-md-surface-variant/20",
    link: "bg-transparent text-md-primary hover:underline px-0 py-0 disabled:hover:no-underline"
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
