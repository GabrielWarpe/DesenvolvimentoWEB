import Link from "next/link";
import { formatCurrency, formatDayHeading } from "@/lib/format";
import type { HistoryFilter, Transaction } from "@/lib/types";
import { DeleteButton } from "./DeleteButton";

const TABS: { label: string; href: string; value?: HistoryFilter }[] = [
  { label: "Todas", href: "/" },
  { label: "Receitas", href: "/?tipo=receitas", value: "receitas" },
  { label: "Despesas", href: "/?tipo=despesas", value: "despesas" },
];

const EMPTY_MESSAGES: Record<HistoryFilter | "todas", string> = {
  todas: "Nenhuma transação ainda.",
  receitas: "Nenhuma receita registrada.",
  despesas: "Nenhuma despesa registrada.",
};

function groupByDay(transactions: Transaction[]) {
  const groups = new Map<string, Transaction[]>();
  for (const t of transactions) {
    groups.set(t.occurredOn, [...(groups.get(t.occurredOn) ?? []), t]);
  }
  return [...groups];
}

export function TransactionList({
  transactions,
  filter,
  today,
}: {
  transactions: Transaction[];
  filter?: HistoryFilter;
  today: string;
}) {
  return (
    <section className="rounded-lg border border-line bg-surface">
      <div className="flex items-end justify-between gap-4 border-b border-line px-5 pt-4">
        <h2 className="pb-3 font-semibold">Histórico</h2>

        <nav aria-label="Filtrar histórico" className="flex gap-5 text-sm">
          {TABS.map((tab) => {
            const active = tab.value === filter;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={`-mb-px border-b-2 pb-3 transition-colors ${
                  active ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {transactions.length === 0 ? (
        <p className="px-5 py-16 text-center text-sm text-muted">{EMPTY_MESSAGES[filter ?? "todas"]}</p>
      ) : (
        <div className="pb-2">
          {groupByDay(transactions).map(([day, items]) => (
            <div key={day}>
              <h3 className="px-5 pt-4 pb-1 text-xs font-medium text-muted">{formatDayHeading(day, today)}</h3>
              <ul>
                {items.map((t) => {
                  const income = t.type === "income";
                  return (
                    <li key={t.id} className="group flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-paper/60">
                      <div className="min-w-0 flex-1">
                        <p className="truncate">{t.description}</p>
                        <p className="text-xs text-muted">{income ? "Receita" : "Despesa"}</p>
                      </div>
                      <span className={`shrink-0 font-medium tabular-nums ${income ? "text-income" : "text-expense"}`}>
                        {income ? "+" : "−"} {formatCurrency(t.amount)}
                      </span>
                      <DeleteButton id={t.id} description={t.description} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
