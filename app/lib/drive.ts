import { request, API_BASE_URL } from "./client";
import { decryptData, importKey, base64ToBytes } from "./crypto";
export { API_BASE_URL };

export interface TrashItem {
  id: string;
  name: string;
  itemType: "FILE" | "FOLDER";
  mimeType: string | null;
  size: number | null;
  status: string;
  trashedAt: string | null;
  originalParentId: string | null;
  parentId: string | null;
  path: string[];
  depth: number;
  encrypted: boolean;
  createdAt: string;
  updatedAt: string;
  hasThumb200?: boolean;
  hasThumb500?: boolean;
  encryptedFileKey?: string;
  encryptionIv?: string;
}

export function trashItemToDriveItem(item: TrashItem): UnifiedDriveItem {
  return {
    id: item.id,
    name: item.name,
    itemType: item.itemType,
    size: item.size,
    mimeType: item.mimeType,
    encrypted: item.encrypted ?? false,
    depth: item.depth ?? 0,
    parentId: item.parentId,
    path: item.path ?? [],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    hasThumb200: item.hasThumb200,
    hasThumb500: item.hasThumb500,
    encryptedFileKey: item.encryptedFileKey,
    encryptionIv: item.encryptionIv,
  };
}

export interface UnifiedDriveItem {
  id: string;
  name: string;
  itemType: "FILE" | "FOLDER";
  size: number | null;
  mimeType: string | null;
  encrypted: boolean;
  depth: number;
  parentId: string | null;
  path: string[];
  createdAt: string;
  updatedAt: string;
  hasThumb200?: boolean;
  hasThumb500?: boolean;
  encryptedFileKey?: string;
  encryptionIv?: string;
}

export const getRecentFiles = (token: string) =>
  request<UnifiedDriveItem[]>("/drive/recent", { method: "GET", token });

export const getHealth = () =>
  request<{ status: string }>("/drive/health", { method: "GET" });

export interface BreadcrumbNode {
  id: string;
  name: string;
}

export const getRootFolders = (token: string) =>
  request<UnifiedDriveItem[]>("/drive/folders", { method: "GET", token });

export const getFolderChildren = (folderId: string, token: string) =>
  request<UnifiedDriveItem[]>(`/drive/folders/${folderId}`, { method: "GET", token });

export const getFolderTree = (token: string) =>
  request<UnifiedDriveItem[]>("/drive/folders/tree", { method: "GET", token });

export const getBreadcrumb = (folderId: string, token: string) =>
  request<BreadcrumbNode[]>(`/drive/folders/${folderId}/breadcrumb`, { method: "GET", token });

export const createFolder = (name: string, parentId: string | null, token: string) =>
  request<UnifiedDriveItem>("/drive/folders", {
    method: "POST",
    body: JSON.stringify({ name, parentId }),
    token,
  });

export const uploadDriveFile = (
  file: Blob, 
  name: string,
  parentId: string | null, 
  token: string, 
  encryptedFileKey?: string, 
  iv?: string,
  fileHash?: string
) => {
  const formData = new FormData();
  formData.append("file", file, name);
  if (parentId) formData.append("parentId", parentId);
  if (encryptedFileKey) formData.append("encryptedFileKey", encryptedFileKey);
  if (iv) formData.append("iv", iv);
  if (fileHash) formData.append("fileHash", fileHash);

  return request<any>("/drive/upload", { method: "POST", body: formData, token });
};

export const renameItem = (id: string, name: string, token: string) =>
  request<UnifiedDriveItem>(`/drive/items/${id}/rename`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
    token,
  });

export const deleteItem = (id: string, token: string) =>
  request<void>(`/drive/items/${id}`, { method: "DELETE", token });

export const downloadFileToBlob = async (
  item: UnifiedDriveItem, 
  token: string, 
  masterKey?: CryptoKey | null
): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/drive/download/${item.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Download failed");
  }

  let blob = await response.blob();

  if (item.encrypted && item.encryptedFileKey && item.encryptionIv && masterKey) {
    try {
      // 1. Parse combined key (Encrypted Key : Key IV)
      const colonIndex = item.encryptedFileKey.lastIndexOf(":");
      if (colonIndex === -1) throw new Error("Invalid encrypted file key format");
      
      const encKeyBase64 = item.encryptedFileKey.substring(0, colonIndex);
      const keyIvBase64 = item.encryptedFileKey.substring(colonIndex + 1);

      const encKeyBuffer = base64ToBytes(encKeyBase64).buffer;
      const keyIv = base64ToBytes(keyIvBase64);
      
      const decryptedKeyBuffer = await decryptData(encKeyBuffer, masterKey, keyIv);
      const fileKey = await importKey(decryptedKeyBuffer);
      
      const fileIv = base64ToBytes(item.encryptionIv);
      const encryptedFileBuffer = await blob.arrayBuffer();
      const decryptedFileBuffer = await decryptData(encryptedFileBuffer, fileKey, fileIv);
      
      blob = new Blob([decryptedFileBuffer], { type: item.mimeType || "application/octet-stream" });
    } catch (error) {
      throw new Error("Failed to decrypt file.");
    }
  }
  return blob;
};

export const downloadFile = async (
  item: UnifiedDriveItem, 
  token: string, 
  masterKey?: CryptoKey | null
) => {
  const blob = await downloadFileToBlob(item, token, masterKey);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = item.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const listTrash = (token: string) =>
  request<TrashItem[]>("/drive/trash", { method: "GET", token });

export const searchTrash = (query: string, token: string) =>
  request<TrashItem[]>(`/drive/trash/search?query=${encodeURIComponent(query)}`, { method: "GET", token });

export const restoreItems = (itemIds: string[], token: string) =>
  request<void>("/drive/trash/restore", {
    method: "POST",
    body: JSON.stringify({ itemIds }),
    token,
  });

export const permanentlyDeleteItems = (itemIds: string[], token: string) =>
  request<void>("/drive/trash/permanent", {
    method: "DELETE",
    body: JSON.stringify({ itemIds }),
    token,
  });

export const searchDrive = (query: string, token: string, folderId?: string) => {
  const params = new URLSearchParams({ query });
  if (folderId) params.append("folderId", folderId);
  return request<UnifiedDriveItem[]>(`/drive/search?${params.toString()}`, { method: "GET", token });
};

export const getFileThumbnail = (itemId: string, size: number, token: string) =>
  request<Blob>(`/drive/items/${itemId}/thumbnail?size=${size}`, { method: "GET", token });
