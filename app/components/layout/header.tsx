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
  const isActivity = pathname === "/fm/activity";
  const isStorage = pathname === "/fm/storage";
  const hasActions = isDriveRoot || isFolderView || isActivity || isStorage;

  if (!hasActions) return <Fragment />

  return (
    <header className="h-16 flex items-center px-8 justify-between shrink-0 bg-md-surface-container-low border-b border-md-outline-variant/10 gap-8 z-20 transition-all duration-300 ease-in-out">
      <div className="flex-1 min-w-0">
        <DriveBreadcrumb />
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="w-80 hidden lg:block">
          <SearchInput />
        </div>

        <div className="flex items-center gap-3">
          <ViewToggle />
          <NewItemDropdown />
        </div>
      </div>
    </header>
  );
}
