import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

interface Props {
  level: number;
  xp: number;
  xpToNext: number;
  streakDays: number;
}

export function MomentumRing({ level, xp, xpToNext, streakDays }: Props) {
  const pct = Math.min(1, xp / xpToNext);
  const R = 78;
  const C = 2 * Math.PI * R;
  const dashTarget = C * (1 - pct);

  // count-up
  const [displayXp, setDisplayXp] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayXp(Math.round(xp * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [xp]);

  return (
    <div className="relative mx-auto flex size-64 items-center justify-center">
      {/* Background ring */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6D5DF6" />
            <stop offset="100%" stopColor="#8B7BFF" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={R} fill="none" stroke="var(--surface)" strokeWidth="12" />
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={C}
          className="animate-ring-sweep"
          style={
            {
              ["--dash-full" as string]: `${C}`,
              ["--dash-target" as string]: `${dashTarget}`,
            } as React.CSSProperties
          }
        />
      </svg>

      {/* Streak flame */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full bg-reward/15 px-3 py-1 ring-1 ring-reward/30">
        <div className="flex items-center gap-1.5">
          <Flame className="size-3.5 text-reward animate-flame" />
          <span className="num text-xs font-bold text-reward">{streakDays} kun</span>
        </div>
      </div>

      {/* Inner content */}
      <div className="z-10 flex flex-col items-center text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Bosqich
        </span>
        <div className="font-display text-5xl font-bold tracking-tighter tabular">{level}</div>
        <div className="mt-1 text-[11px] font-semibold text-muted-foreground tabular">
          {displayXp.toLocaleString("uz-UZ")} / {xpToNext.toLocaleString("uz-UZ")} XP
        </div>
      </div>

      {/* Floating reward hint */}
      <div className="pointer-events-none absolute right-0 top-6 animate-float-up">
        <span className="font-display text-sm font-bold text-reward drop-shadow">+12 🪙</span>
      </div>
    </div>
  );
}
