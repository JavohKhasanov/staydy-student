// Mock data for Staydy Talaba mini app.
// Shapes intentionally match the future Go API contract so that fetch hooks
// can be swapped in without touching components.

export type LessonStatus = "upcoming" | "now" | "done";
export type HomeworkStatus = "none" | "assigned" | "submitted" | "accepted" | "rejected";
export type InvoiceStatus = "paid" | "partial" | "unpaid" | "overdue";
export type NotifType = "hw_new" | "hw_graded" | "deadline" | "payment" | "lesson";

export interface Student {
  id: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  coins: number;
  xp: number;
  level: number;
  xpToNext: number;
  streakDays: number;
  ratingGroup: number;
  ratingCenter: number;
  joinedAt: string;
}

export interface Teacher { name: string; avatar: string | null; }

export interface Group {
  id: string;
  name: string;
  direction: string;
  teacher: Teacher;
  startDate: string;
  endDate: string | null;
  status: "active" | "finished";
  lessonsTotal: number;
  lessonsDone: number;
}

export interface HomeworkFile { name: string; size: string; url: string; }

export interface Submission {
  text: string;
  links: string[];
  files: HomeworkFile[];
  submittedAt: string;
  edited: boolean;
}

export interface Homework {
  id: string;
  lessonId: string;
  text: string;
  files: HomeworkFile[];
  deadline: string;
  submission: Submission | null;
  status: HomeworkStatus;
  score: number | null;
  reviewNote: string | null;
}

export interface Lesson {
  id: string;
  groupId: string;
  topic: string;
  date: string; // ISO
  timeLabel: string; // e.g. "14:00 - 16:00"
  room: string;
  status: LessonStatus;
  homework: Homework | null;
}

export interface Invoice {
  id: string;
  groupId: string;
  courseName: string;
  period: string; // YYYY-MM
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: InvoiceStatus;
}

export interface Payment { id: string; amount: number; method: string; paidAt: string; courseName: string; }

export interface CheckIn {
  weekOf: string;
  motivation: number;
  progress: number;
  obstacle: string;
  comment: string;
  done: boolean;
}

export interface Notification {
  id: string; type: NotifType; title: string; body: string; createdAt: string; read: boolean; deeplink: string;
}

export interface ShopItem { id: string; name: string; icon: string; price: number; owned: boolean; }

export interface LeaderRow { id: string; name: string; avatar: string | null; xp: number; coins: number; isMe?: boolean; }

export const student: Student = {
  id: "u_1",
  fullName: "Aziza Karimova",
  phone: "+998 90 123 45 67",
  avatarUrl: null,
  coins: 1240,
  xp: 2550,
  level: 14,
  xpToNext: 3000,
  streakDays: 12,
  ratingGroup: 3,
  ratingCenter: 1014,
  joinedAt: "2025-02-15",
};

const now = new Date();
const iso = (d: Date) => d.toISOString();
const addDays = (n: number) => { const d = new Date(now); d.setDate(d.getDate() + n); return d; };
const addHours = (n: number) => { const d = new Date(now); d.setHours(d.getHours() + n); return d; };

export const groups: Group[] = [
  {
    id: "g_1", name: "Frontend Pro", direction: "Web Development",
    teacher: { name: "Anvar Soliyev", avatar: null },
    startDate: "2025-03-01", endDate: null, status: "active",
    lessonsTotal: 48, lessonsDone: 22,
  },
  {
    id: "g_2", name: "IELTS Intensive", direction: "Ingliz tili",
    teacher: { name: "Dilnoza Karimova", avatar: null },
    startDate: "2025-04-10", endDate: null, status: "active",
    lessonsTotal: 36, lessonsDone: 14,
  },
  {
    id: "g_3", name: "Python asoslari", direction: "Backend",
    teacher: { name: "Malik Abdullayev", avatar: null },
    startDate: "2024-09-01", endDate: "2025-02-01", status: "finished",
    lessonsTotal: 40, lessonsDone: 40,
  },
];

