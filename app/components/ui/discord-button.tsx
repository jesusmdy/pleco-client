"use client";

import React from "react";

interface DiscordButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "link";
  isLoading?: boolean;
}

export const DiscordButton = ({
  children,
  variant = "primary",
  isLoading,
  className = "",
  ...props
}: DiscordButtonProps) => {
  if (variant === "link") {
    return (
      <button
        className={`text-discord-text-link text-[14px] hover:underline text-left ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      disabled={isLoading || props.disabled}
      className={`
        w-full h-[44px] 
        bg-discord-blurple 
        hover:bg-[#4752c4] 
        active:bg-[#3c45a5]
        disabled:opacity-50 disabled:cursor-not-allowed
        text-white font-medium rounded-[3px] 
        transition-colors duration-200
        flex items-center justify-center
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
