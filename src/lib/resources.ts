import { apiFetch } from "./api";
import type { StudentSession } from "./auth";

// ---- response types (mirror the Go API) ----

export interface Me {
  id: string;
  name: string;
  phone: string;
  courseName?: string;
  groupName?: string;
  xp: number;
  coins: number;
  level: number;
  xpIntoLevel: number;
  xpPerLevel: number;
}

export interface StudentGroup {
  id: string;
  name: string;
  direction?: string;
  scheduleDays?: string;
  startTime?: string;
  endTime?: string;
}

export type HomeworkStatus = "" | "submitted" | "accepted" | "rejected";

export interface Assignment {
  id: string;
  groupId: string;
  groupName: string;
  lessonDate?: string;
  title: string;
  description?: string;
  deadline?: string;
  maxScore: number;
  status: HomeworkStatus;
  score?: number;
  submissionText?: string;
  submissionLinks?: string;
  reviewNote?: string;
  submittedAt?: string;
}

export type InvoiceStatus = "paid" | "partial" | "unpaid" | "overdue";
export interface Invoice {
  id: string;
  period?: string;
  amount: number;
  paidAmount: number;
  dueDate?: string;
  status: InvoiceStatus;
  note?: string;
}
export interface Payment {
  id: string;
  amount: number;
  method: string;
  paidAt: string;
}
export interface Finance {
  balance: number;
  invoices: Invoice[];
  payments: Payment[];
}

export interface ShopItem {
  id: string;
  name: string;
  icon?: string;
  price: number;
  owned: boolean;
}

export interface LeaderRow {
  rank: number;
  studentId: string;
  name: string;
  xp: number;
  coins: number;
  isMe?: boolean;
}

interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  student: StudentSession;
}

// ---- endpoints ----

export function login(phone: string, password: string) {
  return apiFetch<LoginResponse>("/student/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
}

export const getMe = () => apiFetch<Me>("/student/me");
export const getGroups = () => apiFetch<StudentGroup[]>("/student/groups");
export const getHomework = () => apiFetch<Assignment[]>("/student/homework");

export const submitHomework = (assignmentId: string, text: string, links: string) =>
  apiFetch<unknown>(`/student/homework/${assignmentId}/submit`, {
    method: "POST",
    body: JSON.stringify({ text, links }),
  });

export const checkin = (data: {
  motivation: number;
  progress: number;
  obstacle?: string;
  comment?: string;
}) => apiFetch<void>("/student/checkin", { method: "POST", body: JSON.stringify(data) });

export const getFinance = () => apiFetch<Finance>("/student/finance");
export const getShop = () => apiFetch<ShopItem[]>("/student/shop");
export const buyItem = (itemId: string) =>
  apiFetch<void>(`/student/shop/${itemId}/buy`, { method: "POST" });

export const getLeaderboard = (groupId?: string) =>
  apiFetch<LeaderRow[]>(`/student/leaderboard${groupId ? `?groupId=${groupId}` : ""}`);

export const changePassword = (currentPassword: string, newPassword: string) =>
  apiFetch<void>("/student/change-password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

// Bind the student's Telegram (from Mini App initData) so the bot can push notifications to them.
export const linkTelegram = (initData: string) =>
  apiFetch<void>("/student/telegram-link", {
    method: "POST",
    body: JSON.stringify({ initData }),
  });

export interface StudentExam {
  examId: string;
  title: string;
  examDate?: string;
  maxScore: number;
  score: number;
}
export const getExams = () => apiFetch<StudentExam[]>("/student/exams");

export const sendChat = (message: string, history: { role: string; text: string }[]) =>
  apiFetch<{ reply: string }>("/student/chat", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });
