import { FileCard } from "@/app/components/drive/file-card";
import { UnifiedDriveItem } from "@/app/lib/drive";

interface FileGridProps {
  items: UnifiedDriveItem[];
  isLoading: boolean;
}

export function FileGrid({ items, isLoading }: FileGridProps) {
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

  return (
    <div className="flex flex-col gap-8">
      {folders.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-discord-text-muted mb-4 uppercase tracking-wider">Folders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {folders.map(folder => <FileCard key={folder.id} item={folder} />)}
          </div>
        </section>
      )}

      {files.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-discord-text-muted mb-4 uppercase tracking-wider">Files</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map(file => <FileCard key={file.id} item={file} />)}
          </div>
        </section>
      )}
    </div>
  );
}
