"use client";

import { CreateFolderButton } from "./create-folder-button";
import { UploadFileButton } from "./upload-file-button";

export function Toolbar() {
  return (
    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5 px-4 pt-4">
      <CreateFolderButton />
      <UploadFileButton />
    </div>
  );
}
