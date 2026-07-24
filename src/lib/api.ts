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
  // fetch has no built-in timeout: a busy/hung server would leave the request pending forever,
  // freezing the screen on a loading state. Abort after 15s so it fails fast instead.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...opts,
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(opts.headers || {}),
      },
    });
  } catch {
    throw new ApiError(0, "Ulanish sekin yoki uzildi. Qaytadan urinib ko'ring.");
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 401) {
    const isLogin = path.endsWith("/student/login");
    clearSession();
    if (typeof window !== "undefined" && !isLogin) {
      window.location.href = "/login";
    }
    // Only the login call means bad credentials; elsewhere a 401 is an expired session.
    throw new ApiError(401, isLogin ? "Telefon yoki parol noto'g'ri." : "Sessiya tugadi — qayta kiring.");
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
