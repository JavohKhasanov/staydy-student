import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Phone, Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Kirish — Staydy" },
      { name: "description", content: "Staydy Talaba hisobingizga kiring." },
    ],
  }),
  component: Login,
});

function formatPhone(v: string) {
  const digits = v.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);
  return "+998 " + parts.join(" ");
}

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 12) {
      setErr("Telefon raqamini to'liq kiriting");
      return;
    }
    if (password.length < 4) {
      setErr("Parol juda qisqa");
      return;
    }
    setErr(null);
    toast.success("Xush kelibsiz!");
    setTimeout(() => navigate({ to: "/" }), 400);
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,#2C2447_0%,#171226_60%)] px-5 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[420px] flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow font-display text-3xl font-bold text-primary-foreground shadow-glow">
            S
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Xush kelibsiz</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O'quv sarguzashtingizni davom ettiring.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-[24px] border border-hairline bg-surface p-6">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Telefon raqam
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-hairline bg-elevated px-3 focus-within:border-primary">
              <Phone className="size-4 text-muted-foreground" />
              <input
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="num flex-1 bg-transparent py-3 text-sm outline-none"
                placeholder="+998 90 123 45 67"
                inputMode="tel"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Parol
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-hairline bg-elevated px-3 focus-within:border-primary">
              <Lock className="size-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent py-3 text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {err && (
            <p className="rounded-lg bg-alert/10 px-3 py-2 text-xs text-alert">{err}</p>
          )}

          <button
            type="submit"
            className="press flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-glow py-3.5 font-display font-bold text-primary-foreground shadow-glow"
          >
            Kirish
          </button>

          <button
            type="button"
            onClick={() => toast("Parolni tiklash uchun markazga murojaat qiling")}
            className="w-full text-center text-xs font-semibold text-muted-foreground"
          >
            Parolni unutdingizmi?
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Telegram ichida avtomatik kirasiz.
        </p>
      </div>
    </div>
  );
}