export const lessons: Lesson[] = [
  {
    id: "l_1", groupId: "g_1", topic: "React Hooks chuqurroq",
    date: iso(addHours(-2)), timeLabel: "14:00 - 16:00", room: "302-xona",
    status: "now",
    homework: {
      id: "h_1", lessonId: "l_1",
      text: "useState va useEffect yordamida oddiy \"To-do\" ilova yarating. Ma'lumotlar localStorage'da saqlanishi kerak.",
      files: [{ name: "topshiriq.pdf", size: "240 KB", url: "#" }],
      deadline: iso(addDays(2)),
      submission: null,
      status: "assigned",
      score: null, reviewNote: null,
    },
  },
  {
    id: "l_2", groupId: "g_1", topic: "Kontekst va Provider pattern",
    date: iso(addHours(4)), timeLabel: "18:30 - 20:00", room: "302-xona",
    status: "upcoming", homework: null,
  },
  {
    id: "l_3", groupId: "g_2", topic: "Writing Task 2: Opinion Essay",
    date: iso(addDays(-1)), timeLabel: "10:00 - 12:00", room: "405-xona",
    status: "done",
    homework: {
      id: "h_2", lessonId: "l_3",
      text: "300 so'zli \"Should students study abroad?\" mavzusida esse yozing.",
      files: [],
      deadline: iso(addHours(6)),
      submission: {
        text: "Menimcha, chet elda o'qish talabalarga keng imkoniyat beradi...",
        links: ["https://docs.google.com/document/d/xxx"],
        files: [],
        submittedAt: iso(addDays(-1)),
        edited: false,
      },
      status: "submitted", score: null, reviewNote: null,
    },
  },
  {
    id: "l_4", groupId: "g_1", topic: "TypeScript asoslari",
    date: iso(addDays(-3)), timeLabel: "14:00 - 16:00", room: "302-xona",
    status: "done",
    homework: {
      id: "h_3", lessonId: "l_4",
      text: "Interface va Type yordamida 5 ta misol yozing.",
      files: [], deadline: iso(addDays(-1)),
      submission: {
        text: "Bajarildi.", links: ["https://github.com/aziza/ts-basics"],
        files: [], submittedAt: iso(addDays(-2)), edited: true,
      },
      status: "accepted", score: 95,
      reviewNote: "Juda yaxshi! Kodni yanada toza yozishga harakat qiling.",
    },
  },
  {
    id: "l_5", groupId: "g_1", topic: "Tailwind CSS bilan tanishuv",
    date: iso(addDays(-5)), timeLabel: "14:00 - 16:00", room: "302-xona",
    status: "done", homework: null,
  },
  {
    id: "l_6", groupId: "g_2", topic: "Speaking Part 2: Describing places",
    date: iso(addDays(2)), timeLabel: "10:00 - 12:00", room: "405-xona",
    status: "upcoming", homework: null,
  },
];

export const invoices: Invoice[] = [
  { id: "i_1", groupId: "g_1", courseName: "Frontend Pro", period: "2025-07", amount: 1200000, paidAmount: 1200000, dueDate: "2025-07-10", status: "paid" },
  { id: "i_2", groupId: "g_2", courseName: "IELTS Intensive", period: "2025-07", amount: 900000, paidAmount: 300000, dueDate: "2025-07-25", status: "partial" },
  { id: "i_3", groupId: "g_1", courseName: "Frontend Pro", period: "2025-08", amount: 1200000, paidAmount: 0, dueDate: "2025-08-10", status: "unpaid" },
];

export const payments: Payment[] = [
  { id: "p_1", amount: 1200000, method: "Payme", paidAt: "2025-07-05", courseName: "Frontend Pro" },
  { id: "p_2", amount: 300000, method: "Naqd", paidAt: "2025-07-12", courseName: "IELTS Intensive" },
  { id: "p_3", amount: 1200000, method: "Click", paidAt: "2025-06-08", courseName: "Frontend Pro" },
];

