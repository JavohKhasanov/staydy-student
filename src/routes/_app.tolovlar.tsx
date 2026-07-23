import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { getFinance, type InvoiceStatus } from "@/lib/resources";
import { formatSum, formatDateUz } from "@/lib/format";

export const Route = createFileRoute("/_app/tolovlar")({
  head: () => ({
    meta: [
      { title: "To'lovlarim — Staydy" },
      { name: "description", content: "Invoyslar, qarz va to'lovlar tarixi." },
    ],
  }),
  component: Payments,
});

const invStatus: Record<InvoiceStatus, { label: string; cls: string }> = {
  paid: { label: "To'langan", cls: "bg-success/15 text-success" },
  partial: { label: "Qisman", cls: "bg-reward/15 text-reward" },
  unpaid: { label: "To'lanmagan", cls: "bg-alert/15 text-alert" },
  overdue: { label: "Muddati o'tgan", cls: "bg-alert/20 text-alert" },
};

function Payments() {
  const finQ = useQuery({ queryKey: ["finance"], queryFn: getFinance });
  const invoices = finQ.data?.invoices ?? [];
  const payments = finQ.data?.payments ?? [];
  const totalDebt = finQ.data?.balance ?? 0;
  const debtInvoices = invoices.filter((i) => i.amount > i.paidAmount);

  if (finQ.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5 px-5 pb-8 pt-4">
      <h1 className="font-display text-2xl font-bold tracking-tight">To'lovlarim</h1>

      {/* Balance */}
      <div
        className={`animate-card-rise rounded-[24px] border p-5 ${
          totalDebt > 0
            ? "border-alert/25 bg-alert/10"
            : "border-success/25 bg-success/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`grid size-12 place-items-center rounded-2xl ${
              totalDebt > 0 ? "bg-alert text-alert-foreground" : "bg-success text-success-foreground"
            }`}
          >
            {totalDebt > 0 ? <AlertTriangle className="size-6" /> : <CheckCircle2 className="size-6" />}
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${totalDebt > 0 ? "text-alert" : "text-success"}`}>
              {totalDebt > 0 ? "Qarz" : "Qarz yo'q"}
            </p>
            <p className={`num font-display text-2xl font-bold ${totalDebt > 0 ? "text-alert" : "text-success"}`}>
              {totalDebt > 0 ? formatSum(totalDebt) : "Barchasi to'langan ✅"}
            </p>
          </div>
        </div>
        {totalDebt > 0 && (
          <p className="mt-3 text-xs text-alert/90">
            To'lov uchun markazga murojaat qiling.
          </p>
        )}
      </div>

      {/* Invoices */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold">Invoyslar</h2>
        {invoices.map((inv, i) => {
          const s = invStatus[inv.status];
          const remaining = inv.amount - inv.paidAmount;
          return (
            <div
              key={inv.id}
              className="animate-card-rise rounded-[20px] border border-hairline bg-surface p-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="font-display font-bold">{inv.note || inv.period || "To'lov"}</p>
                  <p className="text-[11px] text-muted-foreground tabular">
                    {inv.period}
                    {inv.dueDate ? ` · Muddat: ${formatDateUz(inv.dueDate)}` : ""}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${s.cls}`}>
                  {s.label}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-hairline pt-3">
                <span className="text-xs text-muted-foreground">Umumiy</span>
                <span className="num text-sm font-bold">{formatSum(inv.amount)}</span>
              </div>
              {remaining > 0 && (
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Qoldi</span>
                  <span className="num text-sm font-bold text-alert">{formatSum(remaining)}</span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* History */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold">To'lovlar tarixi</h2>
        {payments.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl border border-hairline bg-surface p-4">
            <div>
              <p className="text-sm font-semibold">To'lov</p>
              <p className="text-[11px] text-muted-foreground tabular">
                {formatDateUz(p.paidAt)} · {p.method}
              </p>
            </div>
            <span className="num text-sm font-bold text-success">+{formatSum(p.amount)}</span>
          </div>
        ))}
      </section>

      {debtInvoices.length === 0 && payments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-hairline bg-surface/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">Hech qanday to'lov yozuvi yo'q.</p>
        </div>
      )}
    </div>
  );
}
