import { ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, children, maxWidth = "md" }: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-[2px] animate-in fade-in duration-200" onClick={onClose}>
      <div className={`bg-figma-dark rounded-lg shadow-2xl w-full ${maxWidthClass} overflow-hidden border border-black/50 animate-in zoom-in-95 duration-200`} onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-figma-dark/50">
          <h2 className="text-[13px] font-bold text-white uppercase tracking-wider">{title}</h2>
          <button 
            onClick={onClose}
            className="text-figma-text-muted hover:text-white transition-colors p-1 hover:bg-figma-hover rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
