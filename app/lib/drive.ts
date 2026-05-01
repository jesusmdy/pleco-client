import { request, API_BASE_URL } from "./client";

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
}

export interface BreadcrumbNode {
  id: string;
  name: string;
}

export const getRootFolders = (token: string) => 
  request<UnifiedDriveItem[]>("/drive/folders", { method: "GET", token });

export const getFolderChildren = (folderId: string, token: string) => 
  request<UnifiedDriveItem[]>(`/drive/folders/${folderId}`, { method: "GET", token });

export const getBreadcrumb = (folderId: string, token: string) => 
  request<BreadcrumbNode[]>(`/drive/folders/${folderId}/breadcrumb`, { method: "GET", token });

export const createFolder = (name: string, parentId: string | null, token: string) =>
  request<UnifiedDriveItem>("/drive/folders", {
    method: "POST",
    body: JSON.stringify({ name, parentId }),
    token,
  });

export const uploadDriveFile = (file: File, parentId: string | null, token: string) => {
  const formData = new FormData();
  formData.append("file", file);
  if (parentId) formData.append("parentId", parentId);
  
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

export const downloadFile = async (id: string, fileName: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/files/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!response.ok) {
    throw new Error("Download failed");
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const listTrash = (token: string) =>
  request<TrashItem[]>("/trash", { method: "GET", token });

export const searchTrash = (query: string, token: string) =>
  request<TrashItem[]>(`/trash/search?query=${encodeURIComponent(query)}`, { method: "GET", token });

export const restoreItems = (itemIds: string[], token: string) =>
  request<void>("/trash/restore", {
    method: "POST",
    body: JSON.stringify({ itemIds }),
    token,
  });

export const permanentlyDeleteItems = (itemIds: string[], token: string) =>
  request<void>("/trash/permanent", {
    method: "DELETE",
    body: JSON.stringify({ itemIds }),
    token,
  });
