// Student session: a long-lived access token + minimal identity, kept in localStorage.
const TOKEN_KEY = "staydy_student_token";
const STUDENT_KEY = "staydy_student";

export interface StudentSession {
  id: string;
  name: string;
  orgId: string;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStudent(): StudentSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STUDENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentSession;
  } catch {
    return null;
  }
}

export function setSession(token: string, student: StudentSession) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STUDENT_KEY);
}

export function isAuthed(): boolean {
  return !!getToken();
}
