import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, Filter } from "lucide-react";
import { getGroup, lessonsByGroup, type Group, type HomeworkStatus } from "@/lib/mock-data";
import { formatDateUz } from "@/lib/format";

export const Route = createFileRoute("/_app/guruhlar/$groupId")({
  head: ({ params }) => ({
    meta: [
      { title: `Guruh · ${params.groupId} — Staydy` },
      { name: "description", content: "Guruh darslari va progress." },
    ],
  }),
  loader: ({ params }) => {
    const g = getGroup(params.groupId);
    if (!g) throw notFound();
    return g;
  },
  component: GroupDetail,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Guruh topilmadi</div>
  ),
});

const statusChip: Record<HomeworkStatus, { label: string; cls: string }> = {
  none: { label: "Vazifasiz", cls: "bg-white/5 text-muted-foreground" },
  assigned: { label: "Topshirilmagan", cls: "bg-alert/15 text-alert" },
  submitted: { label: "Topshirildi", cls: "bg-primary/15 text-primary" },
  accepted: { label: "Qabul qilindi", cls: "bg-success/15 text-success" },
  rejected: { label: "Qayta ishlash", cls: "bg-alert/15 text-alert" },
};

type FilterKey = "all" | "with_hw" | "pending";

function GroupDetail() {
  const { groupId } = Route.useParams();
  const group = getGroup(groupId);
  if (!group) {
    return <div className="p-10 text-center text-muted-foreground">Guruh topilmadi</div>;
  }
  return <GroupView group={group} />;
}

function GroupView({ group }: { group: Group }) {
  const lessons = useMemo(() => lessonsByGroup(group.id), [group.id]);
  const [filter, setFilter] = useState<FilterKey>("all");
  const pct = Math.round((group.lessonsDone / group.lessonsTotal) * 100);

  const filtered = lessons.filter((l) => {
    if (filter === "with_hw") return !!l.homework;
    if (filter === "pending") return l.homework?.status === "assigned";
    return true;
  });

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <Link to="/guruhlar" className="press inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="size-4" /> Guruhlar
      </Link>

      <div className="rounded-[22px] border border-hairline bg-surface p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{group.direction}</p>
        <h1 className="mt-1 font-display text-2xl font-bold">{group.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          O'qituvchi: {group.teacher.name} · {formatDateUz(group.startDate)} dan
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="num text-xs font-bold text-muted-foreground">
            {group.lessonsDone}/{group.lessonsTotal}
          </span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="size-4 shrink-0 text-muted-foreground" />
        {(
          [
            { k: "all", label: "Barchasi" },
            { k: "with_hw", label: "Vazifali" },
            { k: "pending", label: "Topshirilmagan" },
          ] as const
        ).map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.k
                ? "border-primary bg-primary text-primary-foreground"
                : "border-hairline bg-surface text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {filtered.map((l, i) => {
          const chip = statusChip[l.homework?.status ?? "none"];
          return (
            <Link
              key={l.id}
              to="/darslar/$lessonId"
              params={{ lessonId: l.id }}
              className="press animate-card-rise block rounded-[20px] border border-hairline bg-surface p-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground tabular">{formatDateUz(l.date)} · {l.timeLabel}</p>
                  <h3 className="mt-0.5 truncate font-display font-bold">{l.topic}</h3>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${chip.cls}`}>
                  {chip.label}
                  {l.homework?.score != null && ` · ${l.homework.score}`}
                </span>
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-hairline bg-surface/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">Bu filtr uchun dars topilmadi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
