"use client";

import { useEffect, useState } from "react";
import { PreviewType } from "@/app/lib/preview";
import { FileText, Loader2, AlertCircle } from "lucide-react";

interface PreviewRendererProps {
  type: PreviewType;
  blob: Blob;
  blobUrl: string;
}

export function PreviewRenderer({ type, blob, blobUrl }: PreviewRendererProps) {
  if (type === "image") {
    return (
      <div className="flex items-center justify-center w-full h-full p-8 bg-black/5 rounded-[24px]">
        <img 
          src={blobUrl} 
          alt="Preview" 
          className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500" 
        />
      </div>
    );
  }

  if (type === "pdf") {
    return (
      <div className="w-full h-full bg-md-surface-container rounded-[24px] overflow-hidden">
        <iframe 
          src={`${blobUrl}#toolbar=0`} 
          className="w-full h-full border-none"
          title="PDF Preview"
        />
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black rounded-[24px] overflow-hidden">
        <video 
          src={blobUrl} 
          controls 
          autoPlay
          className="max-w-full max-h-full"
        />
      </div>
    );
  }

  if (type === "audio") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-8 bg-md-surface-container rounded-[24px]">
        <div className="w-32 h-32 rounded-full bg-md-primary/10 flex items-center justify-center text-md-primary animate-pulse">
          <FileText className="w-16 h-16" />
        </div>
        <audio src={blobUrl} controls className="w-full max-w-md" />
      </div>
    );
  }

  if (type === "text") {
    return <TextPreview blob={blob} />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-md-on-surface-variant">
      <AlertCircle className="w-12 h-12 opacity-20" />
      <p className="text-[14px] font-medium tracking-tight">Preview not available for this file type</p>
    </div>
  );
}

function TextPreview({ blob }: { blob: Blob }) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blob.text().then(text => {
      setContent(text);
      setLoading(false);
    }).catch(() => {
      setContent("Failed to load text content");
      setLoading(false);
    });
  }, [blob]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader2 className="w-8 h-8 animate-spin text-md-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-md-surface-container-low rounded-[24px] p-8 overflow-auto scrollbar-thin scrollbar-thumb-md-outline-variant/20">
      <pre className="font-mono text-[13px] text-md-on-surface leading-relaxed whitespace-pre-wrap selection:bg-md-primary/20">
        {content}
      </pre>
    </div>
  );
}
