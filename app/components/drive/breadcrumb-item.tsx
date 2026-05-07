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
        flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 font-semibold tracking-tight
        ${isLast ? 'text-md-on-surface bg-md-surface-variant/20' : 'text-md-on-surface-variant hover:bg-md-surface-variant/20 hover:text-md-on-surface'}
        text-[15px]
      `}
    >
      <span className="truncate max-w-[200px]">{label}</span>
      {isLast && <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-md-on-surface-variant" />}
    </Link>
  );
}
