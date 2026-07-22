import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Bell, ChevronRight, CreditCard, GraduationCap, Star } from "lucide-react";
import { notifications, type NotifType } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/bildirishnomalar")({
  head: () => ({
    meta: [
      { title: "Bildirishnomalar — Staydy" },
      { name: "description", content: "Yangi vazifalar, baholar va eslatmalar." },
    ],
  }),
  component: Notifs,
});

const iconMap: Record<NotifType, { icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  hw_new: { icon: Bell, cls: "bg-primary/15 text-primary" },
  hw_graded: { icon: Star, cls: "bg-success/15 text-success" },
  deadline: { icon: AlertCircle, cls: "bg-alert/15 text-alert" },
  payment: { icon: CreditCard, cls: "bg-reward/15 text-reward" },
  lesson: { icon: GraduationCap, cls: "bg-primary/15 text-primary" },
};

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "hozir";
  if (h < 24) return `${h} soat oldin`;
  return `${Math.floor(h / 24)} kun oldin`;
}

function Notifs() {
  return (
    <div className="space-y-3 px-5 pb-8 pt-4">
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight">Bildirishnomalar</h1>

      {notifications.map((n, i) => {
        const { icon: Icon, cls } = iconMap[n.type];
        return (
          <Link
            key={n.id}
            to={n.deeplink}
            className={`press animate-card-rise flex items-start gap-3 rounded-2xl border p-4 ${
              n.read ? "border-hairline bg-surface" : "border-primary/30 bg-primary/5"
            }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${cls}`}>
              <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold">{n.title}</p>
                {!n.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-[11px] text-muted-foreground tabular">{relTime(n.createdAt)}</p>
            </div>
            <ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground" />
          </Link>
        );
      })}
    </div>
  );
}
