"use client";

import { usePathname } from "next/navigation";

import { NewItemDropdown } from "@/app/components/drive/new-item-dropdown";
import { DriveBreadcrumb } from "./drive-breadcrumb";
import { ViewToggle } from "@/app/components/ui/view-toggle";
import { SearchInput } from "@/app/components/drive/search-input";
import { Fragment } from "react/jsx-runtime";

export function Header() {
  const pathname = usePathname();
  const isDriveRoot = pathname === "/fm/drive";
  const isFolderView = pathname.startsWith("/fm/drive/folders/");
  const hasActions = isDriveRoot || isFolderView;

  if (!hasActions) return <Fragment />

  return (
    <header className="h-10 flex items-center px-3 justify-between shrink-0 bg-figma-dark border-b border-black/20 gap-4">
      <div className="flex-1 min-w-0">
        <DriveBreadcrumb />
      </div>

      <div className="flex items-center gap-4 shrink-0">

        <div className="w-64 hidden md:block">
          <SearchInput />
        </div>

        <div className="flex items-center gap-2">
          <ViewToggle className="mr-2" />
          <NewItemDropdown />
        </div>
      </div>
    </header>
  );
}