export const currentCheckIn: CheckIn = {
  weekOf: iso(addDays(-2)),
  motivation: 0, progress: 0, obstacle: "", comment: "", done: false,
};

export const notifications: Notification[] = [
  { id: "n_1", type: "hw_new", title: "Yangi vazifa berildi", body: "React Hooks chuqurroq — 2 kun ichida", createdAt: iso(addHours(-1)), read: false, deeplink: "/darslar/l_1" },
  { id: "n_2", type: "deadline", title: "Muddat yaqinlashyapti", body: "Writing Task 2 — bugun 23:59", createdAt: iso(addHours(-5)), read: false, deeplink: "/darslar/l_3" },
  { id: "n_3", type: "hw_graded", title: "Vazifangiz baholandi", body: "TypeScript asoslari — 95 ball", createdAt: iso(addDays(-1)), read: true, deeplink: "/darslar/l_4" },
  { id: "n_4", type: "payment", title: "To'lov eslatmasi", body: "IELTS uchun 600 000 so'm qoldi", createdAt: iso(addDays(-2)), read: true, deeplink: "/tolovlar" },
  { id: "n_5", type: "lesson", title: "Yangi dars qo'shildi", body: "Kontekst va Provider pattern — bugun 18:30", createdAt: iso(addDays(-2)), read: true, deeplink: "/darslar/l_2" },
];

export const leaderboardGroup: LeaderRow[] = [
  { id: "u_10", name: "Sardor Yusupov", avatar: null, xp: 3420, coins: 1800 },
  { id: "u_11", name: "Nilufar Rahimova", avatar: null, xp: 3105, coins: 1520 },
  { id: "u_1", name: "Aziza Karimova", avatar: null, xp: 2550, coins: 1240, isMe: true },
  { id: "u_12", name: "Bekzod Toshev", avatar: null, xp: 2340, coins: 990 },
  { id: "u_13", name: "Kamola Ismoilova", avatar: null, xp: 2100, coins: 870 },
  { id: "u_14", name: "Jasur Alimov", avatar: null, xp: 1980, coins: 720 },
];

export const leaderboardCenter: LeaderRow[] = [
  { id: "u_100", name: "Otabek N.", avatar: null, xp: 8420, coins: 4100 },
  { id: "u_101", name: "Zilola X.", avatar: null, xp: 8105, coins: 3900 },
  { id: "u_102", name: "Sanjar M.", avatar: null, xp: 7940, coins: 3720 },
  { id: "u_103", name: "Malika R.", avatar: null, xp: 7500, coins: 3400 },
  { id: "u_104", name: "Bobur T.", avatar: null, xp: 7100, coins: 3200 },
  { id: "u_1", name: "Aziza Karimova", avatar: null, xp: 2550, coins: 1240, isMe: true },
];

export const shopItems: ShopItem[] = [
  { id: "s_1", name: "Oltin nishon", icon: "🏅", price: 500, owned: false },
  { id: "s_2", name: "Ninja avatar", icon: "🥷", price: 800, owned: false },
  { id: "s_3", name: "Sertifikat ramka", icon: "🖼️", price: 1200, owned: true },
  { id: "s_4", name: "Streak himoyasi", icon: "🛡️", price: 300, owned: false },
  { id: "s_5", name: "Kosmos temasi", icon: "🚀", price: 1500, owned: false },
  { id: "s_6", name: "Alacakaranlık", icon: "🌌", price: 2000, owned: false },
];

// Helpers
export const getGroup = (id: string) => groups.find((g) => g.id === id);
export const getLesson = (id: string) => lessons.find((l) => l.id === id);
export const lessonsByGroup = (id: string) => lessons.filter((l) => l.groupId === id);
export const todaysLessons = () => {
  const today = new Date().toDateString();
  return lessons.filter((l) => new Date(l.date).toDateString() === today);
};
export const upcomingHomework = () =>
  lessons
    .map((l) => l.homework)
    .filter((h): h is Homework => !!h && h.status === "assigned");
