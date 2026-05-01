export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080") + "/api";

async function handleResponse(response: Response) {
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.blob();
  }

  const data = await response.json().catch(() => null);
  const message = data?.message || response.statusText;

  switch (response.status) {
    case 401:
      throw new Error(`Unauthorized: ${message}`);
    case 403:
      throw new Error(`Forbidden: ${message}`);
    case 404:
      throw new Error(`Not Found: ${message}`);
    case 500:
      throw new Error(`Server Error: ${message}`);
    default:
      throw new Error(`API Error (${response.status}): ${message}`);
  }
}

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

  return handleResponse(response) as Promise<T>;
}
