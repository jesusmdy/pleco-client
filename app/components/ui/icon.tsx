import React from "react";
import { cn } from "@/app/lib/utils";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number | string;
  fill?: boolean;
  weight?: number;
  grade?: number;
  opticalSize?: number;
  className?: string;
}

export function Icon({
  name,
  size,
  fill = false,
  weight,
  grade,
  opticalSize,
  className,
  style,
  ...props
}: IconProps) {
  // Material Symbols variable font settings
  const variationSettings = [
    fill ? "'FILL' 1" : "'FILL' 0",
    weight ? `'wght' ${weight}` : null,
    grade ? `'grad' ${grade}` : null,
    opticalSize ? `'opsz' ${opticalSize}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <span
      className={cn("material-symbols-rounded select-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: variationSettings,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
