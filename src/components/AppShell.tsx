import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Home, MessageCircle, Trophy, User, Users } from "lucide-react";
import { type ReactNode } from "react";
import { getFinance, getHomework, getMe } from "@/lib/resources";
import { formatCoins } from "@/lib/format";

const tabs = [
  { to: "/", label: "Bosh sahifa", icon: Home, exact: true },
  { to: "/guruhlar", label: "Guruhlar", icon: Users, exact: false },
  { to: "/reyting", label: "Reyting", icon: Trophy, exact: false },
  { to: "/chat", label: "Chat", icon: MessageCircle, exact: false },
  { to: "/profil", label: "Profil", icon: User, exact: false },
] as const;

function TopBar() {
  const meQ = useQuery({ queryKey: ["me"], queryFn: getMe });
  const hwQ = useQuery({ queryKey: ["homework"], queryFn: getHomework });
  const finQ = useQuery({ queryKey: ["finance"], queryFn: getFinance });
  const pending = (hwQ.data ?? []).filter((a) => a.status === "").length;
  const unread = pending + ((finQ.data?.balance ?? 0) > 0 ? 1 : 0);
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-background/85 px-5 py-3.5 backdrop-blur-xl">
      <Link to="/" className="flex items-center gap-2 press">
        <img
          src="/logo.png"
          alt="Staydy"
          className="size-9 rounded-xl bg-white object-contain p-0.5 shadow-glow"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <span className="font-display text-lg font-bold tracking-tight">Staydy</span>
      </Link>
      <div className="flex items-center gap-2.5">
        <Link
          to="/dokon"
          className="press flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5"
        >
          <span className="grid size-4 place-items-center rounded-full bg-reward text-[10px]">🪙</span>
          <span className="num font-display text-sm font-bold text-reward">{formatCoins(meQ.data?.coins ?? 0)}</span>
        </Link>
        <Link
          to="/bildirishnomalar"
          className="press relative grid size-10 place-items-center rounded-full border border-hairline bg-surface"
          aria-label="Bildirishnomalar"
        >
          <Bell className="size-4 text-muted-foreground" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-alert text-[9px] font-bold text-alert-foreground ring-2 ring-background">
              {unread}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

function BottomTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 z-40 border-t border-hairline bg-background/90 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl">
      <div className="flex items-stretch justify-between">
        {tabs.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className="press flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2"
            >
              <div
                className={`grid size-9 place-items-center rounded-xl transition-colors ${
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children?: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[radial-gradient(ellipse_at_top,#2C2447_0%,#171226_60%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[460px] flex-col bg-background shadow-[0_0_80px_-20px_rgba(109,93,246,0.35)] md:my-6 md:min-h-[calc(100vh-3rem)] md:rounded-[32px] md:ring-1 md:ring-white/5">
        <TopBar />
        <main className="flex-1">{children ?? <Outlet />}</main>
        <BottomTabs />
      </div>
    </div>
  );
}
