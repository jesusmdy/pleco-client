import { request } from "./client";

export const signUp = (body: any) =>
  request("/auth/signup", { method: "POST", body: JSON.stringify(body) });

export const signIn = (body: any) =>
  request<{ token: string }>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(body),
  });
