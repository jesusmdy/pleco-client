"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { UnifiedDriveItem, getFileThumbnail, downloadFileToBlob } from "@/app/lib/drive";
import { FileText, Loader2 } from "lucide-react";
import { useCryptoStore } from "@/app/store/useCryptoStore";

interface ThumbnailProps {
  item: UnifiedDriveItem;
  size: 200 | 500;
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

export function Thumbnail({ item, size, className }: ThumbnailProps) {
  const { data: session } = useSession();
  const masterKey = useCryptoStore(state => state.masterKey);
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        let blob: Blob;

        if (item.encrypted && item.mimeType?.startsWith("image/")) {
          // Zero-Knowledge image: download and decrypt the whole file for preview
          // Note: In a production app, we would have small encrypted thumbnails
          blob = await downloadFileToBlob(item, session!.backendToken, masterKey);
        } else {
          // Regular file: fetch server-generated thumbnail
          blob = await getFileThumbnail(item.id, size, session!.backendToken);
        }

        if (isMounted) {
          const objectUrl = URL.createObjectURL(blob);
          setSrc(objectUrl);
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      if (src) URL.revokeObjectURL(src);
    };
  }, [visible, item.id, size, session?.backendToken, masterKey]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden flex items-center justify-center bg-md-surface-container-low ${className}`}>
      {src ? (
        <img src={src} alt={item.name} className="w-full h-full object-cover animate-in fade-in duration-300" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-md-on-surface-variant/20">
          {isLoading ? (
            <Loader2 className={`${size === 500 ? 'w-10 h-10' : 'w-6 h-6'} animate-spin`} />
          ) : (
            <FileText className={`${size === 500 ? 'w-16 h-16' : 'w-8 h-8'}`} />
          )}
          {error && <span className="text-[10px] text-md-error/40">Failed to load</span>}
        </div>
      )}
    </div>
  );
}
