import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Lock } from "lucide-react";
import { shopItems as initial, student } from "@/lib/mock-data";
import { formatCoins } from "@/lib/format";

export const Route = createFileRoute("/_app/dokon")({
  head: () => ({
    meta: [
      { title: "Do'kon — Staydy" },
      { name: "description", content: "Kumush tangalarni mukofotlarga almashtiring." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [items, setItems] = useState(initial);
  const [coins, setCoins] = useState(student.coins);

  const buy = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.owned || coins < item.price) return;
    setCoins((c) => c - item.price);
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, owned: true } : i)));
    toast.success(`${item.name} sotib olindi!`, { description: `-${item.price} 🪙` });
  };

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight">Do'kon</h1>
        <div className="flex items-center gap-1.5 rounded-full border border-reward/30 bg-reward/10 px-3 py-1.5">
          <span>🪙</span>
          <span className="num font-display font-bold text-reward">{formatCoins(coins)}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Yig'gan kumushingizni nishonlar va avatarlarga almashtiring.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => {
          const affordable = coins >= item.price;
          return (
            <div
              key={item.id}
              className="animate-card-rise flex flex-col items-center rounded-[22px] border border-hairline bg-surface p-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-2 grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-elevated to-background text-4xl">
                {item.icon}
              </div>
              <p className="mb-1 text-center text-sm font-semibold">{item.name}</p>
              <p className="num mb-3 flex items-center gap-1 text-xs font-bold text-reward">
                🪙 {formatCoins(item.price)}
              </p>
              <button
                disabled={item.owned || !affordable}
                onClick={() => buy(item.id)}
                className={`press flex w-full items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold ${
                  item.owned
                    ? "bg-success/15 text-success"
                    : affordable
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-elevated text-muted-foreground"
                }`}
              >
                {item.owned ? (
                  <>
                    <Check className="size-3" /> Sizniki
                  </>
                ) : !affordable ? (
                  <>
                    <Lock className="size-3" /> Yetmaydi
                  </>
                ) : (
                  "Olish"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
