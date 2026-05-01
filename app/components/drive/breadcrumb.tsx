import { BreadcrumbNode } from "@/app/lib/drive";
import { BreadcrumbItem } from "./breadcrumb-item";
import { BreadcrumbSeparator } from "./breadcrumb-separator";

interface BreadcrumbProps {
  path: BreadcrumbNode[];
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto -ml-3">
      <BreadcrumbItem 
        href="/drive" 
        label="My Drive" 
        isLast={path.length === 0} 
      />
      
      {path.map((node, index) => {
        const isLast = index === path.length - 1;
        return (
          <div key={node.id} className="flex items-center gap-1 shrink-0">
            <BreadcrumbSeparator />
            <BreadcrumbItem 
              href={`/drive/folders/${node.id}`} 
              label={node.name} 
              isLast={isLast} 
            />
          </div>
        );
      })}
    </div>
  );
}
