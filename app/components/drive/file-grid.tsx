import { FileCard, FileCardContext } from "@/app/components/drive/file-card";
import { FileListItem } from "@/app/components/drive/file-list-item";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { useViewStore } from "@/app/store/viewStore";

import { Loader } from "@/app/components/ui/loader";
import { List } from "@/app/components/ui/list";

interface FileGridProps {
  items: UnifiedDriveItem[];
  isLoading: boolean;
  context?: FileCardContext;
}

export function FileGrid({ items, isLoading, context = "drive" }: FileGridProps) {
  const { viewMode } = useViewStore();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <Loader label="Fetching contents..." />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-md-on-surface-variant">
        <p className="text-[14px] font-bold">This folder is empty.</p>
      </div>
    );
  }

  const folders = items.filter(i => i.itemType === "FOLDER");
  const files = items.filter(i => i.itemType === "FILE");

  if (viewMode === "list") {
    return (
      <List>
        {/* Table Header */}
        <div className="flex items-center gap-4 px-10 py-3 text-md-on-surface-variant text-[12px] font-semibold tracking-tight border-b border-md-outline-variant/10">
          <div className="flex-1 pl-16">Name</div>
          <div className="w-32 hidden sm:block">Size</div>
          <div className="w-40 hidden md:block text-right pr-8">Created</div>
          <div className="w-8"></div>
        </div>
        {folders.map(folder => <FileListItem key={folder.id} item={folder} context={context} />)}
        {files.map(file => <FileListItem key={file.id} item={file} context={context} />)}
      </List>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {folders.length > 0 && (
        <section>
          <h3 className="text-[13px] font-semibold text-md-on-surface-variant mb-4 tracking-tight px-1">Folders</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {folders.map(folder => <FileCard key={folder.id} item={folder} context={context} />)}
          </div>
        </section>
      )}

      {files.length > 0 && (
        <section>
          <h3 className="text-[13px] font-semibold text-md-on-surface-variant mb-4 tracking-tight px-1">Files</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {files.map(file => <FileCard key={file.id} item={file} context={context} />)}
          </div>
        </section>
      )}
    </div>
  );
}
