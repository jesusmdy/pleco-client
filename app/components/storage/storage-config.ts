import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Archive, 
  File
} from "lucide-react";

export const FILE_TYPE_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  "image/": { icon: ImageIcon, color: "bg-figma-blue", label: "Images" },
  "video/": { icon: Video, color: "bg-purple-500", label: "Videos" },
  "application/pdf": { icon: FileText, color: "bg-figma-red", label: "Documents" },
  "text/": { icon: FileText, color: "bg-figma-red", label: "Documents" },
  "application/zip": { icon: Archive, color: "bg-yellow-600", label: "Archives" },
  "application/x-rar-compressed": { icon: Archive, color: "bg-yellow-600", label: "Archives" },
};
