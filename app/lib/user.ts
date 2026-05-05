import { request } from "./client";

export const getProfile = (token: string) => 
  request<any>("/user/me", { method: "GET", token });

export interface StorageUsage {
  numberOfFolders: number;
  numberOfFiles: number;
  totalSize: number;
  sizeByType: Record<string, number>;
}

export const getStorageUsage = (token: string) =>
  request<StorageUsage>("/user/usage", { method: "GET", token });

export const changePassword = (data: any, token: string) =>
  request<any>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });

export const disableMfa = (data: any, token: string) =>
  request<any>("/auth/mfa/disable", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
