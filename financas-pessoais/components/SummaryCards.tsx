import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Summary } from "@/lib/types";

export function SummaryCards({ summary }: { summary: Summary }) {
  const negative = summary.balance < 0;

  return (
    <section aria-label="Resumo" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        className={`relative overflow-hidden rounded-2xl bg-linear-to-br p-6 ring-1 sm:col-span-2 lg:col-span-1 ${
          negative
            ? "from-rose-500/25 via-rose-500/10 to-transparent ring-rose-500/30"
            : "from-emerald-500/25 via-emerald-500/10 to-transparent ring-emerald-500/30"
        }`}
      >
        {/* Brilho decorativo no canto do card. */}
        <div
          className={`pointer-events-none absolute -top-12 -right-12 size-40 rounded-full blur-3xl ${
            negative ? "bg-rose-400/20" : "bg-emerald-400/20"
          }`}
        />
        <div className="relative flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">Saldo atual</span>
          <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-white">
            <Wallet className="size-4" />
          </span>
        </div>
        <p className="relative mt-4 text-4xl font-semibold tracking-tight text-white tabular-nums">
          {formatCurrency(summary.balance)}
        </p>
        <p className={`relative mt-1 text-sm ${negative ? "text-rose-300" : "text-emerald-300/80"}`}>
          {negative ? "Você está no vermelho" : "Disponível na carteira"}
        </p>
      </div>

      <StatCard
        title="Receitas"
        value={summary.totalIncome}
        icon={<ArrowUpRight className="size-4" />}
        color="text-emerald-400"
        badge="bg-emerald-500/10"
      />
      <StatCard
        title="Despesas"
        value={summary.totalExpense}
        icon={<ArrowDownRight className="size-4" />}
        color="text-rose-400"
        badge="bg-rose-500/10"
      />

      <SpendingBar income={summary.totalIncome} expense={summary.totalExpense} />
    </section>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  badge,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  badge: string;
}) {
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-400">{title}</span>
        <span className={`grid size-9 place-items-center rounded-xl ${badge} ${color}`}>{icon}</span>
      </div>
      <p className={`mt-4 text-3xl font-semibold tracking-tight tabular-nums ${color}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}

// Quanto das receitas já foi consumido pelas despesas.
function SpendingBar({ income, expense }: { income: number; expense: number }) {
  const percent = income > 0 ? Math.round((expense / income) * 100) : null;
  const width = percent === null ? (expense > 0 ? 100 : 0) : Math.min(percent, 100);

  const color =
    percent === null
      ? "bg-rose-500"
      : percent < 70
        ? "bg-emerald-400"
        : percent < 100
          ? "bg-amber-400"
          : "bg-rose-500";

  const message =
    income === 0 && expense === 0
      ? "Adicione transações para acompanhar seus gastos."
      : percent === null
        ? "Você tem despesas, mas nenhuma receita registrada."
        : percent <= 100
          ? `Você já gastou ${percent}% do que recebeu.`
          : `Suas despesas passaram ${percent - 100}% das receitas.`;

  return (
    <div className="panel p-5 sm:col-span-2 lg:col-span-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-300">Receitas × despesas</span>
        {percent !== null && <span className="font-medium text-zinc-400 tabular-nums">{percent}%</span>}
      </div>
      <div
        role="progressbar"
        aria-label="Percentual das receitas já gasto"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={width}
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/5"
      >
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${width}%` }} />
      </div>
      <p className="mt-3 text-sm text-zinc-400">{message}</p>
    </div>
  );
}
