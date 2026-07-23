import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, Clock, Link as LinkIcon, Loader2, Send, Star } from "lucide-react";
import { ApiError } from "@/lib/api";
import { getHomework, submitHomework } from "@/lib/resources";
import { formatDateTimeUz, timeRemaining } from "@/lib/format";

export const Route = createFileRoute("/_app/darslar/$lessonId")({
  head: ({ params }) => ({
    meta: [
      { title: `Vazifa · ${params.lessonId} — Staydy` },
      { name: "description", content: "Uy vazifasi va topshirish." },
    ],
  }),
  component: AssignmentDetail,
});

function AssignmentDetail() {
  const { lessonId } = Route.useParams();
  const qc = useQueryClient();
  const hwQ = useQuery({ queryKey: ["homework"], queryFn: getHomework });
  const a = (hwQ.data ?? []).find((x) => x.id === lessonId);

  const [text, setText] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  const m = useMutation({
    mutationFn: () =>
      submitHomework(lessonId, text ?? a?.submissionText ?? "", link ?? a?.submissionLinks ?? ""),
    onSuccess: () => {
      toast.success("Zo'r! Vazifa topshirildi");
      qc.invalidateQueries({ queryKey: ["homework"] });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : "Xatolik"),
  });

  if (hwQ.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!a) {
    return <div className="p-10 text-center text-muted-foreground">Vazifa topilmadi</div>;
  }

  const accepted = a.status === "accepted";
  const t = a.deadline ? timeRemaining(a.deadline) : null;
  const textVal = text ?? a.submissionText ?? "";
  const linkVal = link ?? a.submissionLinks ?? "";

  const submit = () => {
    if (!textVal.trim() && !linkVal.trim()) {
      toast.error("Matn yoki havola qo'shing");
      return;
    }
    m.mutate();
  };

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <Link
        to="/guruhlar/$groupId"
        params={{ groupId: a.groupId }}
        className="press inline-flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ChevronLeft className="size-4" /> {a.groupName}
      </Link>

      <header className="animate-card-rise">
        <h1 className="font-display text-2xl font-bold leading-tight">{a.title}</h1>
      </header>

      {/* Homework brief */}
      <section className="animate-card-rise rounded-[22px] border border-hairline bg-surface p-5" style={{ animationDelay: "60ms" }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Uyga vazifa</h2>
          {t && (
            <span
              className={`num flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                t.urgent ? "bg-alert/15 text-alert" : "bg-primary/15 text-primary"
              }`}
            >
              <Clock className="size-3" /> {t.label}
            </span>
          )}
        </div>
        {a.description ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{a.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Tavsif yo'q.</p>
        )}
        {a.deadline && (
          <p className="mt-3 text-[11px] text-muted-foreground tabular">
            Muddat: {formatDateTimeUz(a.deadline)}
          </p>
        )}
      </section>

      {/* Graded panel */}
      {accepted && a.score != null && (
        <section className="animate-card-rise rounded-[22px] border border-success/30 bg-success/10 p-5" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-success text-success-foreground">
              <Star className="size-5" fill="currentColor" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-success">Baholandi</p>
              <p className="font-display text-3xl font-bold tabular text-success">
                {a.score} <span className="text-lg">XP</span>
              </p>
            </div>
          </div>
          {a.reviewNote && <p className="mt-3 text-sm italic text-success/90">"{a.reviewNote}"</p>}
        </section>
      )}

      {/* Submission form / view */}
      <section className="animate-card-rise rounded-[22px] border border-hairline bg-surface p-5" style={{ animationDelay: "180ms" }}>
        <h2 className="mb-3 font-display text-lg font-bold">Mening jo'natmam</h2>

        {a.status === "submitted" && (
          <div className="mb-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full bg-primary/15 px-2 py-0.5 font-bold text-primary">Ko'rib chiqilmoqda</span>
            {a.submittedAt && <span>· {formatDateTimeUz(a.submittedAt)}</span>}
          </div>
        )}
        {a.status === "rejected" && (
          <div className="mb-3 rounded-lg bg-alert/10 px-3 py-2 text-xs text-alert">
            Qayta ishlang{a.reviewNote ? `: ${a.reviewNote}` : "."}
          </div>
        )}

        <textarea
          value={textVal}
          onChange={(e) => setText(e.target.value)}
          placeholder="Izohingiz yoki topshiriq matni..."
          rows={4}
          disabled={accepted}
          className="w-full rounded-xl border border-hairline bg-elevated p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
        />

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-hairline bg-elevated px-3">
          <LinkIcon className="size-4 text-muted-foreground" />
          <input
            value={linkVal}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://github.com/..."
            disabled={accepted}
            className="flex-1 bg-transparent py-3 text-sm outline-none disabled:opacity-60"
          />
        </div>

        {!accepted && (
          <button
            onClick={submit}
            disabled={m.isPending}
            className="press mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow py-3 font-bold text-primary-foreground shadow-glow disabled:opacity-70"
          >
            {m.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {a.status === "" ? "Topshirish" : "Yangilash"}
          </button>
        )}
      </section>
    </div>
  );
}
