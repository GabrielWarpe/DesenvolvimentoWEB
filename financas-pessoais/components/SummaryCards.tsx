import { formatCurrency } from "@/lib/format";
import type { Summary } from "@/lib/types";

export function SummaryCards({ summary }: { summary: Summary }) {
  return (
    <section aria-label="Resumo" className="mt-8 rounded-lg border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted">Saldo atual</p>
          <p
            className={`mt-1 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl ${
              summary.balance < 0 ? "text-expense" : "text-ink"
            }`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </div>

        <dl className="flex gap-8 sm:gap-12">
          <Stat label="Receitas" value={summary.totalIncome} dot="bg-income" color="text-income" />
          <Stat label="Despesas" value={summary.totalExpense} dot="bg-expense" color="text-expense" />
        </dl>
      </div>

      <SpendingBar income={summary.totalIncome} expense={summary.totalExpense} />
    </section>
  );
}

function Stat({ label, value, dot, color }: { label: string; value: number; dot: string; color: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-sm text-muted">
        <span className={`size-2 rounded-full ${dot}`} />
        {label}
      </dt>
      <dd className={`mt-1 text-xl font-semibold tabular-nums ${color}`}>{formatCurrency(value)}</dd>
    </div>
  );
}

// A barra inteira representa as receitas: a parte vermelha é o que já foi gasto
// e a verde é o que sobrou.
function SpendingBar({ income, expense }: { income: number; expense: number }) {
  if (income === 0 && expense === 0) return null;

  const percent = income > 0 ? Math.round((expense / income) * 100) : null;
  const spent = percent === null ? 100 : Math.min(percent, 100);

  const message =
    percent === null
      ? "Há despesas, mas nenhuma receita registrada."
      : percent > 100
        ? `As despesas passaram ${percent - 100}% das receitas.`
        : `Você gastou ${percent}% do que recebeu.`;

  return (
    <div className="mt-6 border-t border-line pt-5">
      <p className="text-sm text-muted">{message}</p>
      <div
        role="progressbar"
        aria-label="Percentual das receitas já gasto"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={spent}
        className="mt-2.5 flex h-2 gap-0.5 overflow-hidden rounded-full"
      >
        {spent > 0 && <div className="h-full bg-expense" style={{ width: `${spent}%` }} />}
        {spent < 100 && <div className="h-full flex-1 bg-income" />}
      </div>
    </div>
  );
}
