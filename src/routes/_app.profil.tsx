import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronRight, LogOut } from "lucide-react";
import { clearSession } from "@/lib/auth";
import { getMe } from "@/lib/resources";
import { formatCoins } from "@/lib/format";

export const Route = createFileRoute("/_app/profil")({
  head: () => ({
    meta: [
      { title: "Profil — Staydy" },
      { name: "description", content: "Shaxsiy sozlamalar va hisob ma'lumotlari." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const meQ = useQuery({ queryKey: ["me"], queryFn: getMe });
  const me = meQ.data;

  const logout = () => {
    clearSession();
    navigate({ to: "/login" });
  };

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <h1 className="font-display text-2xl font-bold tracking-tight">Profil</h1>

      {/* Card */}
      <div className="animate-card-rise rounded-[24px] border border-hairline bg-gradient-to-br from-elevated to-surface p-5">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow font-display text-2xl font-bold text-primary-foreground shadow-glow">
            {(me?.name ?? "?").split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-bold">{me?.name ?? "…"}</h2>
            <p className="text-xs text-muted-foreground tabular">{me?.phone}</p>
            {me?.groupName && <p className="mt-1 text-[11px] text-muted-foreground">{me.groupName}</p>}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat label="Bosqich" value={String(me?.level ?? 1)} />
          <Stat label="Kumush" value={formatCoins(me?.coins ?? 0)} accent="text-reward" />
          <Stat label="XP" value={formatCoins(me?.xp ?? 0)} accent="text-primary" />
        </div>
      </div>

      {/* Settings */}
      <section className="space-y-2">
        <Link
          to="/bildirishnomalar"
          className="press animate-card-rise flex items-center gap-3 rounded-2xl border border-hairline bg-surface p-4"
        >
          <div className="grid size-9 place-items-center rounded-xl bg-elevated text-muted-foreground">
            <Bell className="size-4" />
          </div>
          <span className="flex-1 text-sm font-semibold">Bildirishnomalar</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      </section>

      <button
        onClick={logout}
        className="press flex w-full items-center justify-center gap-2 rounded-2xl border border-alert/30 bg-alert/10 py-3.5 font-semibold text-alert"
      >
        <LogOut className="size-4" /> Chiqish
      </button>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-background/50 p-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`num mt-1 font-display font-bold ${accent ?? "text-foreground"}`}>{value}</p>
    </div>
  );
}
