import { API_BASE_URL } from "./config";
import { clearSession, getToken } from "./auth";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// apiFetch is the single fetch wrapper: attaches the student token, parses JSON, and turns non-2xx
// into an ApiError with the backend's Uzbek `detail`. A 401 clears the session and bounces to login.
export async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...opts,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });

  if (res.status === 401) {
    clearSession();
    if (typeof window !== "undefined" && !path.endsWith("/student/login")) {
      window.location.href = "/login";
    }
    throw new ApiError(401, "Telefon yoki parol noto'g'ri.");
  }
  if (!res.ok) {
    let detail = "Xatolik yuz berdi. Qaytadan urinib ko'ring.";
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, detail);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
