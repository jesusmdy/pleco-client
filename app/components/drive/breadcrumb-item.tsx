import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface BreadcrumbItemProps {
  href: string;
  label: string;
  isLast?: boolean;
}

export function BreadcrumbItem({ href, label, isLast }: BreadcrumbItemProps) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors text-white hover:bg-white/10 text-[18px] font-medium shrink-0"
    >
      <span className="truncate max-w-[200px]">{label}</span>
      {isLast && <ChevronDown className="w-4 h-4 ml-1 text-discord-text-muted" />}
    </Link>
  );
}
