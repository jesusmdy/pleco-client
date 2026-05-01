import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbNode } from "@/app/lib/api";
import Link from "next/link";

interface BreadcrumbProps {
  path: BreadcrumbNode[];
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-[14px] text-discord-text-muted mb-4 overflow-x-auto pb-2">
      <Link 
        href="/drive"
        className="hover:text-white transition-colors flex items-center gap-1 shrink-0"
      >
        <Home className="w-4 h-4" />
        My Drive
      </Link>
      
      {path.map((node) => (
        <div key={node.id} className="flex items-center gap-2 shrink-0">
          <ChevronRight className="w-4 h-4 text-discord-text-muted/50" />
          <Link
            href={`/drive/folders/${node.id}`}
            className="hover:text-white transition-colors truncate max-w-[150px]"
          >
            {node.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
