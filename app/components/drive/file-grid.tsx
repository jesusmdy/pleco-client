import { FileCard, FileCardContext } from "@/app/components/drive/file-card";
import { FileListItem } from "@/app/components/drive/file-list-item";
import { UnifiedDriveItem } from "@/app/lib/drive";
import { useViewStore } from "@/app/store/viewStore";

interface FileGridProps {
  items: UnifiedDriveItem[];
  isLoading: boolean;
  context?: FileCardContext;
}

export function FileGrid({ items, isLoading, context = "drive" }: FileGridProps) {
  const { viewMode } = useViewStore();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-discord-text-muted min-h-[200px]">
        <div className="w-10 h-10 border-4 border-white/10 border-t-discord-blurple rounded-full animate-spin" />
        <p>Fetching...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-discord-text-muted">
        <p>This folder is empty.</p>
      </div>
    );
  }

  const folders = items.filter(i => i.itemType === "FOLDER");
  const files = items.filter(i => i.itemType === "FILE");

  if (viewMode === "list") {
    return (
      <div className="flex flex-col">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-2 text-discord-text-muted text-[11px] font-bold uppercase tracking-wider border-b border-white/5">
          <div className="flex-1">Name</div>
          <div className="w-24 hidden sm:block">Size</div>
          <div className="w-32 hidden md:block">Created</div>
          <div className="w-8"></div>
        </div>
        {folders.map(folder => <FileListItem key={folder.id} item={folder} context={context} />)}
        {files.map(file => <FileListItem key={file.id} item={file} context={context} />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {folders.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-discord-text-muted mb-4 uppercase tracking-wider">Folders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {folders.map(folder => <FileCard key={folder.id} item={folder} context={context} />)}
          </div>
        </section>
      )}

      {files.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-discord-text-muted mb-4 uppercase tracking-wider">Files</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map(file => <FileCard key={file.id} item={file} context={context} />)}
          </div>
        </section>
      )}
    </div>
  );
}
