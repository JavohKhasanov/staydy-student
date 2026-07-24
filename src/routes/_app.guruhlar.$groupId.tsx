import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Filter, Loader2 } from "lucide-react";
import { getExams, getGroups, getHomework, type HomeworkStatus } from "@/lib/resources";
import { formatDateUz } from "@/lib/format";

export const Route = createFileRoute("/_app/guruhlar/$groupId")({
  head: ({ params }) => ({
    meta: [
      { title: `Guruh · ${params.groupId} — Staydy` },
      { name: "description", content: "Guruh vazifalari va natijalar." },
    ],
  }),
  component: GroupDetail,
});

const statusChip: Record<HomeworkStatus, { label: string; cls: string }> = {
  "": { label: "Topshirilmagan", cls: "bg-alert/15 text-alert" },
  submitted: { label: "Topshirildi", cls: "bg-primary/15 text-primary" },
  accepted: { label: "Qabul qilindi", cls: "bg-success/15 text-success" },
  rejected: { label: "Qayta ishlash", cls: "bg-alert/15 text-alert" },
};

type FilterKey = "all" | "pending";

function GroupDetail() {
  const { groupId } = Route.useParams();
  const [filter, setFilter] = useState<FilterKey>("all");
  const groupsQ = useQuery({ queryKey: ["groups"], queryFn: getGroups });
  const hwQ = useQuery({ queryKey: ["homework"], queryFn: getHomework });
  const examsQ = useQuery({ queryKey: ["exams"], queryFn: getExams });
  const exams = examsQ.data ?? [];

  const group = (groupsQ.data ?? []).find((g) => g.id === groupId);
  const assignments = (hwQ.data ?? []).filter((a) => a.groupId === groupId);
  const filtered = assignments.filter((a) => (filter === "pending" ? a.status === "" : true));

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <Link to="/guruhlar" className="press inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="size-4" /> Guruhlar
      </Link>

      <div className="rounded-[22px] border border-hairline bg-surface p-5">
        {group?.direction && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{group.direction}</p>
        )}
        <h1 className="mt-1 font-display text-2xl font-bold">{group?.name ?? "Guruh"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{assignments.length} ta vazifa</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="size-4 shrink-0 text-muted-foreground" />
        {(
          [
            { k: "all", label: "Barchasi" },
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

      {/* Assignments */}
      {hwQ.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => {
            const chip = statusChip[a.status];
            return (
              <Link
                key={a.id}
                to="/darslar/$lessonId"
                params={{ lessonId: a.id }}
                className="press animate-card-rise block rounded-[20px] border border-hairline bg-surface p-4"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {a.deadline && (
                      <p className="text-[11px] text-muted-foreground tabular">
                        Muddat: {formatDateUz(a.deadline)}
                      </p>
                    )}
                    <h3 className="mt-0.5 truncate font-display font-bold">{a.title}</h3>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${chip.cls}`}>
                    {chip.label}
                    {a.score != null ? ` · ${a.score}` : ""}
                  </span>
                </div>
              </Link>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-hairline bg-surface/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">Vazifa yo'q.</p>
            </div>
          )}
        </div>
      )}

      {/* Exams */}
      {exams.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold">Imtihonlar</h2>
          {exams.map((e) => (
            <div key={e.examId} className="flex items-center justify-between rounded-[20px] border border-hairline bg-surface p-4">
              <div className="min-w-0">
                <h3 className="truncate font-display font-bold">{e.title}</h3>
                {e.examDate && (
                  <p className="text-[11px] text-muted-foreground tabular">{formatDateUz(e.examDate)}</p>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-sm font-bold text-primary tabular">
                {e.score}<span className="text-muted-foreground">/{e.maxScore}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
