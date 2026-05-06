"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { getFileThumbnail } from "@/app/lib/drive";
import { FileText } from "lucide-react";

interface ThumbnailProps {
  itemId: string;
  size: 200 | 500;
  alt: string;
  className?: string;
}

// Simple singleton queue to limit concurrent thumbnail fetches
class ThumbnailQueue {
  private queue: (() => Promise<void>)[] = [];
  private active = 0;
  private maxActive = 3;

  async add(fn: () => Promise<void>) {
    this.queue.push(fn);
    this.process();
  }

  private async process() {
    if (this.active >= this.maxActive || this.queue.length === 0) return;

    this.active++;
    const fn = this.queue.shift()!;
    try {
      await fn();
    } finally {
      this.active--;
      this.process();
    }
  }
}

const thumbnailQueue = new ThumbnailQueue();

export function Thumbnail({ itemId, size, alt, className }: ThumbnailProps) {
  const { data: session } = useSession();
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !session?.backendToken || src || error) return;

    let isMounted = true;

    thumbnailQueue.add(async () => {
      try {
        const blob = await getFileThumbnail(itemId, size, session!.backendToken);
        if (isMounted) {
          const objectUrl = URL.createObjectURL(blob);
          setSrc(objectUrl);
        }
      } catch (err) {
        if (isMounted) setError(true);
      }
    });

    return () => {
      isMounted = false;
      if (src) URL.revokeObjectURL(src);
    };
  }, [visible, itemId, size, session?.backendToken]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden flex items-center justify-center bg-discord-bg-tertiary ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover animate-in fade-in duration-300" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-discord-text-muted/20">
          <FileText className={`${size === 500 ? 'w-16 h-16' : 'w-8 h-8'}`} />
          {error && <span className="text-[10px] text-discord-red/40">Failed to load</span>}
        </div>
      )}
    </div>
  );
}
