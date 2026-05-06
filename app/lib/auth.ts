import { request } from "./client";

export interface AuthResponse {
  token: string;
  id?: string;
  username?: string;
  email?: string;
  status?: string;
  scratchCodes?: string[];
}

export const signUp = (body: any) =>
  request<AuthResponse>("/users/auth/signup", { method: "POST", body: JSON.stringify(body) });

export const signIn = (body: any) =>
  request<AuthResponse>("/users/auth/signin", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const verifyMfa = (code: string, token: string) =>
  request<AuthResponse>("/users/auth/mfa/verify", {
    method: "POST",
    body: JSON.stringify({ code }),
    token,
  });

export const setupMfa = (token: string) =>
  request<{ qrCodeData: string; secret: string }>("/users/auth/mfa/setup", {
    method: "POST",
    token,
  });
