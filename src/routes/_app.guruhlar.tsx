import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Clock, Loader2 } from "lucide-react";
import { getGroups } from "@/lib/resources";

export const Route = createFileRoute("/_app/guruhlar")({
  head: () => ({
    meta: [
      { title: "Guruhlarim — Staydy" },
      { name: "description", content: "Guruhlaringiz va darslar." },
    ],
  }),
  component: Groups,
});

const DAY_UZ: Record<string, string> = {
  mon: "Du", tue: "Se", wed: "Ch", thu: "Pa", fri: "Ju", sat: "Sh", sun: "Ya",
};
const days = (s?: string) =>
  (s ?? "")
    .split(/[,\s]+/)
    .filter(Boolean)
    .map((d) => DAY_UZ[d] ?? d)
    .join(" · ");

function Groups() {
  const groupsQ = useQuery({ queryKey: ["groups"], queryFn: getGroups });
  const list = groupsQ.data ?? [];

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <h1 className="font-display text-2xl font-bold tracking-tight">Guruhlarim</h1>

      {groupsQ.isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline bg-surface/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">Hali guruh yo'q.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((g, i) => (
            <Link
              key={g.id}
              to="/guruhlar/$groupId"
              params={{ groupId: g.id }}
              className="press animate-card-rise block rounded-[22px] border border-hairline bg-surface p-5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {g.direction && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {g.direction}
                    </p>
                  )}
                  <h3 className="mt-0.5 font-display text-lg font-bold">{g.name}</h3>
                  {(g.scheduleDays || g.startTime) && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {days(g.scheduleDays)}
                      {g.startTime && (
                        <>
                          <Clock className="size-3" /> {g.startTime}
                          {g.endTime ? `–${g.endTime}` : ""}
                        </>
                      )}
                    </p>
                  )}
                </div>
                <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
