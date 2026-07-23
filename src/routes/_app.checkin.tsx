import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, Sparkles } from "lucide-react";
import { ApiError } from "@/lib/api";
import { checkin as apiCheckin } from "@/lib/resources";

export const Route = createFileRoute("/_app/checkin")({
  head: () => ({
    meta: [
      { title: "Haftalik check-in — Staydy" },
      { name: "description", content: "Bu hafta qanday ketyapti? 2 daqiqa va +50 kumush." },
    ],
  }),
  component: CheckIn,
});

const faces = ["😔", "😕", "😐", "🙂", "🤩"];
const obstacles = ["Vaqt yetishmasligi", "Mavzu qiyin", "Motivatsiya past", "Shaxsiy sabab", "Boshqa"];

function CheckIn() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [motivation, setMotivation] = useState(0);
  const [progress, setProgress] = useState(0);
  const [obstacle, setObstacle] = useState("");
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  const m = useMutation({
    mutationFn: () => apiCheckin({ motivation, progress, obstacle, comment }),
    onSuccess: () => {
      setDone(true);
      qc.invalidateQueries({ queryKey: ["me"] });
      setTimeout(() => navigate({ to: "/" }), 1600);
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : "Xatolik"),
  });

  const submit = () => {
    if (!motivation || !progress) {
      toast.error("Motivatsiya va progress darajasini tanlang");
      return;
    }
    m.mutate();
  };

  if (done) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <div className="animate-glow-pulse grid size-24 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-4xl shadow-glow">
          ✨
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold">Zo'r! Rahmat.</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Keyingi hafta yana ko'rishguncha. Har hafta o'sish davom etadi.
        </p>
        <p className="num mt-4 font-display text-xl font-bold text-reward">Kumush qo'shildi 🪙</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5 pb-8 pt-4">
      <button onClick={() => history.back()} className="press flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="size-4" /> Orqaga
      </button>

      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-reward">
        <Sparkles className="size-3" /> Haftalik ritual
      </div>
      <h1 className="-mt-4 font-display text-2xl font-bold leading-tight">
        Bu hafta qanday ketyapti?
      </h1>

      <section className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">Motivatsiyangiz</p>
        <div className="flex justify-between gap-2">
          {faces.map((f, i) => (
            <button
              key={f}
              onClick={() => setMotivation(i + 1)}
              className={`press flex-1 rounded-2xl border p-3 text-3xl transition-all ${
                motivation === i + 1
                  ? "scale-105 border-primary bg-primary/15"
                  : "border-hairline bg-surface"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">Kursni qanchalik tushunyapsiz?</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setProgress(n)}
              className={`press flex-1 rounded-2xl border py-4 font-display text-lg font-bold transition-all ${
                progress === n
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-hairline bg-surface text-muted-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">Eng katta to'siq</p>
        <div className="flex flex-wrap gap-2">
          {obstacles.map((o) => (
            <button
              key={o}
              onClick={() => setObstacle(o)}
              className={`press rounded-full border px-3.5 py-2 text-xs font-semibold ${
                obstacle === o
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-hairline bg-surface text-muted-foreground"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Ixtiyoriy izoh..."
          className="w-full rounded-xl border border-hairline bg-surface p-3 text-sm outline-none focus:border-primary"
        />
      </section>

      <button
        onClick={submit}
        disabled={m.isPending}
        className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary-glow py-4 font-display font-bold text-primary-foreground shadow-glow disabled:opacity-70"
      >
        {m.isPending ? "Yuborilmoqda…" : "Yakunlash"}
      </button>
    </div>
  );
}
