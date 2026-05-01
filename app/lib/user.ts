import { request } from "./client";

export const getProfile = (token: string) => 
  request<any>("/user/me", { method: "GET", token });
