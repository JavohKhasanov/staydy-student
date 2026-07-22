import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ChevronLeft,
  Clock,
  Download,
  File as FileIcon,
  Link as LinkIcon,
  Send,
  Star,
} from "lucide-react";
import { getGroup, getLesson, type Lesson, type Submission } from "@/lib/mock-data";
import { formatDateTimeUz, timeRemaining } from "@/lib/format";

export const Route = createFileRoute("/_app/darslar/$lessonId")({
  head: ({ params }) => ({
    meta: [
      { title: `Dars · ${params.lessonId} — Staydy` },
      { name: "description", content: "Dars mavzusi va uy vazifasi." },
    ],
  }),
  loader: ({ params }) => {
    const l = getLesson(params.lessonId);
    if (!l) throw notFound();
    return l;
  },
  component: LessonDetail,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Dars topilmadi</div>
  ),
});

function LessonDetail() {
  const { lessonId } = Route.useParams();
  const lesson = getLesson(lessonId);
  if (!lesson) {
    return <div className="p-10 text-center text-muted-foreground">Dars topilmadi</div>;
  }
  return <LessonView lesson={lesson} />;
}

function LessonView({ lesson }: { lesson: Lesson }) {
  const group = getGroup(lesson.groupId);
  const [submission, setSubmission] = useState<Submission | null>(lesson.homework?.submission ?? null);
  const [text, setText] = useState(submission?.text ?? "");
  const [link, setLink] = useState(submission?.links[0] ?? "");
  const [reward, setReward] = useState(false);

  const hw = lesson.homework;
  const t = hw ? timeRemaining(hw.deadline) : null;

  const submit = () => {
    if (!text.trim() && !link.trim()) {
      toast.error("Matn yoki havola qo'shing");
      return;
    }
    setSubmission({
      text: text.trim(),
      links: link.trim() ? [link.trim()] : [],
      files: [],
      submittedAt: new Date().toISOString(),
      edited: !!submission,
    });
    setReward(true);
    toast.success("Zo'r! Vazifa qabul qilindi", { description: "+15 🪙 kumush qo'shildi" });
    setTimeout(() => setReward(false), 2000);
  };

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <Link
        to="/guruhlar/$groupId"
        params={{ groupId: lesson.groupId }}
        className="press inline-flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ChevronLeft className="size-4" /> {group?.name}
      </Link>

      <header className="animate-card-rise">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          {formatDateTimeUz(lesson.date)}
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold leading-tight">{lesson.topic}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {group?.teacher.name} · {lesson.room}
        </p>
      </header>

      {hw ? (
        <>
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
            <p className="text-sm leading-relaxed text-foreground/90">{hw.text}</p>

            {hw.files.length > 0 && (
              <div className="mt-4 space-y-2">
                {hw.files.map((f: { name: string; size: string; url: string }) => (
                  <a
                    key={f.name}
                    href={f.url}
                    className="press flex items-center gap-3 rounded-xl border border-hairline bg-elevated p-3"
                  >
                    <div className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
                      <FileIcon className="size-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{f.name}</p>
                      <p className="text-[11px] text-muted-foreground">{f.size}</p>
                    </div>
                    <Download className="size-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            )}

            <p className="mt-3 text-[11px] text-muted-foreground tabular">
              Muddat: {formatDateTimeUz(hw.deadline)}
            </p>
          </section>

          {/* Graded panel */}
          {hw.status === "accepted" && hw.score != null && (
            <section className="animate-card-rise rounded-[22px] border border-success/30 bg-success/10 p-5" style={{ animationDelay: "120ms" }}>
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-success text-success-foreground">
                  <Star className="size-5" fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-success">Baholandi</p>
                  <p className="font-display text-3xl font-bold tabular text-success">{hw.score}</p>
                </div>
              </div>
              {hw.reviewNote && (
                <p className="mt-3 text-sm italic text-success/90">"{hw.reviewNote}"</p>
              )}
            </section>
          )}

          {/* Submission form / view */}
          <section className="animate-card-rise relative rounded-[22px] border border-hairline bg-surface p-5" style={{ animationDelay: "180ms" }}>
            <h2 className="mb-3 font-display text-lg font-bold">Mening jo'natmam</h2>

            {reward && (
              <div className="pointer-events-none absolute right-6 top-6 animate-float-up">
                <span className="font-display text-lg font-bold text-reward">+15 🪙</span>
              </div>
            )}

            {submission && hw.status !== "accepted" && (
              <div className="mb-3 flex items-center gap-2 text-[11px] text-muted-foreground tabular">
                <span className="rounded-full bg-primary/15 px-2 py-0.5 font-bold text-primary">
                  {hw.status === "submitted" ? "Ko'rib chiqilmoqda" : "Yuborilgan"}
                </span>
                <span>· {formatDateTimeUz(submission.submittedAt)}</span>
                {submission.edited && <span className="text-reward">· Tahrirlangan</span>}
              </div>
            )}

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Izohingiz yoki topshiriq matni..."
              rows={4}
              disabled={hw.status === "accepted"}
              className="w-full rounded-xl border border-hairline bg-elevated p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            />

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-hairline bg-elevated px-3">
              <LinkIcon className="size-4 text-muted-foreground" />
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://github.com/..."
                disabled={hw.status === "accepted"}
                className="flex-1 bg-transparent py-3 text-sm outline-none disabled:opacity-60"
              />
            </div>

            {hw.status !== "accepted" && (
              <button
                onClick={submit}
                className="press mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow py-3 font-bold text-primary-foreground shadow-glow"
              >
                <Send className="size-4" />
                {submission ? "Yangilash" : "Topshirish"}
              </button>
            )}
          </section>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-hairline bg-surface/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">Bu darsda vazifa yo'q. Dam oling 🙂</p>
        </div>
      )}
    </div>
  );
}
