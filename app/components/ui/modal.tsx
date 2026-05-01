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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-discord-bg-primary rounded-xl shadow-xl w-full ${maxWidthClass} overflow-hidden`} onClick={e => e.stopPropagation()}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="font-bold text-white text-lg">{title}</h2>
          <button 
            onClick={onClose}
            className="text-discord-text-muted hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
