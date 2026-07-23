import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ChevronRight, Clock, Loader2, Sparkles } from "lucide-react";
import { MomentumRing } from "@/components/MomentumRing";
import { getHomework, getGroups, getLeaderboard, getMe } from "@/lib/resources";
import { timeRemaining } from "@/lib/format";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Bosh sahifa — Staydy" },
      { name: "description", content: "Bugungi darslar, vazifalar va momentum meter." },
    ],
  }),
  component: Home,
});

const WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const todayCode = () => WEEK[new Date().getDay()];

function Home() {
  const meQ = useQuery({ queryKey: ["me"], queryFn: getMe });
  const hwQ = useQuery({ queryKey: ["homework"], queryFn: getHomework });
  const groupsQ = useQuery({ queryKey: ["groups"], queryFn: getGroups });
  const rankQ = useQuery({ queryKey: ["leaderboard"], queryFn: () => getLeaderboard() });

  const me = meQ.data;
  const assignments = hwQ.data ?? [];
  // Soonest un-submitted assignment that has a deadline.
  const pending = assignments
    .filter((a) => a.status === "" && a.deadline)
    .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1));
  const nextDeadline = pending[0];
  // Today's scheduled groups (from each group's recurring schedule).
  const code = todayCode();
  const todayGroups = (groupsQ.data ?? []).filter((g) => (g.scheduleDays ?? "").includes(code));
  // Homework stats.
  const graded = assignments.filter((a) => a.status === "accepted");
  const avg =
    graded.length > 0
      ? (graded.reduce((s, a) => s + (a.score ?? 0), 0) / graded.length).toFixed(1)
      : "—";
  const myRank = (rankQ.data ?? []).find((r) => r.isMe)?.rank;

  if (meQ.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5 pb-8 pt-4">
      {/* Momentum */}
      <section className="animate-card-rise">
        <MomentumRing
          level={me?.level ?? 1}
          xp={me?.xpIntoLevel ?? 0}
          xpToNext={me?.xpPerLevel ?? 1000}
          streakDays={0}
        />
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-hairline bg-elevated p-4">
          <div>
            <p className="text-[11px] text-muted-foreground">Keyingi darajaga</p>
            <p className="font-display font-bold">
              +{Math.max(0, (me?.xpPerLevel ?? 0) - (me?.xpIntoLevel ?? 0))} XP kerak
            </p>
          </div>
          <Link
            to="/reyting"
            className="press flex items-center gap-1 rounded-xl bg-primary px-3.5 py-2 text-sm font-bold text-primary-foreground shadow-glow"
          >
            Reyting{myRank ? ` #${myRank}` : ""}
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Deadline alert */}
      {nextDeadline && (
        <Link
          to="/darslar/$lessonId"
          params={{ lessonId: nextDeadline.id }}
          className="animate-card-rise press block rounded-[22px] border border-alert/25 bg-alert/10 p-4"
          style={{ animationDelay: "60ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-alert text-alert-foreground">
              <AlertCircle className="size-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-alert">1 ta vazifa muddati yaqin</p>
              <p className="text-xs text-alert/80 tabular">{timeRemaining(nextDeadline.deadline!).label}</p>
            </div>
            <ChevronRight className="size-5 text-alert" />
          </div>
        </Link>
      )}

      {/* Weekly check-in */}
      <Link
        to="/checkin"
        className="animate-card-rise press relative block overflow-hidden rounded-[24px] border border-hairline bg-gradient-to-br from-elevated via-surface to-elevated p-5"
        style={{ animationDelay: "120ms" }}
      >
        <div className="absolute -right-6 -top-6 size-28 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-reward">
            <Sparkles className="size-3" /> Haftalik ritual
          </div>
          <h3 className="font-display text-xl font-bold leading-tight">Bu hafta qanday ketyapti?</h3>
          <p className="mt-1 text-sm text-muted-foreground">2 daqiqa — va kumush sizniki.</p>
          <div className="mt-4 inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow">
            Boshlash <ChevronRight className="size-4" />
          </div>
        </div>
      </Link>

      {/* Today's lessons (from group schedules) */}
      <section className="animate-card-rise space-y-3" style={{ animationDelay: "180ms" }}>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight">Bugungi darslar</h2>
          <span className="text-xs text-muted-foreground">{todayGroups.length} ta dars</span>
        </div>

        {todayGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-hairline bg-surface/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">Bugun dars yo'q. Dam oling 🙂</p>
          </div>
        ) : (
          todayGroups.map((g) => (
            <Link
              key={g.id}
              to="/guruhlar/$groupId"
              params={{ groupId: g.id }}
              className="press block rounded-[22px] border border-hairline bg-surface p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {g.direction || "Dars"}
                </span>
                {g.startTime && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground tabular">
                    <Clock className="size-3" /> {g.startTime}
                    {g.endTime ? `–${g.endTime}` : ""}
                  </span>
                )}
              </div>
              <h3 className="font-display text-base font-bold">{g.name}</h3>
            </Link>
          ))
        )}
      </section>

      {/* Quick stats */}
      <section className="animate-card-rise grid grid-cols-3 gap-3" style={{ animationDelay: "240ms" }}>
        {[
          { label: "Kumush", value: String(me?.coins ?? 0), color: "text-reward" },
          {
            label: "Vazifalar",
            value: `${graded.length}/${assignments.length}`,
            color: "text-success",
          },
          { label: "O'rtacha", value: avg, color: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-hairline bg-surface p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <p className={`mt-1 font-display text-lg font-bold tabular ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
