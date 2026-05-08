/**
 * Support categories for the file viewer.
 */
export type PreviewType = "image" | "pdf" | "video" | "audio" | "text" | "unsupported";

/**
 * Checks if a MIME type can be previewed in the browser.
 */
export function getPreviewType(mimeType: string | null): PreviewType {
  if (!mimeType) return "unsupported";

  const lower = mimeType.toLowerCase();

  if (lower.startsWith("image/")) {
    // Browsers support most common images (jpg, png, gif, webp, svg)
    return "image";
  }

  if (lower === "application/pdf") {
    return "pdf";
  }

  if (lower.startsWith("video/")) {
    // Check for browser-supported containers
    if (lower.includes("mp4") || lower.includes("webm") || lower.includes("ogg")) {
      return "video";
    }
    return "video"; // Most modern browsers handle many video types now
  }

  if (lower.startsWith("audio/")) {
    return "audio";
  }

  if (
    lower.startsWith("text/") || 
    lower === "application/json" || 
    lower === "application/javascript" ||
    lower === "application/x-javascript" ||
    lower.includes("xml")
  ) {
    return "text";
  }

  return "unsupported";
}

/**
 * Returns true if the file type is previewable.
 */
export function isPreviewable(mimeType: string | null): boolean {
  return getPreviewType(mimeType) !== "unsupported";
}
