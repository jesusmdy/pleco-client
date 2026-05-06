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
      className={`
        flex items-center gap-1 px-2 py-1 rounded-md transition-colors shrink-0
        ${isLast ? 'text-white font-semibold' : 'text-figma-text-muted hover:bg-figma-hover hover:text-white'}
        text-[13px]
      `}
    >
      <span className="truncate max-w-[150px]">{label}</span>
      {isLast && <ChevronDown className="w-3 h-3 ml-0.5 opacity-50" />}
    </Link>
  );
}
