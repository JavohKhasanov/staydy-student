import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Bell, ChevronRight, CreditCard, Loader2, Star } from "lucide-react";
import { getFinance, getHomework } from "@/lib/resources";
import { formatSum, timeRemaining } from "@/lib/format";

export const Route = createFileRoute("/_app/bildirishnomalar")({
  head: () => ({
    meta: [
      { title: "Bildirishnomalar — Staydy" },
      { name: "description", content: "Yangi vazifalar, baholar va eslatmalar." },
    ],
  }),
  component: Notifs,
});

type Notif = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  cls: string;
  title: string;
  body: string;
  to: string;
  params?: Record<string, string>;
};

function Notifs() {
  const hwQ = useQuery({ queryKey: ["homework"], queryFn: getHomework });
  const finQ = useQuery({ queryKey: ["finance"], queryFn: getFinance });

  const items: Notif[] = [];
  // Outstanding balance.
  if ((finQ.data?.balance ?? 0) > 0) {
    items.push({
      id: "debt",
      icon: CreditCard,
      cls: "bg-reward/15 text-reward",
      title: "To'lov eslatmasi",
      body: `${formatSum(finQ.data!.balance)} qarz`,
      to: "/tolovlar",
    });
  }
  for (const a of hwQ.data ?? []) {
    if (a.status === "accepted" && a.score != null) {
      items.push({
        id: `g-${a.id}`,
        icon: Star,
        cls: "bg-success/15 text-success",
        title: "Vazifa baholandi",
        body: `${a.title} · +${a.score} XP`,
        to: "/darslar/$lessonId",
        params: { lessonId: a.id },
      });
    } else if (a.status === "" && a.deadline) {
      items.push({
        id: `d-${a.id}`,
        icon: AlertCircle,
        cls: "bg-alert/15 text-alert",
        title: "Vazifa muddati",
        body: `${a.title} · ${timeRemaining(a.deadline).label}`,
        to: "/darslar/$lessonId",
        params: { lessonId: a.id },
      });
    }
  }

  const loading = hwQ.isLoading || finQ.isLoading;

  return (
    <div className="space-y-3 px-5 pb-8 pt-4">
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight">Bildirishnomalar</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline bg-surface/50 p-8 text-center">
          <Bell className="mx-auto mb-2 size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Yangi bildirishnoma yo'q.</p>
        </div>
      ) : (
        items.map((n, i) => (
          <Link
            key={n.id}
            to={n.to}
            params={n.params as never}
            className="press animate-card-rise flex items-start gap-3 rounded-2xl border border-hairline bg-surface p-4"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${n.cls}`}>
              <n.icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{n.title}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.body}</p>
            </div>
            <ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground" />
          </Link>
        ))
      )}
    </div>
  );
}
