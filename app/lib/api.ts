const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080") + "/api";

export async function request<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...rest } = options;
  const headers = new Headers(rest.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (rest.body && !(rest.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `API error: ${response.status}`);
  }

  return data;
}

export const signUp = (body: any) =>
  request("/auth/signup", { method: "POST", body: JSON.stringify(body) });

export const signIn = (body: any) =>
  request<{ token: string }>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getProfile = (token: string) => 
  request<any>("/user/me", { method: "GET", token });

export const uploadDriveFile = (file: File, parentId: string | null, token: string) => {
  const formData = new FormData();
  formData.append("file", file);
  if (parentId) formData.append("parentId", parentId);
  
  return request<any>("/drive/upload", { method: "POST", body: formData, token });
};

export const downloadFile = (id: string, token: string) =>
  request(`/files/${id}`, { method: "GET", token });

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

export const createFolder = (
  name: string, 
  parentId: string | null, 
  token: string
) =>
  request<UnifiedDriveItem>("/drive/folders", {
    method: "POST",
    body: JSON.stringify({ name, parentId }),
    token,
  });

