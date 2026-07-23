import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Crown, Loader2, Medal } from "lucide-react";
import { getGroups, getLeaderboard, getMe, type LeaderRow } from "@/lib/resources";
import { formatCoins } from "@/lib/format";

export const Route = createFileRoute("/_app/reyting")({
  head: () => ({
    meta: [
      { title: "Reyting — Staydy" },
      { name: "description", content: "Guruh va markaz reytingi." },
    ],
  }),
  component: Rating,
});

const initials = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("");

function Rating() {
  const [scope, setScope] = useState<"group" | "center">("center");
  const meQ = useQuery({ queryKey: ["me"], queryFn: getMe });
  const groupsQ = useQuery({ queryKey: ["groups"], queryFn: getGroups });
  const gid = scope === "group" ? groupsQ.data?.[0]?.id : undefined;
  const lbQ = useQuery({
    queryKey: ["leaderboard", scope, gid ?? "center"],
    queryFn: () => getLeaderboard(gid),
    enabled: scope === "center" || !!gid,
  });

  const list: LeaderRow[] = lbQ.data ?? [];
  const meRow = list.find((r) => r.isMe);

  return (
    <div className="space-y-5 px-5 pb-24 pt-4">
      <h1 className="font-display text-2xl font-bold tracking-tight">Reyting</h1>

      <div className="flex rounded-2xl border border-hairline bg-surface p-1">
        {(
          [
            { k: "group", label: "Guruh" },
            { k: "center", label: "Markaz" },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            onClick={() => setScope(t.k)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
              scope === t.k ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {lbQ.isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline bg-surface/50 p-8 text-center text-sm text-muted-foreground">
          Hali reyting yo'q.
        </div>
      ) : (
        <>
          {/* Podium */}
          <div className="grid grid-cols-3 items-end gap-2">
            {[list[1], list[0], list[2]].map((row, idx) => {
              const rank = idx === 1 ? 1 : idx === 0 ? 2 : 3;
              const heights = ["h-24", "h-32", "h-20"];
              const colors = ["bg-elevated", "bg-gradient-to-b from-reward to-reward/50", "bg-elevated"];
              if (!row) return <div key={idx} />;
              return (
                <div key={row.studentId} className="animate-card-rise flex flex-col items-center gap-2" style={{ animationDelay: `${idx * 100}ms` }}>
                  {rank === 1 && <Crown className="size-5 text-reward" fill="currentColor" />}
                  <div className="grid size-14 place-items-center rounded-full bg-primary/20 font-display text-lg font-bold text-primary ring-2 ring-primary/40">
                    {initials(row.name)}
                  </div>
                  <p className="max-w-full truncate text-center text-xs font-semibold">{row.name.split(" ")[0]}</p>
                  <p className="num text-[11px] font-bold text-reward">{formatCoins(row.xp)} XP</p>
                  <div className={`w-full rounded-t-2xl ${heights[idx]} ${colors[idx]} grid place-items-center font-display text-xl font-bold text-primary-foreground`}>
                    {rank}
                  </div>
                </div>
              );
            })}
          </div>

          {/* List */}
          <div className="space-y-2">
            {list.slice(3).map((row) => (
              <div
                key={row.studentId}
                className={`animate-card-rise flex items-center gap-3 rounded-2xl border p-3 ${
                  row.isMe ? "border-primary/50 bg-primary/10" : "border-hairline bg-surface"
                }`}
              >
                <span className="num w-6 text-center text-sm font-bold text-muted-foreground">{row.rank}</span>
                <div className="grid size-9 place-items-center rounded-full bg-elevated text-xs font-bold">
                  {initials(row.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{row.name}</p>
                  <p className="num text-[11px] text-muted-foreground">{formatCoins(row.coins)} 🪙</p>
                </div>
                <span className="num text-sm font-bold text-reward">{formatCoins(row.xp)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sticky my rank */}
      {meQ.data && (
        <div className="sticky bottom-2 rounded-2xl border border-primary/40 bg-elevated p-4 shadow-glow">
          <div className="flex items-center gap-3">
            <Medal className="size-5 text-reward" />
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Sizning o'rningiz
              </p>
              <p className="font-display text-lg font-bold">
                {meRow ? `#${meRow.rank} · ` : ""}
                {meQ.data.name}
              </p>
            </div>
            <span className="num text-sm font-bold text-reward">{formatCoins(meQ.data.xp)} XP</span>
          </div>
        </div>
      )}
    </div>
  );
}
