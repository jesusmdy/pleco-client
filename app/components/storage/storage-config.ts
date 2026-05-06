import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Archive, 
  File
} from "lucide-react";

export const FILE_TYPE_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  "image/": { icon: ImageIcon, color: "bg-md-primary", label: "Images" },
  "video/": { icon: Video, color: "bg-md-tertiary", label: "Videos" },
  "application/pdf": { icon: FileText, color: "bg-md-error", label: "Documents" },
  "text/": { icon: FileText, color: "bg-md-error", label: "Documents" },
  "application/zip": { icon: Archive, color: "bg-md-secondary", label: "Archives" },
  "application/x-rar-compressed": { icon: Archive, color: "bg-md-secondary", label: "Archives" },
};
