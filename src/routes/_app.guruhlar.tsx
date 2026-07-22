import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { groups } from "@/lib/mock-data";
import { formatDateUz } from "@/lib/format";

export const Route = createFileRoute("/_app/guruhlar")({
  head: () => ({
    meta: [
      { title: "Guruhlarim — Staydy" },
      { name: "description", content: "Faol va tugagan guruhlaringiz." },
    ],
  }),
  component: Groups,
});

function Groups() {
  const [tab, setTab] = useState<"active" | "finished">("active");
  const filtered = groups.filter((g) => g.status === tab);

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <h1 className="font-display text-2xl font-bold tracking-tight">Guruhlarim</h1>

      <div className="flex rounded-2xl border border-hairline bg-surface p-1">
        {(
          [
            { k: "active", label: "Faol" },
            { k: "finished", label: "Tugagan" },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
              tab === t.k ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((g, i) => {
          const pct = Math.round((g.lessonsDone / g.lessonsTotal) * 100);
          return (
            <Link
              key={g.id}
              to="/guruhlar/$groupId"
              params={{ groupId: g.id }}
              className="press animate-card-rise block rounded-[22px] border border-hairline bg-surface p-5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {g.direction}
                  </p>
                  <h3 className="mt-0.5 font-display text-lg font-bold">{g.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {g.teacher.name} · {formatDateUz(g.startDate)} dan
                  </p>
                </div>
                <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="num text-xs font-bold text-muted-foreground">
                  {g.lessonsDone}/{g.lessonsTotal}
                </span>
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-hairline bg-surface/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {tab === "active" ? "Faol guruh yo'q." : "Tugagan guruh yo'q."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
