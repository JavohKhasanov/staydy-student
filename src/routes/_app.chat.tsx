import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";

import { sendChat } from "@/lib/resources";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({
    meta: [
      { title: "Yordamchi — Staydy" },
      { name: "description", content: "Staydy Yordamchi bilan suhbat." },
    ],
  }),
  component: Chat,
});

interface Msg {
  id: string;
  role: "user" | "bot";
  text: string;
  chips?: string[];
}

const initial: Msg[] = [
  {
    id: "m1",
    role: "bot",
    text: "Salom! 👋 Men Staydy Yordamchiman. O'qish, motivatsiya yoki reja bo'yicha savolingiz bo'lsa, yozing.",
    chips: ["Yaxshi ketyapti", "Qiynalyapman", "Vaqt yetmayapti"],
  },
];

function Chat() {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text };
    // History for the model: prior turns before this message (role: user | assistant).
    const history = messages.map((m) => ({ role: m.role === "bot" ? "assistant" : "user", text: m.text }));
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    try {
      const { reply } = await sendChat(text, history);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "bot", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "bot", text: "Ulanishda xatolik. Qaytadan urinib ko'ring." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col md:h-[calc(100vh-180px)]">
      <div className="flex items-center gap-3 border-b border-hairline px-5 py-3">
        <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow">
          <Sparkles className="size-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-display font-bold">Staydy Yordamchi</p>
          <p className="text-[11px] text-success">● onlayn</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={m.role === "user" ? "max-w-[80%]" : "max-w-[85%] space-y-2"}>
              <div
                className={`animate-card-rise rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-surface"
                }`}
              >
                {m.text}
              </div>
              {m.chips && (
                <div className="flex flex-wrap gap-2">
                  {m.chips.map((c) => (
                    <button
                      key={c}
                      onClick={() => send(c)}
                      className="press rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-md bg-surface px-4 py-3">
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-hairline bg-background/80 p-3 backdrop-blur"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Xabar yozing..."
          className="flex-1 rounded-full border border-hairline bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="press grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
