export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type ApiErrorResponse = {
  message?: string;
  fields?: Record<string, string>;
};

export class ApiRequestError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("auth_token");
}

export function clearAuthToken() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_expires_at");
  localStorage.removeItem("auth_email");
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers ?? {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let fields: Record<string, string> | undefined;

    try {
      const payload = (await response.json()) as ApiErrorResponse;
      if (payload?.message) {
        message = payload.message;
      }
      if (payload?.fields) {
        fields = payload.fields;
      }
    } catch {
      // ignore
    }

    throw new ApiRequestError(response.status, message, fields);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
