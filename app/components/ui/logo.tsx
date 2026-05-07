"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HardDrive } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={cn("mb-2", className)}>
      <div className={cn(
        "w-12 h-12 bg-md-primary rounded-[18px] flex items-center justify-center transition-all duration-500 cursor-pointer border border-md-primary/10 shadow-sm group",
        isNavigating ? "scale-110 rotate-0 shadow-md ring-4 ring-md-primary/20" : "rotate-3 hover:rotate-0 active:scale-90"
      )}>
        <HardDrive className={cn(
          "w-6 h-6 text-md-on-primary transition-transform duration-500",
          isNavigating ? "scale-125" : "group-hover:scale-110"
        )} />
      </div>
    </div>
  );
}
