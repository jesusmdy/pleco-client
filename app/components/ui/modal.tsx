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
    <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4 backdrop-blur-[4px] animate-in fade-in duration-300" onClick={onClose}>
      <div className={`bg-md-surface-container-high rounded-[28px] shadow-xl w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 border border-md-outline-variant/10`} onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-md-on-surface leading-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="text-md-on-surface-variant hover:bg-md-surface-variant/20 transition-all p-2 rounded-full active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 pb-6 pt-1 text-md-on-surface-variant">
          {children}
        </div>
      </div>
    </div>
  );
}
